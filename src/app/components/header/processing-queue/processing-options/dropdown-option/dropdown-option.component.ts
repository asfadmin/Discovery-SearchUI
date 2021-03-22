import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown-option',
  templateUrl: './dropdown-option.component.html',
  styleUrls: ['./dropdown-option.component.scss']
})
export class DropdownOptionComponent implements OnInit {
  @Input() value: boolean;
  @Input() optionName: string;
  @Input() optionInfo: string;
  @Input() options: string[];

  @Output() valueChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  public onValueChange(toggleValue: boolean): void {
    this.value = toggleValue;
    this.valueChange.emit(this.value);
  }
}
