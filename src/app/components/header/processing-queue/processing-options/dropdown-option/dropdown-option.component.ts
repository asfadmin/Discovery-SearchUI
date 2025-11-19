import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSelect, MatOption } from '@angular/material/select';
import {
  NgFor,
  NgIf,
  NgPlural,
  NgPluralCase,
  UpperCasePipe,
} from '@angular/common';
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
    NgFor,
    MatOption,
    NgIf,
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
