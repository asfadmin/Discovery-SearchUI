import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ListSearchType } from '@models';

@Component({
  selector: 'app-list-search',
  templateUrl: './list-search.component.html',
  styleUrls: ['./list-search.component.css']
})
export class ListSearchComponent {
  @Input() mode = ListSearchType;

  @Output() newListSearchMode = new EventEmitter<ListSearchType>();
  @Output() newListSearch = new EventEmitter<string[]>();

  public types = ListSearchType;

  public onGranuleModeSelected(): void {
    this.newListSearchMode.emit(ListSearchType.GRANULE);
  }

  public onProductModeSelected(): void {
    this.newListSearchMode.emit(ListSearchType.PRODUCT);
  }

  public onTextInputChange(text: string): void {
    const granules = text
      .split(/[\s\n,\t]+/)
      .filter(v => v);

    const unique = Array.from(new Set(granules));

    this.newListSearch.emit(unique);
  }
}
