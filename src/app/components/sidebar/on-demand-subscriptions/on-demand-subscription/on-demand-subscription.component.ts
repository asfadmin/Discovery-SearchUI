import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-on-demand-subscription',
  templateUrl: './on-demand-subscription.component.html',
  styleUrls: ['./on-demand-subscription.component.scss']
})
export class OnDemandSubscriptionComponent implements OnInit {
  @Input() subscription: models.OnDemandSubscription;
  @Input() isExpanded: boolean;

  @Output() toggleExpand = new EventEmitter<string>();
  @Output() viewProducts = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  public onToggleExpand(): void {
    this.toggleExpand.emit(this.subscription.id);
  }

  public loadOnDemandSearch(): void {
    this.viewProducts.emit(this.subscription.name);
  }
}
