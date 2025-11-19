import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Range } from '@models';
import {
  MatFormField,
  MatLabel,
  MatInput,
  MatError,
} from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { NgIf, LowerCasePipe } from '@angular/common';

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
    NgIf,
    MatError,
    LowerCasePipe,
  ],
})
export class RangeOptionComponent implements OnInit {
  @Input() value: number;
  @Input() optionName: string;
  @Input() optionInfo: string;
  @Input() range: Range<number>;
  @Input() default: number;

  @Output() valueChange = new EventEmitter<number>();

  ngOnInit(): void {
    this.value = this.default;
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
      this.value = this.default;
    }

    this.valueChange.emit(this.value);
  }
}
