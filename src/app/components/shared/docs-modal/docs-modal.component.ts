// This component presents a info-icon or text link that opens a modal containing an iFrame displaying
// ASF's documentation (mkDocs) at a specified page and anchor.
//
// * Using the component without setting values results in info-icon that opens a modal of the documentation home page.
// * Setting the "url" value will result in the specified URL being opened.
// * Setting a value for "text" will result in the specified text being displayed in place of the info-icon.
// * You can apply a class to the component to change the formatting of the info-icon or text.
//
// USAGE EXAMPLES:
//
//   <app-docs-modal></app-docs-modal>
//
//   <app-docs-modal url="https://docs.asf.alaska.edu/vertex/manual/#date-filters">
//   </app-docs-modal>
//
//    <app-docs-modal class="info-icon"
//      text="Documentation"
//      url="https://docs.asf.alaska.edu/vertex/manual/#date-filters">
//    </app-docs-modal>

import { Component, Input, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from "@ngx-translate/core";
import { SubSink } from 'subsink';


export interface DialogData {
  rawUrl: string;
  safeUrl: any;
}

@Component({
  selector: 'app-docs-modal',
  templateUrl: './docs-modal.component.html',
  styleUrls: ['./docs-modal.component.scss']
})
export class DocsModalComponent implements OnInit, OnDestroy {
  @Input() url: string;
  @Input() text: string;
  @Input() icon: string = 'info';
  @Input() tooltip: string;
  public docURL: string;
  public safeDocURL: any;

  public subs = new SubSink();

  constructor(public dialog: MatDialog,
              public translate: TranslateService,
              private _sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.updateLink();
    this.subs.add(this.translate.onLangChange.subscribe(_currentLanguage => {
      this.updateLink();
    }));
  }

  private updateLink(): void {
    this.docURL = (this.url) ? this.url : 'https://docs.asf.alaska.edu';
    let tempURL = this.docsLanguageAdjust(this.docURL);
    this.safeDocURL = this._sanitizer.bypassSecurityTrustResourceUrl(tempURL);
  }

  public showDoc() {
    if (this.isAsfUrl(this.url)) {
      const dialogRef = this.dialog.open(DocsModalIframeComponent, {
        width: '80vw', // sets width of dialog
        height: '80vh', // sets width of dialog
        maxWidth: '100vw', // overrides default width of dialog
        maxHeight: '100vh', // overrides default height of dialog
        data: {
          rawUrl: this.docURL,
          safeUrl: this.safeDocURL,
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    } else {
      window.open(this.url, '_blank');
    }
  }

  public isAsfUrl(url: string): boolean {
    const domain = (new URL(url)).hostname.replace('www.', '');
    return domain.includes('asf.alaska.edu');
  }

  public docsLanguageAdjust(url: string): string {
    let langCode = this.translate.currentLang;
    if (langCode === 'es') {
      url = this.insertLangCode(url, langCode);
    }
    return url;
  }

  public insertLangCode(url: string, langCode: string): string {
    let newUrl = url.replace('.edu/', '.edu/' + langCode + '/');
    return newUrl;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}

@Component({
  selector: 'app-docs-modal-iframe',
  templateUrl: 'docs-modal-iframe.html',
  styleUrls: ['docs-modal-iframe.scss']
})
export class DocsModalIframeComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  public openDoc() {
    window.open(this.data.rawUrl, '_blank');
  }
}
