import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-product-name',
  templateUrl: './product-name.component.html',
  styleUrls: ['./product-name.component.scss']
})
export class ProductNameComponent {
  @Input() name = '';

  public isNameHovered = false;

  onNameHover(): void {
    this.isNameHovered = !this.isNameHovered;
  }

}
