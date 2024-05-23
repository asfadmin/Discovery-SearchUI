import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserDataService } from '@services';
import { EarthdataUserInfo } from '@models';

import * as userStore from '@store/user';

@Component({
  selector: 'app-processing-signup',
  templateUrl: './processing-signup.component.html',
  styleUrl: './processing-signup.component.scss'
})
export class ProcessingSignupComponent implements OnInit {
    public signupForm = this.formBuilder.group({
      infoConfirmation: [false, Validators.requiredTrue],
      useCase: ['', Validators.required]
    })


    public userInfo: EarthdataUserInfo = {
      'first_name': '',
      'last_name': '',
      'email_address': '',
      'country': '',
      'uid': '',
      'organization': ''
    }

    constructor(
      private formBuilder: FormBuilder,
      private userService: UserDataService,
      private store$: Store,
    ){}
    
    ngOnInit(): void {
      this.store$.select(userStore.getUserAuth).subscribe(userAuth => {
        this.userService.getUserInfo$(userAuth).subscribe((data: EarthdataUserInfo) => {
          this.userInfo = data;
        })
      })
    }

    public onRegisterPressed() {
      console.log(this.signupForm.value)
    }

}
