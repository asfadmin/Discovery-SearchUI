import { Component, OnInit } from '@angular/core';

import { EnvironmentService, NotificationService } from '@services';

@Component({
  selector: 'app-customize-env',
  templateUrl: './customize-env.component.html',
  styleUrls: ['./customize-env.component.scss', '../preferences/preferences.component.scss']
})
export class CustomizeEnvComponent implements OnInit {
  public envStr: string;

  constructor(
    private env: EnvironmentService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.envStr = JSON.stringify(this.env.envs, null, 2);
  }

  setCustomEnv(): void {
    try {
      const customEnv = JSON.parse(this.envStr);

      if (customEnv.defaultEnv !== 'test') {
        this.notificationService.error(`defaultEnv must be set to 'test'`, 'Error', {
          timeOut: 5000
        });
        return;
      }

      localStorage.setItem('customEnv-1', this.envStr);
      this.env.setEnvs(customEnv);
    } catch {
      this.notificationService.error(`JSON parse error while setting env`, 'Error', {
        timeOut: 5000
      });
      return;
    }
  }

  resetToDefaultEnv(): void {
    localStorage.removeItem('customEnv-1');
    this.env.resetToDefault();
    this.envStr = JSON.stringify(this.env.envs, null, 2);
  }
}
