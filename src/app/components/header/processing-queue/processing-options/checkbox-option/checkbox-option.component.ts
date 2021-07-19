import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox-option',
  templateUrl: './checkbox-option.component.html',
  styleUrls: ['./checkbox-option.component.scss']
})
export class CheckboxOptionComponent implements OnInit {
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
