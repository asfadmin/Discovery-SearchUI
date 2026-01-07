import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toggle-option',
  templateUrl: './toggle-option.component.html',
  styleUrls: ['./toggle-option.component.scss'],
  imports: [MatSlideToggle, MatTooltip, FormsModule],
})
export class ToggleOptionComponent {
  @Input() value: boolean;
  @Input() optionName: string;
  @Input() optionInfo: string;

  @Output() valueChange = new EventEmitter<boolean>();

  public onValueChange(toggleValue: boolean): void {
    this.value = toggleValue;
    this.valueChange.emit(this.value);
  }
}
