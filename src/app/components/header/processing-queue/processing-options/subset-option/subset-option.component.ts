import { Component, Output, EventEmitter, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-subset-option',
  templateUrl: './subset-option.component.html',
  styleUrls: ['./subset-option.component.scss'],
  imports: [MatButton, MatTooltip],
})
export class SubsetOptionComponent {
  readonly optionName = input<string>(undefined);
  readonly optionInfo = input<string>(undefined);

  @Output() setSubset = new EventEmitter<void>();

  public onSubsetChange(): void {
    this.setSubset.emit();
  }
}
