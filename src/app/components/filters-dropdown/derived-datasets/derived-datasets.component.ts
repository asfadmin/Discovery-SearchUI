import { Component, OnInit } from '@angular/core';

import { AnalyticsEvent } from '@models';

@Component({
  selector: 'app-derived-datasets',
  templateUrl: './derived-datasets.component.html',
  styleUrls: ['./derived-datasets.component.scss']
})
export class DerivedDatasetsComponent implements OnInit {
  public asfWebsiteUrl = 'https://www.asf.alaska.edu';

  public datasets = [{
      name: 'GISMO',
      url: '/sar-data-sets/global-ice-sheet-mapping-orbiter-gismo',
    }, {
      name: 'Glacier Speed',
      url: '/sar-data-sets/glacier-speed',
    }, {
      name: 'Polar Year',
      url: '/sar-data-sets/international-polar-year-2007-2008',
    }, {
      name: 'RAMP',
      url: '/sar-data-sets/radarsat-antarctic-mapping-project-ramp',
    }, {
      name: 'Sea Ice MEaSUREs',
      url: '/sar-data-sets/sea-ice-measures',
    }, {
      name: 'Wetlands MEaSUREs',
      url: '/sar-data-sets/wetlands-measures',
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  public onOpenDerivedDataset(dataset_path: string, dataset_name: string): void {
    const url = this.asfWebsiteUrl + dataset_path;
    const analyticsEvent = {
      name: 'open-derived-dataset',
      value: dataset_name
    };

    this.openNewWindow(url, analyticsEvent);
  }

  private openNewWindow(url, analyticsEvent: AnalyticsEvent): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': analyticsEvent.name,
      'open-derived-dataset': analyticsEvent.value
    });

    window.open(url, '_blank');
  }

}
