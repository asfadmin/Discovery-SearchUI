import { Component, OnInit } from '@angular/core';
import { SharedModule } from "@shared";
import { beta } from '@models';
import * as filtersStore from '@store/filters';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-baseline-frame-reference-toggle',
    standalone: true,
    imports: [
        CommonModule,
        SharedModule,
        MatSlideToggleModule,
        FormsModule,
    ],
    templateUrl: './baseline-frame-reference-toggle.component.html',
    styleUrl: './baseline-frame-reference-toggle.component.scss'
})
export class BaselineFrameReferenceToggleComponent implements OnInit {

    public datasets = [beta];
    public selectedDataset = 'SENTINEL-1 INTERFEROGRAM (BETA)'
    public shouldUseFramesForReference: boolean = false;

    constructor(private store$: Store<AppState>) { }

    ngOnInit(): void {
        this.store$.select(filtersStore.getShouldUseFramesForReference).subscribe(
            usingReference => this.shouldUseFramesForReference = usingReference
        )
    }
    public onFrameModeToggled() {
        this.store$.dispatch(new filtersStore.SetUseFrameForBaseline(this.shouldUseFramesForReference))
    }
}
