import { NgPlural, NgPluralCase, UpperCasePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() value: string;
  @Input() optionName: string;
  @Input() optionInfo: string;
  @Input() options: { apiValue: string | number; name: string }[];

  @Input() costsTable: any = null;

  @Output() valueChange = new EventEmitter<string>();

  public onValueChange(toggleValue: string): void {
    this.value = toggleValue;
    this.valueChange.emit(this.value);
  }
}
