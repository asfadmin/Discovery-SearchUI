import { Component, input, Input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-toggle-option',
  templateUrl: './toggle-option.component.html',
  styleUrls: ['./toggle-option.component.scss'],
  imports: [MatSlideToggle, MatTooltip, FormsModule],
})
export class ToggleOptionComponent {
  value = model<boolean>();
  optionName = input<string>();
  optionInfo = input<string>();

  valueChange = output<boolean>();

  public onValueChange(toggleValue: boolean): void {
    this.value.set(toggleValue);
    this.valueChange.emit(this.value());
  }
}
