import { Component, inject } from '@angular/core';
import * as services from '@services';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-hyp3-url',
  templateUrl: './hyp3-url.component.html',
  styleUrls: ['./hyp3-url.component.scss'],
  imports: [MatIcon],
})
export class Hyp3UrlComponent {
  public hyp3 = inject(services.Hyp3ApiService);

  public hyp3BaseUrl = this.hyp3.baseUrl;
  public hyp3BackendUrl: string;
}
