import { Component, OnInit, Input, Directive } from '@angular/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { Banner } from '@models';
import { MatDialog } from '@angular/material/dialog';
import { BannerDialogComponent } from '@components/map/banners/banner-dialog/banner-dialog.component';

export interface DialogData {
  title: string;
}

@Directive({selector: '[bannerCreate]'})
export class BannerCreateDirective implements OnInit {
  @Input() bannerCreate: Banner;
  private closedBannersKey = 'closed-banners-key';

  public toastRef;
  public maxMsgLength = 150;
  public msgOverflow = false;
  public moreMsg = ' <a>[MORE]</a>';
  public overrides = {
    enableHtml: true,
    closeButton: true,
    disableTimeOut: true,
    tapToDismiss: false,
  };

  constructor(
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const id: string = this.bannerCreate.id;
    const closedBanners = this.loadClosedBannerIds();

    if (!closedBanners[id]) {
      this.createToast();
    }
  }

  private createToast(): void {
    const title: string = this.bannerCreate.name;
    const type: string = this.bannerCreate.type;
    let toast: ActiveToast<any>;

    let msg: string = this.bannerCreate.text.substring(0, this.maxMsgLength);

    const lines = this.bannerCreate.text.split('<br>');

    this.msgOverflow = (this.bannerCreate.text.length > this.maxMsgLength);

    const oneLiner = (
      lines.length > 2 &&
      lines[1].trim().length === 0 &&
      lines[1].length <= this.maxMsgLength
    );

    if (oneLiner) {
      msg = `${lines[0].trim()}${this.moreMsg}`;
    } else {
      if (this.msgOverflow) {
        msg = `${msg.trim()}...${this.moreMsg}`;
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

    toast.onHidden.subscribe(_ => {
      const closedBanners = this.loadClosedBannerIds();

      closedBanners[this.bannerCreate.id] = true;

      this.saveClosedBannerIds(closedBanners);
    });

    toast.onTap.subscribe(_x => {
      if (this.msgOverflow || oneLiner) {
        const dialogRef = this.dialog.open(BannerDialogComponent, {
          data: {title: title},
          panelClass: 'banner-dialog',
          maxWidth: '80vw',
        });
        dialogRef.componentInstance.htmlContent = this.openLinksInNewTab(this.bannerCreate.text);
      }
    });
  }

  private openLinksInNewTab(bannerHtml: string): string {
      return bannerHtml.replace(
        '<a href=',
        '<a target="_blank" href='
      );
  }

  private loadClosedBannerIds(): {[id: string]: boolean} {
    const closedBannersStr = localStorage.getItem(this.closedBannersKey);

    if (closedBannersStr) {
      return JSON.parse(closedBannersStr);
    } else {
      return {};
    }
  }

  private saveClosedBannerIds(closed: {[id: string]: boolean}): void {
    localStorage.setItem(this.closedBannersKey, JSON.stringify(closed));
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
