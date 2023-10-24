import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Range } from '@models';

@Component({
  selector: 'app-range-option',
  templateUrl: './range-option.component.html',
  styleUrls: ['./range-option.component.scss']
})
export class RangeOptionComponent  implements OnInit{
  @Input() value: number;
  @Input() optionName: string;
  @Input() optionInfo: string;
  @Input() range: Range<number>;
  @Input() default: number;

  @Output() valueChange = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {
    this.value = this.default;
  }

  public onValueChange(): void {
    if(this.value < this.range.start || this.value > this.range.end) {
      this.value = Math.min((Math.max(this.range.start, this.value), this.range.end))
    }

    this.valueChange.emit(this.value);
  }
}
