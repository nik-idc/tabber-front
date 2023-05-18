import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from 'src/app/shared/validators/password.validator';
import { UserService } from 'src/app/services/user.service';
import { Signup } from 'src/app/models/signup';

@Component({
  selector: 'app-sign-up',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router) {
    this.signupData = new Signup();
  }

  signUpForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,15}')]],
    confirmPassword: ['', [Validators.required]],
  }, {validator: PasswordValidator});

  confirmPassword!: string;
  public signupData: Signup;

  ngOnInit(): void {}

  onSignUpClick() {
    this.userService.signUp(this.signupData).then(
      () => {
        this.router.navigateByUrl('user');
      },
      (error: any) => {
        // Angular material dialog box signup error

        // Navigate to signin url
        this.router.navigateByUrl('signin');
      }
    );
  }

  onCancelClick() {
    this.router.navigateByUrl('signin');
  }
}