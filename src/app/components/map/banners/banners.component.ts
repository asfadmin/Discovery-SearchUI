import {Component, OnInit, Input, Output, EventEmitter, Directive} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  trigger, style, animate, transition
} from '@angular/animations';

import { Banner } from '@models';

// tslint:disable-next-line:directive-selector
@Directive({selector: '[bannerCreate]'})
export class BannerCreateDirective implements OnInit {
  @Input() bannerCreate: Banner;

  constructor( private toastr: ToastrService ) {
  }

  ngOnInit(): void {
    let warningFlag = false;

    if (this.bannerCreate.name.toLowerCase().indexOf('outage') > -1 ||
      this.bannerCreate.name.toLowerCase().indexOf('network')  > -1 ||
      this.bannerCreate.name.toLowerCase().indexOf('problem') > -1
    ) { warningFlag = true; }

    if (warningFlag) {
      this.toastr.warning( this.bannerCreate.text, this.bannerCreate.name, {
        enableHtml: true,
        closeButton: true,
        disableTimeOut: true,
      });
    } else {
      this.toastr.success( this.bannerCreate.text, this.bannerCreate.name, {
        enableHtml: true,
        closeButton: true,
        timeOut: 10000,
      });
    }
  }

}

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

  constructor( ) {
  }

  ngOnInit(): void {
  }

  public processBannerText ( banner: Banner) {
    return banner.text;
  }

  public remove(banner: Banner): void {
    this.removeBanner.emit(banner);
  }
}
