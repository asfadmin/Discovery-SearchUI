import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AsfApiService {
    public readonly apiUrl = 'https://api.daac.asf.alaska.edu/services/search/param';

    constructor(private http: HttpClient) {}

    public query(params): Observable<any[]> {
        const queryUrl = `${this.apiUrl}?${params}`;

        console.log(queryUrl);
        return this.http.get<any[]>(queryUrl);
    }

}
