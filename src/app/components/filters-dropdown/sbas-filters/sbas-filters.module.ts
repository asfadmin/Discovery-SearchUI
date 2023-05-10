import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatSharedModule } from '@shared';
import { SeasonSelectorModule } from '@components/shared/selectors/season-selector';
import { SbasOverlapSelectorModule } from '@components/shared/selectors/sbas-overlap-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { SbasFiltersComponent } from './sbas-filters.component';
import { MasterSceneSelectorModule } from '@components/shared/selectors/master-scene-selector';
import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';
import { ResultsMenuModule } from '@components/results-menu';
import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { DocsModalModule } from '@components/shared/docs-modal';
import { SharedModule } from "@shared";


@NgModule({
  declarations: [SbasFiltersComponent],
    imports: [
        CommonModule,
        MatExpansionModule,
        MatSharedModule,
        SeasonSelectorModule,
        SbasOverlapSelectorModule,
        DateSelectorModule,
        MasterSceneSelectorModule,
        SearchTypeSelectorModule,
        ResultsMenuModule,
        CopyToClipboardModule,
        DocsModalModule,
        SharedModule
    ],
  exports: [
    SbasFiltersComponent
  ]
})
export class SbasFiltersModule { }
