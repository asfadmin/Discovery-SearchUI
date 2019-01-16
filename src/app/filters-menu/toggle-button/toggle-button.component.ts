import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.css']
})
export class ToggleButtonComponent implements OnInit {
  @Input() isOpen: boolean;

  public openIcon = 'keyboard_arrow_down';
  public closedIcon = 'keyboard_arrow_up';

  constructor() { }

  ngOnInit(): void {
  }
}
