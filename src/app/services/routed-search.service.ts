import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class RoutedSearchService {
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    public query(granuleName: string) {
        const baseParams = {
            maxResults: 5,
            output: 'json'
        };

        const queryParams = {
            ...baseParams,
            granule_list: granuleName
        };

        this.router.navigate(['.'], { queryParams });
    }

    public clear(): void {
        this.router.navigate(['.'], { queryParams: {} });
    }
}


function parseQueryStringToDictionary(queryString) {
    const dictionary = {};

    if (queryString === '') {
        return dictionary;
    }

    if (queryString.indexOf('?') === 0) {
        queryString = queryString.substr(1);
    }

    const parts = queryString.split('&');

    for (const p of parts) {
        const keyValuePair = p.split('=');

        const key = keyValuePair[0];
        let value = keyValuePair[1];

        value = decodeURIComponent(value);
        value = value.replace(/\+/g, ' ');

        dictionary[key] = value;
    }

    console.log(queryString, dictionary);
    return dictionary;
}

