import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AsfApiService {
    constructor(private http: HttpClient) {
    }

    public getGranules(): Observable<any[]> {
        // This is just dummy data to fill out the toilet paper ui
        return this.http.get<any[]>(
            'http://localhost:4200/assets/search.json'
        );
    }

}
