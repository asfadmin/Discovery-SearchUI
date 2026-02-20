import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-subset-option',
  templateUrl: './subset-option.component.html',
  styleUrls: ['./subset-option.component.scss'],
  imports: [MatButton, MatTooltip],
})
export class SubsetOptionComponent {
  @Input() optionName: string;
  @Input() optionInfo: string;

  @Output() setSubset = new EventEmitter<void>();

  public onSubsetChange(): void {
    this.setSubset.emit();
  }
}
