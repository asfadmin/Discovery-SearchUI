import { Injectable } from '@angular/core';

export interface Environments {
  prod: Environment;
  test: Environment;
  defaultEnv: string;
}

export interface Environment {
  api: string;
  auth: string;
  urs: string;
  banner: string;
  user_data: string;
}


@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  get value(): Environments {
    if (window['_env'].defaultEnv === 'test') {
      return this.loadWithCustom();
    } else {
      return this.loadFromEnvFile();
    }
  }

  private loadWithCustom(): Environments {
    try {
      const customEnvJson = localStorage.getItem('customEnv');
      const customEnv = JSON.parse(customEnvJson);
      if (!customEnv) {
        return this.loadFromEnvFile();
      }

      return <Environments>customEnv;
    } catch {
      return this.loadFromEnvFile();
    }
  }

  private loadFromEnvFile(): Environments {
    return <Environments>window['_env'];
  }
}
