import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hide-icon',
  templateUrl: './hide-icon.component.html',
  styleUrls: ['./hide-icon.component.css']
})
export class HideIconComponent implements OnInit {
  @Output() hide = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onHide(e: Event): void {
    e.stopPropagation();
    this.hide.emit();
  }
}
