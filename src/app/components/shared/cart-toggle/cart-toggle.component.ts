import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-cart-toggle',
    templateUrl: './cart-toggle.component.html',
    styleUrls: ['./cart-toggle.component.scss'],
    standalone: false
})
export class CartToggleComponent implements OnInit {
  @Output() toggle = new EventEmitter<boolean>();
  @Input() isQueued: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  public onToggle(): void {
    this.toggle.emit(this.isQueued);
  }
}
