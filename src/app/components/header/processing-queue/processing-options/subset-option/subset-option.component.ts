import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-subset-option',
  templateUrl: './subset-option.component.html',
  styleUrls: ['./subset-option.component.scss'],
  standalone: false,
})
export class SubsetOptionComponent {
  @Input() optionName: string;
  @Input() optionInfo: string;

  @Output() setSubset = new EventEmitter<void>();

  public onSubsetChange(): void {
    this.setSubset.emit();
  }
}
