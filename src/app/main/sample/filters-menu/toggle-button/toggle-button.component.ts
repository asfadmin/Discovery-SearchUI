import { Component, OnInit, Input } from '@angular/core';

import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.css']
})
export class ToggleButtonComponent implements OnInit {
  @Input() isOpen: boolean;

  public openIcon = faChevronRight;
  public closedIcon = faChevronLeft;

  constructor() { }

  ngOnInit(): void {
  }
}
