import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-selector',
  templateUrl: './filter-selector.component.html',
  styleUrls: ['./filter-selector.component.css']
})
export class FilterSelectorComponent implements OnInit {

  constructor() { }

  public ngOnInit(): void {
  }

  public btnClasses(): string {
    return `
      filter-selector__btn
      btn btn-outline-light
      p-2
    `;
  }

  public iconPath(name: string): string {
    return `assets/icons/${name}.png`;
  }
}
