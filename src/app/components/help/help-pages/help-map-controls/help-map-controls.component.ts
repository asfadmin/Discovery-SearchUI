import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-map-controls',
  templateUrl: './help-map-controls.component.html',
  styleUrls: ['./help-map-controls.component.scss'],
  imports: [MatIcon, TranslateModule],
})
export class HelpMapControlsComponent {}
