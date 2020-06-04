import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  trigger, style, animate, transition
} from '@angular/animations';

import { Banner } from '@models';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
  animations: [
    trigger('bannerTransition', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ],
})
export class BannersComponent implements OnInit {
  @Input() banners: Banner[];
  @Output() removeBanner = new EventEmitter<Banner>();

  constructor() { }

  ngOnInit(): void {
  }

  public remove(banner: Banner): void {
    this.removeBanner.emit(banner);
  }
}
