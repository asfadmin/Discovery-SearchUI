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

import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

export interface DialogData {
  rawUrl: string;
  safeUrl: any;
}

@Component({
  selector: 'app-docs-modal',
  templateUrl: './docs-modal.component.html',
  styleUrls: ['./docs-modal.component.scss']
})
export class DocsModalComponent implements OnInit {
  @Input() url: string;
  @Input() text: string;

  // public docURL = 'https://docs.asf.alaska.edu/vertex/manual/#date-filters';
  public docURL: string;
  public safeDocURL: any;

  constructor(public dialog: MatDialog,
              private _sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.docURL = ( this.url ) ? this.url : 'https://docs.asf.alaska.edu';
    this.safeDocURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.docURL);
  }

  public showDoc() {
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
