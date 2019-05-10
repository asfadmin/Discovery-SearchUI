import { Component, OnInit, Input } from '@angular/core';

import { LonLat } from '@models';

@Component({
  selector: 'app-attributions',
  templateUrl: './attributions.component.html',
  styleUrls: ['./attributions.component.css'],
})
export class AttributionsComponent implements OnInit {
  @Input() mousePos: LonLat;

  constructor() { }

  ngOnInit() {
  }
}
