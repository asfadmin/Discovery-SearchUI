import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-option',
  templateUrl: './toggle-option.component.html',
  styleUrls: ['./toggle-option.component.scss']
})
export class ToggleOptionComponent implements OnInit {
  @Input() value: boolean;
  @Input() optionName: string;
  @Input() optionInfo: string;

  @Output() valueChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  public onValueChange(toggleValue: boolean): void {
    this.value = toggleValue;
    this.valueChange.emit(this.value);
  }
}
