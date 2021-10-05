import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListSearchType } from '@models';

import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import * as xml2js from 'xml2js';
import { combineLatest, from, Subject } from 'rxjs';
import { map, debounceTime, withLatestFrom, first, tap, delay, filter } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';

import * as models from '@models';
import * as services from '@services';
import { ofType } from '@ngrx/effects';

enum ListPanel {
  SEARCH = 'search',
  LIST = 'list'
}

enum FileErrors {
  TOO_LARGE = 'Too large',
  INVALID_TYPE = 'Invalid Type'
}

@Component({
  selector: 'app-list-filters',
  templateUrl: './list-filters.component.html',
  styleUrls: ['./list-filters.component.scss']
})
export class ListFiltersComponent implements OnInit, OnDestroy {
  public selectedPanel: ListPanel | null = null;
  public types = ListSearchType;
  public panels = ListPanel;
  public files: Set<File> = new Set();

  public fileError$ = new Subject<{fileName: string, fileError: FileErrors}>();

  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';

  public searchList: string;
  public listSearchMode$ = this.store$.select(filtersStore.getListSearchMode);
  private listSearchMode: ListSearchType;
  private newListInput$ = new Subject<string | null>();
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  private subs = new SubSink();

  public listExamples = {
    [this.types.PRODUCT]: [
      'S1B_IW_GRDH_1SDV_20161124T032008_20161124T032033_003095_005430_9906-GRD_HD',
      'S1-GUNW-D-R-087-tops-20190301_20190223-161540-20645N_18637N-PP-7a85-v2_0_1-unwrappedPhase',
      'ALPSRP111041130-RTC_HI_RES'
    ].join(', '),
    [this.types.SCENE]: [
      'S1B_IW_GRDH_1SDV_20161124T032008_20161124T032033_003095_005430_9906',
      'S1-GUNW-D-R-087-tops-20190301_20190223-161540-20645N_18637N-PP-7a85-v2_0_1',
      'ALPSRP111041130'
    ].join(', ')
  };

  constructor(
    private store$: Store<AppState>,
    private screenSize: services.ScreenSizeService,
    private actions$: ActionsSubject,
    private notificationService: services.NotificationService,
    private ngxCsvParser: NgxCsvParser,
  ) {}

  ngOnInit() {

    this.subs.add(
      this.fileError$.pipe(
        tap(
          (file_error) => {
            if (file_error.fileError === FileErrors.INVALID_TYPE) {
              this.notificationService.error(
                `Invalid File Type for file ${file_error.fileName}`,
                'File Error',
                { timeOut: 5000 }
              );
            } else if (file_error.fileError === FileErrors.TOO_LARGE) {
              this.notificationService.error(
                `File is too large (over 10MB) for file ${file_error.fileName}`,
                'File Error',
                { timeOut: 5000 }
              );
            }
          }
        ),
        delay(820)
      ).subscribe(
        _ => _
      )


    );

    this.subs.add(
      this.listSearchMode$.subscribe(mode => this.listSearchMode = mode)
    );

    this.subs.add(
      combineLatest(
      this.actions$.pipe(
        ofType(
          searchStore.SearchActionType.SET_SEARCH_TYPE_AFTER_SAVE,
          searchStore.SearchActionType.MAKE_SEARCH,
          filtersStore.FiltersActionType.RESTORE_FILTERS
        ),
        withLatestFrom(this.store$.select(filtersStore.getSearchList).pipe(map(list => list.join('\n')))),
      )).subscribe(([[_, listStr]]) => this.searchList = listStr
      )
    );

    this.subs.add(
      this.newListInput$.asObservable().pipe(
        debounceTime(750),
        withLatestFrom(this.listSearchMode$)
      ).subscribe(([text, searchMode]) => {
        const scenes = text
          .split(/[\s\n,\t]+/)
          .filter(v => v);

        const unique = Array.from(new Set(scenes));

        if (scenes.length > unique.length) {
          const duplicates = scenes.length - unique.length;
          const mode = searchMode === this.types.PRODUCT ?
            'file' : 'scene';
          const plural = duplicates === 1 ? '' : 's';

          this.notificationService.info(`Removed ${duplicates} duplicate ${mode}${plural} from search list`, 'Search', {
            timeOut: 5000
          });
        }

        this.store$.dispatch(new filtersStore.SetSearchList(unique));
      })
    );
  }

  public isSelected(panel: ListPanel): boolean {
    return this.selectedPanel === panel;
  }

  public selectPanel(panel: ListPanel): void {
    this.selectedPanel = panel;
  }

  public onSceneModeSelected(): void {
    this.onNewListSearchMode(ListSearchType.SCENE);
  }

  public onProductModeSelected(): void {
    this.onNewListSearchMode(ListSearchType.PRODUCT);
  }

  public onTextInputChange(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.setNewListInput(text);
  }

  private setNewListInput(text: string): void {
    this.newListInput$.next(text);
  }

  public onNewListSearchMode(mode: models.ListSearchType): void {
    this.store$.dispatch(new filtersStore.SetListSearchType(mode));
  }

