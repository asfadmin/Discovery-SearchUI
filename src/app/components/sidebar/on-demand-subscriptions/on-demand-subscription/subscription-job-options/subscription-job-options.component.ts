import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-subscription-job-options',
  templateUrl: './subscription-job-options.component.html',
  styleUrls: ['./subscription-job-options.component.scss']
})
export class SubscriptionJobOptionsComponent implements OnInit {
  @Input() options = {};

  constructor() { }

  ngOnInit(): void {
  }

  public listFrom(options): any[] {
    return Object.entries(options).map(
      ([name, val]) => ({ name, val })
    ).filter(param => !!param.val);
  }
}
