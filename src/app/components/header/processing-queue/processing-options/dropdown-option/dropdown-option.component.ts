import { NgPlural, NgPluralCase, UpperCasePipe } from '@angular/common';
import { Component, input, model, output } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dropdown-option',
  templateUrl: './dropdown-option.component.html',
  styleUrls: ['./dropdown-option.component.scss'],
  imports: [
    MatFormField,
    MatTooltip,
    MatLabel,
    MatSelect,

    MatOption,

    NgPlural,
    NgPluralCase,
    UpperCasePipe,
    TranslateModule,
  ],
})
export class DropdownOptionComponent {
  value = model<string>();
  readonly optionName = input<string>(undefined);
  readonly optionInfo = input<string>(undefined);
  readonly options = input<
    {
      apiValue: string | number;
      name: string;
    }[]
  >(undefined);

  costsTable = input(null);

  readonly valueChange = output<string>();

  public onValueChange(toggleValue: string): void {
    this.value.set(toggleValue);
    this.valueChange.emit(this.value());
  }
}
