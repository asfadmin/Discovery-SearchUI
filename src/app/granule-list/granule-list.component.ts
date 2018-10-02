import { Component, Input } from '@angular/core';

import { SentinelGranule } from '../models/sentinel-granule.model';

@Component({
    selector: 'app-granule-list',
    templateUrl: './granule-list.component.html',
    styleUrls: ['./granule-list.component.css']
})
export class GranuleListComponent {
    @Input() granules: SentinelGranule[];
}
