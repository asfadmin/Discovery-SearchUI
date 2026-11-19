import { LowerCasePipe } from '@angular/common';
import { Component, OnInit, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatFormField,
  MatLabel,
  MatInput,
  MatError,
} from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';

import { Range } from '@models';

@Component({
  selector: 'app-range-option',
  templateUrl: './range-option.component.html',
  styleUrls: ['./range-option.component.scss'],
  imports: [
    MatFormField,
    MatTooltip,
    MatLabel,
    MatInput,
    FormsModule,

    MatError,
    LowerCasePipe,
  ],
})
export class RangeOptionComponent implements OnInit {
  value = model<number>();
  readonly optionName = input<string>();
  readonly optionInfo = input<string>();
  range = model<Range<number>>();
  readonly default = input<number>();

  readonly valueChange = output<number>();

  ngOnInit(): void {
    this.value.set(this.default());
  }

  public onValueChange(): void {
    if (this.value() < this.range().start) {
      this.value.set(Math.max(this.range().start, this.value()));
    }
    if (this.value() > this.range().end) {
      this.value.set(Math.min(this.range().end, this.value()));
    }
    if (this.value() === 0.0) {
      this.value.set(0.0);
    }
    if (this.value() === null) {
      this.value.set(this.default());
    }

    this.valueChange.emit(this.value());
  }
}
