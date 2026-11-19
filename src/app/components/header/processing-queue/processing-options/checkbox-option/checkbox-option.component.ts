import { Component, input, model, output } from '@angular/core';
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
  value = model<boolean>();
  readonly optionName = input<string>();
  readonly optionInfo = input<string>();

  readonly valueChange = output<boolean>();

  public onValueChange(toggleValue: boolean): void {
    this.value.set(toggleValue);
    this.valueChange.emit(this.value());
  }
}
