import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-login',
  templateUrl: './help-login.component.html',
  styleUrls: ['./help-login.component.scss'],
  imports: [MatIcon, TranslateModule],
})
export class HelpLoginComponent {}
