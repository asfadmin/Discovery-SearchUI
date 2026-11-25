import { Component, effect, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-token-input',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Token</mat-label>
      <input
        matInput
        [ngModel]="value()"
        (ngModelChange)="value.set($event)"
        autocomplete="off"
        spellcheck="false"
      />
    </mat-form-field>
    <a href="https://urs.earthdata.nasa.gov/profile" target="_blank"
      >EDL Profile</a
    >
  `,
})
export class TokenInputComponent {
  private readonly key = 'token-input';
  readonly value = signal(this.load());
  readonly valueChange = output<string>();

  constructor() {
    effect(() => {
      const v = this.value();
      this.valueChange.emit(v);
      try {
        localStorage.setItem(this.key, v);
      } catch {
        /* storage unavailable or full */
      }
    });
  }

  private load(): string {
    try {
      return localStorage.getItem(this.key) ?? '';
    } catch {
      return '';
    }
  }
}
