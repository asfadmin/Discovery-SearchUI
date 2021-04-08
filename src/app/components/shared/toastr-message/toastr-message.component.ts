import { Component, OnInit } from '@angular/core';
import { Input } from 'hammerjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toastr-message',
  templateUrl: './toastr-message.component.html',
  styleUrls: ['./toastr-message.component.scss']
})
export class ToastrMessageComponent implements OnInit {
  @Input headerText: string;
  @Input infoText: string;

  constructor(
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  public submitMessage(e: Event) {
    this.toastr.info();

    e.stopPropagation();
  }

}
