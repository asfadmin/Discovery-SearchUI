import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-help-new-stuff',
  templateUrl: './help-new-stuff.component.html',
  styleUrls: ['./help-new-stuff.component.scss']
})
export class HelpNewStuffComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

}
