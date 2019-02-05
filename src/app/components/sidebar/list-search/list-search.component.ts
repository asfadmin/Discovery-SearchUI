import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-search',
  templateUrl: './list-search.component.html',
  styleUrls: ['./list-search.component.css']
})
export class ListSearchComponent {
  @Output() newGranuleList = new EventEmitter<string[]>();

  public onTextInputChange(text: string): void {
    const granules = text
      .split(/[\s\n,\t]+/)
      .filter(v => v);

    this.newGranuleList.emit(granules);
  }
}
