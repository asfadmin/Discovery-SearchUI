import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-single-search-type',
  templateUrl: './single-search-type.component.html',
  styleUrl: './single-search-type.component.scss'
})
export class SingleSearchTypeComponent {
  @Input() public nameKey: string;
  @Input() public descriptionKey: string;
  @Input() public helpUrl: string;

  @Input() public icon: string;
  @Input() public iconType: string;

  @Output() public onOpenDocs = new EventEmitter<Event>();

  public iconTypes = models.IconType;

  public isReadMore = true;

  public onOpenDocsClick(event: Event) {
    this.onOpenDocs.emit(event);
    console.log(this.helpUrl);
  }
}
