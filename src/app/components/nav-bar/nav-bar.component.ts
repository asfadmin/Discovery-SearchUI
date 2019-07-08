import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @Output() openQueue = new EventEmitter<void>();
  @Output() clearSearch = new EventEmitter<void>();

  @Input() isLoading: boolean;

  public onClearSearch(): void {
    this.clearSearch.emit();
  }
}
