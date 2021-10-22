import { Component, Input, OnInit } from '@angular/core';
import * as models from '@models';

@Component({
  selector: 'app-event-metadata',
  templateUrl: './event-metadata.component.html',
  styleUrls: ['./event-metadata.component.scss']
})
export class EventMetadataComponent implements OnInit {
  @Input() event: models.SarviewsEvent;
  @Input() eventType: models.SarviewsEventType;
  public eventTypes = models.SarviewsEventType;
  constructor() { }

  ngOnInit(): void {
  }

}
