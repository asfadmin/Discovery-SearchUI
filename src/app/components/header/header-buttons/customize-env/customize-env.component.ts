import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EnvironmentService } from '@services';

@Component({
  selector: 'app-customize-env',
  templateUrl: './customize-env.component.html',
  styleUrls: ['./customize-env.component.scss', '../preferences/preferences.component.scss']
})
export class CustomizeEnvComponent implements OnInit {
  public envStr: string;

  constructor(
    private env: EnvironmentService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.envStr = JSON.stringify(this.env.envs, null, 2);
  }

  setCustomEnv(): void {
    try {
      const customEnv = JSON.parse(this.envStr);

      if (customEnv.defaultEnv !== 'test') {
        this.snackBar.open(`defaultEnv must be set to 'test'`, 'ERROR', {
          duration: 5000
        });
        return;
      }

      localStorage.setItem('customEnv', this.envStr);
      this.env.setEnvs(customEnv);
    } catch {
      this.snackBar.open(`JSON parse error while setting env`, 'ERROR', {
        duration: 5000
      });
      return;
    }
  }

  resetToDefaultEnv(): void {
    localStorage.removeItem('customEnv');
    this.env.resetToDefault();
    this.envStr = JSON.stringify(this.env.envs, null, 2);
  }
}
