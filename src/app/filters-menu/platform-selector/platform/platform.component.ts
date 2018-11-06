import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-platform',
  template: `
    <button
      (mouseover)="hoverStart()"
      (mouseleave)="hoverEnd()"
    type="button" class="btn btn-secondary">
      {{ isHovered ? dateRange : name }}
    </button>

  `,
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent {
  @Input() name: string;
  @Input() dateRange: string;

  public isHovered = false;

  public hoverStart(e) {
    this.isHovered = true;
  }

  public hoverEnd(e) {
    this.isHovered = false;
  }
}
