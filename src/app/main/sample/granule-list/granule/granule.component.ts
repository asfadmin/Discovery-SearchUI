import { Component, Input } from '@angular/core';

import { SentinelGranule } from '../../models';

@Component({
    selector: 'app-granule',
    templateUrl: './granule.component.html',
    styleUrls: ['./granule.component.css']
})
export class GranuleComponent {
    @Input() granule: SentinelGranule;
}
