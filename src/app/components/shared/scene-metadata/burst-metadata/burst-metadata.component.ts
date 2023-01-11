import { Component, Input, OnInit } from '@angular/core';
import * as models from '@models';

@Component({
  selector: 'app-burst-metadata',
  templateUrl: './burst-metadata.component.html',
  styleUrls: ['./burst-metadata.component.scss']
})
export class BurstMetadataComponent implements OnInit {

  @Input() burst: models.SLCBurstMetadata;
  @Input() sceneName: string

  constructor() { }

  ngOnInit(): void {
  }
}
