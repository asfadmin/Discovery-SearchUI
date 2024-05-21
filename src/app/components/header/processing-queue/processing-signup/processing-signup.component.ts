import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-processing-signup',
  templateUrl: './processing-signup.component.html',
  styleUrl: './processing-signup.component.scss'
})
export class ProcessingSignupComponent {
    public signupForm = this.formBuilder.group({
      infoConfirmation: [false, Validators.requiredTrue],
      useCase: ['', Validators.required]
    })

    constructor(
      private formBuilder: FormBuilder
    ){}
    
    public onRegisterPressed() {
      console.log(this.signupForm.value)
    }

}
