import {
  Component,
  OnDestroy,
  inject,
  input,
  signal,
  computed,
} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

export interface DialogData {
  rawUrl: string;
  safeUrl: any;
}

@Component({
  selector: 'app-docs-modal',
  templateUrl: './docs-modal.component.html',
  styleUrls: ['./docs-modal.component.scss'],
  imports: [MatTooltip, MatIcon, TranslateModule],
})
export class DocsModalComponent implements OnDestroy {
  dialog = inject(MatDialog);
  translate = inject(TranslateService);
  private _sanitizer = inject(DomSanitizer);

  url = input.required<string>();
  text = input<string>();
  custStyle = input<string>();
  icon = input('help_outline');
  description = input<string>();
  tooltip = input<string>();

  private langTick = signal(this.translate.currentLang);

  public docURL = computed(() =>
    this.url() ? this.url() : 'https://docs.asf.alaska.edu',
  );

  public safeDocURL = computed(() => {
    const tempURL = this.docsLanguageAdjust(this.docURL(), this.langTick());
    return this._sanitizer.bypassSecurityTrustResourceUrl(tempURL);
  });

  public subs = new SubSink();

  constructor() {
    this.subs.add(
      this.translate.onLangChange.subscribe((event) => {
        this.langTick.set(event.lang);
      }),
    );
  }

  public showDoc() {
    if (this.isAsfUrl(this.url())) {
      const dialogRef = this.dialog.open(DocsModalIframeComponent, {
        width: '80vw',
        height: '80vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: {
          rawUrl: this.docURL(),
          safeUrl: this.safeDocURL(),
        },
      });
      dialogRef.afterClosed().subscribe((_result) => {
        // console.log(`Dialog result: ${_result}`);
      });
    } else {
      window.open(this.url(), '_blank');
    }
  }

  public isAsfUrl(url: string): boolean {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain.includes('asf.alaska.edu') && domain !== 'asf.alaska.edu';
  }

  public docsLanguageAdjust(url: string, langCode: string): string {
    if (langCode === 'es') {
      url = this.insertLangCode(url, langCode);
    }
    return url;
  }

  public insertLangCode(url: string, langCode: string): string {
    const newUrl = url.replace('.edu/', '.edu/' + langCode + '/');
    return newUrl;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

@Component({
  selector: 'app-docs-modal-iframe',
  templateUrl: 'docs-modal-iframe.html',
  styleUrls: ['docs-modal-iframe.scss'],
  imports: [
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslateModule,
  ],
})
export class DocsModalIframeComponent {
  data = inject<DialogData>(MAT_DIALOG_DATA);

  public openDoc() {
    window.open(this.data.rawUrl, '_blank');
  }
}
