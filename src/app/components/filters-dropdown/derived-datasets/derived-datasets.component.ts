import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { ScreenSizeService } from '@services';
import { AnalyticsEvent, derivedDatasets, Breakpoints } from '@models';


@Component({
  selector: 'app-derived-datasets',
  templateUrl: './derived-datasets.component.html',
  styleUrls: ['./derived-datasets.component.scss']
})
export class DerivedDatasetsComponent implements OnInit, OnDestroy {
  public datasets = derivedDatasets;

  public breakpoint: Breakpoints;
  public breakpoints = Breakpoints;
  public breakpoint$ = this.screenSize.breakpoint$;

  private subs = new SubSink();

  constructor(
    private screenSize: ScreenSizeService,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
