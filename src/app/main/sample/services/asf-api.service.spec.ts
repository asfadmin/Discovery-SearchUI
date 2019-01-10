import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AsfApiService } from './asf-api.service';

describe('AsfApiService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [ HttpClientTestingModule ]
    }));

    it('should be created', () => {
        const service: AsfApiService = TestBed.get(AsfApiService);
        expect(service).toBeTruthy();
    });
});
