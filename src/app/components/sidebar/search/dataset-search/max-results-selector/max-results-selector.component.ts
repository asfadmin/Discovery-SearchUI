import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-max-results-selector',
  templateUrl: './max-results-selector.component.html',
  styleUrls: ['./max-results-selector.component.css']
})
export class MaxResultsSelectorComponent implements OnInit {
  @Input() maxResults: number;
  @Output() newMaxResults = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  public onNewMaxResults(newMaxResults: number): void {
    this.newMaxResults.emit(newMaxResults);
  }
}
