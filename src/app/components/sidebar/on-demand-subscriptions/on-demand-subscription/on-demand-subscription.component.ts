import { Component, OnInit, Input } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-on-demand-subscription',
  templateUrl: './on-demand-subscription.component.html',
  styleUrls: ['./on-demand-subscription.component.scss']
})
export class OnDemandSubscriptionComponent implements OnInit {
  @Input() subscription: models.OnDemandSubscription;

  constructor() { }

  ngOnInit(): void {
  }

}
