import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-checkbox-option',
  templateUrl: './checkbox-option.component.html',
  styleUrls: ['./checkbox-option.component.scss'],
  imports: [MatCheckbox, FormsModule, MatTooltip],
})
export class CheckboxOptionComponent {
  @Input() value: boolean;
  @Input() optionName: string;
  @Input() optionInfo: string;

  @Output() valueChange = new EventEmitter<boolean>();

  public onValueChange(toggleValue: boolean): void {
    this.value = toggleValue;
    this.valueChange.emit(this.value);
  }
}
