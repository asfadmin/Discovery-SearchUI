import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AsfApiService {
    public apiUrl = 'https://api.daac.asf.alaska.edu/services/search/param';

    constructor(private http: HttpClient) {
    }

    public getGranules(): Observable<any[]> {
        // This is just dummy data to fill out the toilet paper ui
        return this.http.get<any[]>('/assets/search.json');
    }

    public query(params): Observable<any[]> {
        const queryUrl = `${this.apiUrl}?maxResults=10&output=json&${params}`;

        console.log(queryUrl);
        return this.http.get<any[]>(queryUrl);
    }

}
