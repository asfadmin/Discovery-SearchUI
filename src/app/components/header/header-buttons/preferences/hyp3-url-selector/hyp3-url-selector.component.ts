import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Hyp3ApiService } from '@services';

@Component({
  selector: 'app-hyp3-url-selector',
  templateUrl: './hyp3-url-selector.component.html',
  styleUrl: './hyp3-url-selector.component.scss'
})
export class Hyp3UrlSelectorComponent {
  @Input() hyp3BackendUrl: string;

  @Output() newHyp3Url = new EventEmitter<string>();

  constructor(private hyp3: Hyp3ApiService) {}

  onResetHyp3Url() {
    this.hyp3.setDefaultApiUrl();
    this.hyp3BackendUrl = this.hyp3.apiUrl;

    this.newHyp3Url.emit(this.hyp3BackendUrl);
  }

  onNewHyp3Url(event: Event) {
    const url = (event.target as HTMLInputElement).value;
    this.newHyp3Url.emit(url);
  }
}
