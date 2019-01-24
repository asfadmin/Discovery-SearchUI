import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';


@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
    @Input() isLoading: boolean;

    @Output() newSearch = new EventEmitter<void>();
    @Output() clearSearches = new EventEmitter<void>();

    constructor(private fb: FormBuilder) {}
}
