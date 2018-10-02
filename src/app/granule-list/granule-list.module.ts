import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GranuleListComponent } from './granule-list.component';
import { GranuleComponent } from './granule/granule.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        GranuleListComponent,
        GranuleComponent
    ],
    exports: [
        GranuleListComponent
    ]
})
export class GranuleListModule { }
