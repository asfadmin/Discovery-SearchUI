import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-welcome-envelope-demo',
  standalone: true,
  templateUrl: './welcome-envelope-demo.component.html',
  styleUrls: ['./welcome-envelope-demo.component.scss'],
})
export class WelcomeEnvelopeDemoComponent {
  @Output() closed = new EventEmitter<void>();

  public close(): void {
    this.closed.emit();
  }
}
