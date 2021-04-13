import { Component } from '@angular/core';
import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';
@Component({
  // tslint:disable-next-line: component-selector
  selector: '[app-toastr-message]',
  templateUrl: './toastr-message.component.html',
  styleUrls: ['./toastr-message.component.scss'],
  preserveWhitespaces: false,
})
export class ToastrMessageComponent extends Toast {

  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
  ) {
    super(toastrService, toastPackage);
   }

}
