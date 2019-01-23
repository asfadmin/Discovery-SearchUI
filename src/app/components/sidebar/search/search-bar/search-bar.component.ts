import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';


@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
    @Input() isLoading: boolean;

    @Output() newSearch = new EventEmitter<string>();
    @Output() clearSearches = new EventEmitter<void>();

    queryForm = this.fb.group({
        query: ['']
    });

    constructor(private fb: FormBuilder) {}

    public onSubmit() {
        this.newSearch.emit(this.queryForm.value.query);
    }
}
