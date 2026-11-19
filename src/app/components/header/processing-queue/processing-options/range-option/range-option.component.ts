import { LowerCasePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  input,
} from '@angular/core';
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
  @Input() value: number;
  readonly optionName = input<string>(undefined);
  readonly optionInfo = input<string>(undefined);
  @Input() range: Range<number>;
  readonly default = input<number>(undefined);

  @Output() valueChange = new EventEmitter<number>();

  ngOnInit(): void {
    this.value = this.default();
  }

  public onValueChange(): void {
    if (this.value < this.range.start) {
      this.value = Math.max(this.range.start, this.value);
    }
    if (this.value > this.range.end) {
      this.value = Math.min(this.range.end, this.value);
    }
    if (this.value === 0.0) {
      this.value = 0.0;
    }
    if (this.value === null) {
      this.value = this.default();
    }

    this.valueChange.emit(this.value);
  }
}
