import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListSearchType } from '@models';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
