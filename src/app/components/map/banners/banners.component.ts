import { Component, OnInit, Input, Directive } from '@angular/core';
import { ActiveToast, Toast, ToastrService } from 'ngx-toastr';
import { Banner } from '@models';
import { MatDialog } from '@angular/material/dialog';
import { BannerDialogComponent } from '@components/map/banners/banner-dialog/banner-dialog.component';

export interface DialogData {
  title: string;
}


// tslint:disable-next-line:directive-selector
@Directive({selector: '[bannerCreate]'})
export class BannerCreateDirective implements OnInit {
  @Input() bannerCreate: Banner;
  constructor( private toastr: ToastrService,
               public bannerDialog: MatDialog,
               ) {}

  public toastRef;
  public maxMsgLength = 150;
  public msgOverflow = false;
  public moreMsg = '... <a>[MORE]</a>';

  ngOnInit(): void {
    const title: string = this.bannerCreate.name;
    const msg = this.bannerCreate.text.substring( 0, this.maxMsgLength );
    

    (this.bannerCreate.text.length > this.maxMsgLength) ?
      this.msgOverflow = true :
      this.msgOverflow = false;

    const toast: ActiveToast<any> = this.toastr.info(msg, title, {
      enableHtml: true,
      closeButton: true,
      disableTimeOut: true,
      tapToDismiss: false,
    });

    const toastComponent: Toast = toast.toastRef.componentInstance;
    if (this.msgOverflow) {
      toastComponent.message = msg + this.moreMsg;
    }

    toast.onTap.subscribe(_x => {
      if (this.msgOverflow) {
        const dialogRef = this.bannerDialog.open(BannerDialogComponent, {
          data: {title: title},
          panelClass: 'banner-dialog',
          maxWidth: '80vw',
        });
        dialogRef.componentInstance.htmlContent = this.bannerCreate.text;
      }
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

  constructor() {
  }

  ngOnInit(): void {
  }

}
