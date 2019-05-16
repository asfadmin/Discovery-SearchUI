import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-dataset-search',
  templateUrl: './dataset-search.component.html',
  styleUrls: ['./dataset-search.component.scss']
})
export class DatasetSearchComponent {
  public screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = event.target.innerWidth;
  }
}
