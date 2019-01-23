import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AsfApiService {
    public readonly apiUrl = 'https://api.daac.asf.alaska.edu/services/search/param';

    constructor(private http: HttpClient) {}

    public query(params: string): Observable<any[]> {
        const queryUrl = `${this.apiUrl}?${params}`;

        return this.http.get<any[]>('assets/sample-data/sentinel-1a.json');
    }

  private baseParams() {
    return {
      maxResults: 5,
      output: 'json'
    };
  }
}
