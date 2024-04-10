import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from 'src/app/_shared/validators/password.validator';
import { Signup } from 'src/app/_models/signup';
import { User } from 'src/app/_models/user';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignUpComponent implements OnInit {
  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupData = new Signup();
  }

  signUpForm = this.formBuilder.group(
    {
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,30}'
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validator: PasswordValidator }
  );

  public confirmPassword: string = '';
  public signupData: Signup;

  ngOnInit(): void {}

  onSignUpClick() {
    this.authService.signup(this.signupData).then(
      (user: User) => {
        this.router.navigateByUrl(`user/${user.id}`);
      },
      (error: HttpErrorResponse) => {
        this.snackBar.open(`Error signing up: ${error.message}`, 'OK');
      }
    );
  }

  onCancelClick() {
    this.router.navigateByUrl('signin');
  }
}
