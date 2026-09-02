import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import {
  MatFormField,
  MatLabel,
  MatInput,
  MatError,
} from '@angular/material/input';
import {
  MatList,
  MatListItem,
  MatListItemTitle,
  MatListItemLine,
} from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationError } from 'xml2js';

import { EarthdataUserInfo, Hyp3User, ApplicationStatus } from '@models';
import {
  AsfLanguageService,
  Hyp3ApiService,
  NotificationService,
  UserDataService,
} from '@services';
import * as hyp3Store from '@store/hyp3';
import * as userStore from '@store/user';

@Component({
  selector: 'app-processing-signup',
  templateUrl: './processing-signup.component.html',
  styleUrl: './processing-signup.component.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCheckbox,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatList,
    MatListItem,
    MatListItemTitle,
    MatListItemLine,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatTooltip,
    MatButton,
    TranslateModule,
  ],
})
export class ProcessingSignupComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserDataService);
  private hyp3Service = inject(Hyp3ApiService);
  private notificationService = inject(NotificationService);
  private store$ = inject(Store);
  private language = inject(AsfLanguageService);

  public signupForm = this.formBuilder.group({
    infoConfirmation: [false, Validators.requiredTrue],
    useCase: ['', Validators.required],
    accessCode: [''],
  });

  public userInfo: EarthdataUserInfo = {
    first_name: '',
    last_name: '',
    email_address: '',
    country: '',
    uid: '',
    organization: '',
  };
  public hyp3User: Hyp3User;
  public submitButtonText;

  public submitButtonTooltip = '';
  public accessCodeErrorMessage = '';

  ngOnInit(): void {
    this.submitButtonTooltip = this.language.translate.instant(
      'MUST_CONFIRM_INFO_AND_USE_CASE',
    );
    this.store$.select(userStore.getUserAuth).subscribe((userAuth) => {
      this.userService
        .getUserInfo$(userAuth)
        .subscribe((data: EarthdataUserInfo) => {
          if (data) {
            this.userInfo = data;
          }
        });
    });
    this.store$.select(hyp3Store.getHyp3User).subscribe((user) => {
      this.hyp3User = user;
      if (this.hyp3User.application_status === ApplicationStatus.PENDING) {
        this.signupForm.controls.useCase.setValue(user.use_case);
        this.signupForm.controls.infoConfirmation.setValue(true);
        this.submitButtonTooltip = '';
        this.submitButtonText = this.language.translate.instant('RESUBMIT');
      } else {
        this.submitButtonText = this.language.translate.instant('REGISTER');
      }
    });
    this.signupForm.statusChanges.subscribe((_formValidity) => {
      if (
        !this.signupForm.controls.infoConfirmation.valid &&
        !this.signupForm.controls.useCase.valid
      ) {
        this.submitButtonTooltip = this.language.translate.instant(
          'MUST_CONFIRM_INFO_AND_USE_CASE',
        );
      } else if (!this.signupForm.controls.infoConfirmation.valid) {
        this.submitButtonTooltip = this.language.translate.instant(
          'MUST_CONFIRM_USER_INFO',
        );
      } else if (!this.signupForm.controls.useCase.valid) {
        this.submitButtonTooltip = this.language.translate.instant(
          'MUST_WRITE_USE_CASE',
        );
      } else {
        this.submitButtonTooltip = '';
      }
    });
  }

  public onRegisterPressed() {
    this.hyp3Service.submitSignupForm$(this.signupForm.value).subscribe(
      (_response) => {
        this.notificationService.info(
          this.language.translate.instant('SUBMITTED_FORM'),
        );
        this.store$.dispatch(new hyp3Store.LoadUser());
      },
      (error) => {
        if (error.error.detail.toLowerCase().includes('access code')) {
          this.signupForm.controls.accessCode.setErrors(
            new ValidationError(error.error.detail),
          );
          this.accessCodeErrorMessage = error.error.detail;
        } else {
          this.notificationService.error(
            error.error.detail,
            this.language.translate.instant('ON_DEMAND_SIGNUP_ERROR'),
          );
        }
      },
    );
  }
}
