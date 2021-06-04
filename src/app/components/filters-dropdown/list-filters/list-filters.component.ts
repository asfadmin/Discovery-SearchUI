import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListSearchType } from '@models';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser'

import { combineLatest, Subject } from 'rxjs';
import { map, debounceTime, withLatestFrom } from 'rxjs/operators';
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
  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';

  public searchList: string;
  public listSearchMode$ = this.store$.select(filtersStore.getListSearchMode);
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
    private snackBar: MatSnackBar,
    private store$: Store<AppState>,
    private screenSize: services.ScreenSizeService,
    private actions$: ActionsSubject,
    private ngxCsvParser: NgxCsvParser,
  ) {}

  ngOnInit() {
    this.subs.add(
      combineLatest(
      this.actions$.pipe(
        ofType(searchStore.SearchActionType.SET_SEARCH_TYPE_AFTER_SAVE, searchStore.SearchActionType.MAKE_SEARCH, filtersStore.FiltersActionType.RESTORE_FILTERS),
        withLatestFrom(this.store$.select(filtersStore.getSearchList).pipe(map(list => list.join('\n')))),
        // )
      )).subscribe(([[_, listStr]]) => this.searchList = listStr
      )
    );

    // this.subs.add(
    //   this.store$.select(filtersStore.getSearchList).pipe(
    //     map(list => list.join('\n'))
    //   ).subscribe(
    //     listStr => this.searchList = listStr
    //   )
    // );

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

          this.snackBar.open(`Removed ${duplicates} duplicate ${mode}${plural} from search list`, 'Search', {
            duration: 5000
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

  public onTextInputChange(text: string): void {
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

    // Parse the file you want to select for the operation along with the configuration
    this.ngxCsvParser.parse(files[0], { header: true, delimiter: ',' })
      .pipe().subscribe((result: Array<any>) => {

        // console.log('Result', result);
        // for(let res of result) {
        //   console.log(res['Granule Name']);
        // }
        const granules: string[] = result.map(row => row['Granule Name']);
        if(this.searchList !== undefined && this.searchList !== '') {
          this.searchList += ',' + granules.join();
        } else {
          this.searchList = granules.join();
        }
        // this.searchList = [this.searchList, granules.join()].join(' ');
        // result[0].forEach(obj => {
        //   console.log(obj['Granule Name']);
        // })
        // this.csvRecords = result;
      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
      });
    // if (ev.dataTransfer.items) {
    //   for (const item of ev.dataTransfer.items) {
    //     if (item.kind === 'file') {
    //       const file = item.getAsFile();
    //       this.addFile(file);
    //     }
    //   }
    // } else {
    //   for (const file of ev.dataTransfer.files) {
    //     this.addFile(file);
    //   }
    // }

    ev.preventDefault();
  }

  // private addFile(file): void {
  //   const fileName = file.name;
  //   // const size_limit = 10e6;

  //   console.log(fileName);
    
  //   // if (file.size > size_limit) {
  //   //   this.fileError$.next(FileErrors.TOO_LARGE);
  //   //   return;
  //   // }

  //   if (this.isValidFileType(fileName)) {
  //     this.files.add(file);
  //   } 
  //   // else {
  //   //   this.fileError$.next(FileErrors.INVALID_TYPE);
  //   // }
  // }

  // private isValidFileType(fileName: string): boolean {
  //   const validFileTypes = ['csv'];

  //   const fileExtension = this.getFileType(fileName);

  //   return validFileTypes.some(
  //     ext => ext === fileExtension
  //   );
  // }

  // private getFileType(fileName: string): string {
  //   return fileName.split('.').pop().toLowerCase();
  // }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
