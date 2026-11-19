import { Component, inject, input, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatAutocompleteTrigger,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatFormField,
  MatLabel,
  MatInput,
  MatSuffix,
} from '@angular/material/input';
import { MatOption } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

import { Hyp3ApiService } from '@services';

@Component({
  selector: 'app-hyp3-url-selector',
  templateUrl: './hyp3-url-selector.component.html',
  styleUrls: [
    './hyp3-url-selector.component.scss',
    '../preferences.component.scss',
  ],
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatIconButton,
    MatSuffix,
    MatIcon,
    MatButton,
    TranslateModule,
  ],
})
export class Hyp3UrlSelectorComponent {
  private hyp3 = inject(Hyp3ApiService);

  hyp3BackendUrl = input<string>();
  hyp3SavedUrls = model<string[]>();

  newHyp3Url = output<{
    backendUrl: string;
    savedUrls: string[];
  }>();

  public baseHyp3Url = this.hyp3.baseUrl;

  onResetHyp3Url() {
    this.hyp3.setDefaultApiUrl();

    this.updateHyp3Url(this.hyp3.apiUrl);
  }

  onNewHyp3Url(event: Event) {
    const url = (event.target as HTMLInputElement).value;
    this.updateHyp3Url(url);
  }

  onAutoCompleteChangeHyp3Url(url: string) {
    this.updateHyp3Url(url);
  }

  onRemoveHyp3Url(url: string) {
    this.hyp3SavedUrls.set(
      this.hyp3SavedUrls().filter((hyp3Url) => hyp3Url !== url),
    );

    this.onResetHyp3Url();
  }

  private updateHyp3Url(url: string) {
    const temp = this.stripTrailingSlash(url);

    this.addHyp3Url(temp);

    this.newHyp3Url.emit({
      backendUrl: temp,
      savedUrls: this.hyp3SavedUrls(),
    });
  }

  private addHyp3Url(url: string): void {
    const uniqueUrls = new Set(this.hyp3SavedUrls());
    uniqueUrls.add(url);

    this.hyp3SavedUrls.set([...uniqueUrls]);
  }

  private stripTrailingSlash = (url: string) => {
    return url.endsWith('/') ? url.slice(0, -1) : url;
  };
}
