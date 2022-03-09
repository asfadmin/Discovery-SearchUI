import { Component, OnInit } from '@angular/core';

import { AnalyticsEvent, derivedDatasets } from '@models';

@Component({
  selector: 'app-derived-datasets',
  templateUrl: './derived-datasets.component.html',
  styleUrls: ['./derived-datasets.component.scss']
})
export class DerivedDatasetsComponent implements OnInit {
  public asfWebsiteUrl = 'https://www.asf.alaska.edu';
  public datasets = derivedDatasets;

  constructor() { }

  ngOnInit(): void {
  }

  public onOpenDerivedDataset(dataset_url: string, dataset_name: string): void {
    const analyticsEvent = {
      name: 'open-derived-dataset',
      value: dataset_name
    };

    this.openNewWindow(dataset_url, analyticsEvent);
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
