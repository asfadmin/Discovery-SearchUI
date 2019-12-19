import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EnvironmentService } from './environment.service';

import { UserAuth } from '@models';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private baseUrl = this.env.value.devMode ?
    `https://gg0fcoca5c.execute-api.us-east-1.amazonaws.com/test` :
    `https://appdata.asf.alaska.edu`;

  constructor(
    private env: EnvironmentService,
    private http: HttpClient
  ) { }

  public getAttribute$<T>(userAuth: UserAuth, attribute: string): Observable<T> {
    const url =  this.makeEndpoint(this.baseUrl, userAuth.id, attribute);
    const headers = this.makeAuthHeader(userAuth.token);

    return this.http.get<T>(url, {
      headers
    });
  }

  public setAttribute$<T>(userAuth: UserAuth, attribute: string, value: T): Observable<any> {
    const url =  this.makeEndpoint(this.baseUrl, userAuth.id, attribute);
    const headers = this.makeAuthHeader(userAuth.token);

    return this.http.post(url, value, {
      headers
    });
  }

  private makeEndpoint(baseUrl: string, userId: string, attributeName: string): string {
    return `${baseUrl}/vertex/${userId}/${attributeName}`;
  }

  private makeAuthHeader(token: string): HttpHeaders {
    return new HttpHeaders().
      set('Authorization', `Bearer ${token}`);
  }
}
