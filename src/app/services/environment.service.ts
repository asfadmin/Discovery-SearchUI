import { Injectable } from '@angular/core';

export interface Environment {
    api: {
      prod: string;
      test: string;
    };
    auth: {
      api: string;
      urs: string;
    };
    banner: {
      prod: string;
      test: string;
    };
    user_data: {
      prod: string;
      test: string;
    };
    devMode: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  get value(): Environment {
    if (window['_env'].devMode) {
      return this.loadWithCustom();
    } else {
      return this.loadFromEnvFile();
    }
  }

  private loadWithCustom(): Environment {
    try {
      const customEnvJson = localStorage.getItem('customEnv');
      const customEnv = JSON.parse(customEnvJson);
      if (!customEnv) {
        return <Environment>window['_env'];
      }

      return <Environment>customEnv;
    } catch {
      return <Environment>window['_env'];
    }
  }

  private loadFromEnvFile() {
    return <Environment>window['_env'];
  }
}
