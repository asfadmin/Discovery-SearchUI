import { Injectable } from '@angular/core';
import { env } from './env';

export interface Environments {
  prod: Environment;
  test: Environment;
  defaultEnv: string;
}

export interface Environment {
  api: string;
  auth: string;
  urs: string;
  api_maturity?: string;
  urs_client_id: string;
  unzip: string;
  datapool: string;
  banner: string;
  user_data: string;
}


@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private maturityKey = 'search-api-maturity';

  public envs: Environments;
  public maturity: string;
  public isProd: boolean;

  constructor() {
    this.isProd = env.defaultEnv === 'prod';
    this.envs = this.loadEnvs();

    if (!this.isProd) {
      const localMaturity = localStorage.getItem(this.maturityKey);

      this.maturity = !(localMaturity === 'test' || localMaturity === 'prod') ?
        this.envs.defaultEnv :
        localMaturity;
    } else {
      this.maturity = this.envs.defaultEnv;
    }
  }

  private loadEnvs(): Environments {
    if (!this.isProd) {
      return this.loadWithCustom();
    } else {
      return this.loadFromEnvFile();
    }
  }

  get currentEnv(): Environment {
    return this.envs[this.maturity];
  }

  public setMaturity(maturity: string): void {
    this.maturity = maturity;
    localStorage.setItem(this.maturityKey, this.maturity);
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
    return <Environments>env;
  }
}
