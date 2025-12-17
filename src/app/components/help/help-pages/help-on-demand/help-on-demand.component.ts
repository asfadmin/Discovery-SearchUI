import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-on-demand',
  templateUrl: './help-on-demand.component.html',
  styleUrls: ['./help-on-demand.component.scss'],
  imports: [MatIcon, TranslateModule],
})
export class HelpOnDemandComponent {}
