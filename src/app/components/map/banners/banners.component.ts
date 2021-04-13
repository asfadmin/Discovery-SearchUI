import { Component, OnInit, Input, Directive } from '@angular/core';
import { ActiveToast, Toast, ToastrService } from 'ngx-toastr';
import { Banner } from '@models';
import { BannerDialogComponent} from '@components/map/banners/banner-dialog/banner-dialog.component';

// tslint:disable-next-line:directive-selector
@Directive({selector: '[bannerCreate]'})
export class BannerCreateDirective implements OnInit {
  @Input() bannerCreate: Banner;
  constructor( private toastr: ToastrService,
               public dialog: BannerDialogComponent,
               ) {}

  public toastRef;

  ngOnInit(): void {
    const msg: string = this.bannerCreate.text;
    const title: string = this.bannerCreate.name;
    const toast: ActiveToast<any> = this.toastr.info(msg, title, {
      enableHtml: true,
      closeButton: true,
      disableTimeOut: true,
      tapToDismiss: false,
    });

    const toastComponent: Toast = toast.toastRef.componentInstance;
    toastComponent.message = msg;

    toast.onTap.subscribe(x => {
      this.dialog.openDialog();
      // toastComponent.message = msg + '\nthis is the full message';
      // alert(`<b>${title}</b>\n ${msg}`);
      console.log(x);
    });
  }

  public myFunction() {
    console.log('myFunction()');
  }
}

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent implements OnInit {
  @Input() banners: Banner[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
