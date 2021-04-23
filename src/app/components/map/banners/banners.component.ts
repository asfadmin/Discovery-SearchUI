import { Component, OnInit, Input, Directive } from '@angular/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';
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
  public overrides = {
    enableHtml: true,
    closeButton: true,
    disableTimeOut: true,
    tapToDismiss: false,
  };

  ngOnInit(): void {
    const title: string = this.bannerCreate.name;
    const type: string = this.bannerCreate.type;
    let msg: string = this.bannerCreate.text.substring(0, this.maxMsgLength);
    let toast: ActiveToast<any>;
    let oneLiner = false;

    const lines = this.bannerCreate.text.split('<br>');

    this.msgOverflow = (this.bannerCreate.text.length > this.maxMsgLength);

    if (lines.length > 2 && lines[1].trim().length === 0 && lines[1].length <= this.maxMsgLength) {
      oneLiner = true;
    }

    console.log('lines:', lines);

    if (oneLiner) {
      msg = lines[0].trim() + this.moreMsg;
    } else {
      if (this.msgOverflow) {
        msg = msg.trim() + this.moreMsg;
      }
    }

    switch (type) {
      case 'error': {
        toast = this.toastr.error(msg, title, this.overrides);
        break;
      }
      case 'outages': {
        toast = this.toastr.warning(msg, title, this.overrides);
        break;
      }
      case 'news': {
        toast = this.toastr.info(msg, title, this.overrides);
        break;
      }
      default: {
        toast = this.toastr.info(msg, title, this.overrides);
        break;
      }
    }

    toast.onTap.subscribe(_x => {
      if (this.msgOverflow || oneLiner) {
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
