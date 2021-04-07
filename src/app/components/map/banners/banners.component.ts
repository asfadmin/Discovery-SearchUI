import {Component, OnInit, Input, Output, EventEmitter, Directive} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Banner } from '@models';

// tslint:disable-next-line:directive-selector
@Directive({selector: '[bannerCreate]'})
export class BannerCreateDirective implements OnInit {
  @Input() bannerCreate: Banner;

  constructor( private toastr: ToastrService ) {
  }

  ngOnInit(): void {
    this.toastr.warning(this.bannerCreate.text, this.bannerCreate.name, {
      enableHtml: true,
      closeButton: true,
      disableTimeOut: true,
    });
  }
}

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent implements OnInit {
  @Input() banners: Banner[];
  @Output() removeBanner = new EventEmitter<Banner>();

  constructor() {
  }

  ngOnInit(): void {
  }

  public remove(banner: Banner): void {
    this.removeBanner.emit(banner);
  }
}
