import { Component, OnInit, inject } from '@angular/core';

import { EnvironmentService, NotificationService } from '@services';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-customize-env',
  templateUrl: './customize-env.component.html',
  styleUrls: [
    './customize-env.component.scss',
    '../preferences/preferences.component.scss',
  ],
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    CdkTextareaAutosize,
    MatDialogActions,
    MatButton,
    TranslateModule,
  ],
})
export class CustomizeEnvComponent implements OnInit {
  private env = inject(EnvironmentService);
  private notificationService = inject(NotificationService);

  public envStr: string;

  ngOnInit() {
    this.envStr = JSON.stringify(this.env.envs, null, 2);
  }

  setCustomEnv(): void {
    try {
      const customEnv = JSON.parse(this.envStr);

      if (customEnv.defaultEnv !== 'test') {
        this.notificationService.error(
          `defaultEnv must be set to 'test'`,
          'Error',
          {
            timeOut: 5000,
          },
        );
        return;
      }

      localStorage.setItem('customEnv-1', this.envStr);
      this.env.setEnvs(customEnv);
    } catch {
      this.notificationService.error(
        `JSON parse error while setting env`,
        'Error',
        {
          timeOut: 5000,
        },
      );
      return;
    }
  }

  resetToDefaultEnv(): void {
    localStorage.removeItem('customEnv-1');
    this.env.resetToDefault();
    this.envStr = JSON.stringify(this.env.envs, null, 2);
  }
}
