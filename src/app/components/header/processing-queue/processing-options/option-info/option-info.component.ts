import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-option-info',
  templateUrl: './option-info.component.html',
  styleUrls: ['./option-info.component.scss']
})
export class OptionInfoComponent implements OnInit {
  @Input() infoText: string;

  public showOptionInfo = false;

  constructor() { }

  ngOnInit(): void {
  }

  public toggleOptionInfo(): void {
    this.showOptionInfo = !this.showOptionInfo;
  }
}
