import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-projection-selection',
  templateUrl: './projection-selection.component.html',
  styleUrls: ['./projection-selection.component.css']
})
export class ProjectionSelectionComponent implements OnInit {
  @Output() newProjection = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }
}