  public onFileDragOver(e) {
    e.preventDefault();
  }

  public onFileDrop(ev) {
    const files = ev.dataTransfer.files;

    for (const file of files) {
      const fileName: string = file.name;
      const size_limit = 10e6;

      if (file.size > size_limit) {
        this.fileError$.next({fileName, fileError: FileErrors.TOO_LARGE});
        continue;
      }

      if (this.isValidFileType(file.name)) {
        const filetype = this.getFileType(file.name);

        switch (filetype) {
          case 'csv':
            this.parseCSV(file);
            break;
          case 'geojson':
            this.parseGeoJSON(file);
            break;
          case 'kml':
            this.parseKML(file);
            break;
          case 'metalink':
            this.parseMetalink(file);
            break;
          default:
            break;
        }
      } else {
        this.fileError$.next({fileName, fileError: FileErrors.INVALID_TYPE});
      }
    }

    ev.preventDefault();
  }

  private isValidFileType(fileName: string): boolean {
    const validFileTypes = ['csv', 'geojson', 'kml', 'metalink'];

    const fileExtension = this.getFileType(fileName);

    return validFileTypes.some(
      ext => ext === fileExtension
    );
  }

  private getFileType(fileName: string): string {
    return fileName.split('.').pop().toLowerCase();
  }

  private parseCSV(file) {
    this.ngxCsvParser.parse(file, { header: true, delimiter: ',' })
    .pipe(
      first(),
      map((output: Array<{}>) => ({
          result: output,
          granules_key: Object.keys(output[0]).find(key => key.toLowerCase().includes('granule'))
        })
      ),
      tap(res => {
        if (res.granules_key === undefined) {
          this.notificationService.listImportFailed('csv');
        }
      }),
      filter(result => !!result.granules_key),
      ).subscribe(({result, granules_key}) => {
      const granules: string[] = result
        .filter(entry => entry.hasOwnProperty(granules_key))
        .map(entry => {
          let processingType = '';

          if (this.listSearchMode === ListSearchType.PRODUCT) {
            const processLevel = '-' + entry?.['Processing Level']?.replace('-', '_');
            if (processLevel !== '-') {
              processingType = processLevel;
            }
          }

          return entry[granules_key] + processingType;
        });

      this.updateSearchList(granules);
    }, (_: NgxCSVParserError) => {
      this.notificationService.listImportFailed('CSV');
    });
  }

  private parseGeoJSON(file) {
    const filereader = new FileReader();
      filereader.onload = _ => {
        const res = filereader.result as string;
        const featuresCollection: GeoJSON.FeatureCollection = JSON.parse(res);
        if (!featuresCollection) {
          this.notificationService.listImportFailed('GeoJSON');
          return;
        }
        const features = featuresCollection.features;

        const typeKey = this.listSearchMode === ListSearchType.PRODUCT ? 'fileID' : 'sceneName';
        const granules = features?.map(feature => feature?.properties?.[typeKey]);
        if (!granules) {
          this.notificationService.listImportFailed('GeoJSON');
          return;
        }

        this.updateSearchList(granules);
    };
    filereader.readAsText(file);
  }

  private parseKML(file) {
    if (this.listSearchMode === ListSearchType.SCENE) {
      const filereader = new FileReader();
        filereader.onload = _ => {
          const res = filereader.result as string;
          const parser = new xml2js.Parser({ explicitArray: false });
          const observable = from (parser.parseStringPromise(res).catch(__ => {}));

          observable.pipe(first()).subscribe(result => {
              const placemarks: [] = result?.['kml']?.['Document']?.['Placemark'] ?? null;

              if (!placemarks) {
                this.notificationService.listImportFailed('KML');
                return;
              }

              const granules: string[] = placemarks.map(placemark => {
                  return placemark?.['name'];
                });

              if (!granules) {
                this.notificationService.listImportFailed('KML');
                return;
              }

              this.updateSearchList(granules);
            });
      };
      filereader.readAsText(file);
    }
  }

  private parseMetalink(file) {
    if (this.listSearchMode === ListSearchType.SCENE) {
    const filereader = new FileReader();
      filereader.onload = _ => {
        const res = filereader.result as string;
        const parser = new xml2js.Parser({ explicitArray: false });
        const observable = from (parser.parseStringPromise(res).catch(__ => {}));

        observable.pipe(first()).subscribe(result => {
            const files: [] = result?.['metalink']?.['files']?.['file'];
            if (!files) {
              this.notificationService.listImportFailed('Metalink');
              return;
            }
            const fileNames = files.map(fileMeta => (fileMeta?.['$']?.['name'] as string)?.split('.')?.shift());

            if (!fileNames) {
              this.notificationService.listImportFailed('Metalink');
              return;
            }
            this.updateSearchList(fileNames);
          });
    };
    filereader.readAsText(file);
  }
  }

  private updateSearchList(granules: string[]) {
    let current_list = this.searchList;

    if (current_list !== undefined && current_list !== '') {
      current_list += ',' + granules.join();
    } else {
      current_list = granules.join();
    }

    this.searchList = current_list;
    this.setNewListInput(current_list);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
