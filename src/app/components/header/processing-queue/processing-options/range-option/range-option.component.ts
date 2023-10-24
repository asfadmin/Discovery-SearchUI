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

  @Output() valueChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  public onValueChange(rangeValue: Event): void {
    this.value = (rangeValue.target as HTMLInputElement).valueAsNumber;
    this.valueChange.emit(this.value);
  }
}
