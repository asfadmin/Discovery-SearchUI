import { Injectable, inject } from '@angular/core';
import { env } from './env';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SetSearchOutOfDate } from '@store/search';

export interface Environments {
  prod: Environment;
  test: Environment;
  [key: string]: Environment | string;
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
  bulk_download: string;
  cmr_token?: string;
  cmr_provider?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private $store = inject<Store<AppState>>(Store);

  private maturityKey = 'search-api-maturity';

  public envs: Environments;
  public maturity: string;
  public isProd: boolean;

  constructor() {
    this.isProd = env.defaultEnv === 'prod';
    this.envs = this.loadEnvs();

    if (!this.isProd) {
      const localMaturity = localStorage.getItem(this.maturityKey);

      this.maturity = !(localMaturity === 'test' || localMaturity === 'prod')
        ? this.envs.defaultEnv
        : localMaturity;
    } else {
      this.maturity = this.envs.defaultEnv;
    }
  }

  public loadEnvs(): Environments {
    if (!this.isProd) {
      return this.loadWithCustom();
    } else {
      return this.loadFromEnvFile();
    }
  }

  get currentEnv(): Environment {
    return this.envs[this.maturity] as Environment;
  }

  public setMaturity(maturity: string): void {
    this.maturity = maturity;
    localStorage.setItem(this.maturityKey, this.maturity);
    this.$store.dispatch(new SetSearchOutOfDate(true));
  }

  public setEnvs(envs: any): void {
    this.envs = envs as Environments;
    this.$store.dispatch(new SetSearchOutOfDate(true));
  }

  private loadWithCustom(): Environments {
    try {
      const customEnvJson = localStorage.getItem('customEnv-1');
      const customEnv = JSON.parse(customEnvJson);
      if (!customEnv) {
        return this.loadFromEnvFile();
      }

      return customEnv as Environments;
    } catch {
      return this.loadFromEnvFile();
    }
  }

  private loadFromEnvFile(): Environments {
    return env as Environments;
  }

  public resetToDefault(): void {
    this.envs = this.loadFromEnvFile();
    this.$store.dispatch(new SetSearchOutOfDate(true));
  }
}
