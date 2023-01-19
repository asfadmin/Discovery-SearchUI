import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown-option',
  templateUrl: './dropdown-option.component.html',
  styleUrls: ['./dropdown-option.component.scss']
})
export class DropdownOptionComponent implements OnInit {
  @Input() value: string;
  @Input() optionName: string;
  @Input() optionInfo: string;
  @Input() options: { apiValue: string | number; name: string; }[];

  @Output() valueChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  public onValueChange(toggleValue: string): void {
    this.value = toggleValue;
    this.valueChange.emit(this.value);
  }
}
