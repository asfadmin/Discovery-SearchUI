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
    return <Environment>window['_env'];
  }
}
