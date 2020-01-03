import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    private snackBar: MatSnackBar,
    private env: EnvironmentService,
    private http: HttpClient,
  ) { }

  public getAttribute$<T>(userAuth: UserAuth, attribute: string): Observable<T> {
    const url =  this.makeEndpoint(this.baseUrl, userAuth.id, attribute);
    const headers = this.makeAuthHeader(userAuth.token);

    return this.http.get<T>(url, {
      headers
    }).pipe(
      catchError(err => {
        this.snackBar.open('Trouble loading profile information', 'ERROR', {
          duration: 5000
        });

        return of(null);
      })
    );
  }

  public setAttribute$<T>(userAuth: UserAuth, attribute: string, value: T): Observable<any> {
    const url =  this.makeEndpoint(this.baseUrl, userAuth.id, attribute);
    const headers = this.makeAuthHeader(userAuth.token);

    return this.http.post(url, value, {
      headers
    }).pipe(
      catchError(err => {
        this.snackBar.open('Trouble setting profile information', 'ERROR', {
          duration: 5000
        });

        return of(null);
      })
    );
  }

  private makeEndpoint(baseUrl: string, userId: string, attributeName: string): string {
    return `${baseUrl}/vertex/${userId}/${attributeName}`;
  }

  private makeAuthHeader(token: string): HttpHeaders {
    return new HttpHeaders().
      set('Authorization', `Bearer ${token}`);
  }
}
