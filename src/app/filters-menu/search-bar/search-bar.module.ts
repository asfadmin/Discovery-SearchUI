import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { SearchBarComponent } from './search-bar.component';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,

        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCardModule
    ],
    declarations: [ SearchBarComponent ],
    exports: [ SearchBarComponent ]
})
export class SearchBarModule { }
