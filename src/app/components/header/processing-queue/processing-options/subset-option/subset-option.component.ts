import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-subset-option',
  templateUrl: './subset-option.component.html',
  styleUrls: ['./subset-option.component.scss']
})
export class SubsetOptionComponent implements OnInit {
  @Input() optionName: string;
  @Input() optionInfo: string;

  @Output() setSubset = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  public onSubsetChange(): void {
    this.setSubset.emit();
  }

}
