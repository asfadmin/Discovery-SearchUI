import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Hyp3Service, NotificationService, UserDataService } from '@services';
import { EarthdataUserInfo, Hyp3User, ApplicationStatus } from '@models';

import * as userStore from '@store/user';
import * as hyp3Store from '@store/hyp3';
import { ValidationError } from 'xml2js';

@Component({
  selector: 'app-processing-signup',
  templateUrl: './processing-signup.component.html',
  styleUrl: './processing-signup.component.scss'
})
export class ProcessingSignupComponent implements OnInit {
  public signupForm = this.formBuilder.group({
    infoConfirmation: [false, Validators.requiredTrue],
    useCase: ['', Validators.required],
    accessCode: ['']
  })


  public userInfo: EarthdataUserInfo = {
    'first_name': '',
    'last_name': '',
    'email_address': '',
    'country': '',
    'uid': '',
    'organization': ''
  }
  public hyp3User: Hyp3User;
  public submitButtonText;

  public submitButtonTooltip = 'Must confirm user information as well as write use case.';
  public accessCodeErrorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserDataService,
    private hyp3Service: Hyp3Service,
    private notificationService: NotificationService,
    private store$: Store,
  ) { }

  ngOnInit(): void {
    this.store$.select(userStore.getUserAuth).subscribe(userAuth => {
      this.userService.getUserInfo$(userAuth).subscribe((data: EarthdataUserInfo) => {
        if (data) {
          this.userInfo = data;
        }
      })
    })
    this.store$.select(hyp3Store.getHyp3User).subscribe(user => {
      this.hyp3User = user;
      if (this.hyp3User.application_status === ApplicationStatus.PENDING) {
        this.signupForm.controls.useCase.setValue(user.use_case);
        this.signupForm.controls.infoConfirmation.setValue(true);
        this.submitButtonTooltip = '';
        this.submitButtonText = 'Resubmit';
      } else {
        this.submitButtonText = 'Register';
      }
    }
    )
    this.signupForm.statusChanges.subscribe(_formValidity => {
      if (!this.signupForm.controls.infoConfirmation.valid && !this.signupForm.controls.useCase.valid) {
        this.submitButtonTooltip = 'Must confirm user information as well as write use case.';
      } else if (!this.signupForm.controls.infoConfirmation.valid) {
        this.submitButtonTooltip = 'Must confirm user information.';
      } else if (!this.signupForm.controls.useCase.valid) {
        this.submitButtonTooltip = 'Must write use case.';
      } else {
        this.submitButtonTooltip = '';
      }
    })
  }

  public onRegisterPressed() {
    this.hyp3Service.submitSignupForm$(this.signupForm.value).subscribe((_response) => {
      this.notificationService.info('Submitted Form');
      this.store$.dispatch(new hyp3Store.LoadUser());
    }, (error) => {
      if(error.error.detail.toLowerCase().includes('access code')) {
        this.signupForm.controls.accessCode.setErrors(new ValidationError(error.error.detail))
        this.accessCodeErrorMessage = error.error.detail;
      } else {
        this.notificationService.error(error.error.detail, 'On Demand Signup Error');
      }
    });
  }

}
