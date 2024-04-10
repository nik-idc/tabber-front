import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';
import { Signin } from 'src/app/_models/login';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { AuthService } from 'src/app/_services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SignInComponent implements OnInit {
  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signinData = new Signin();
  }

  public signinData: Signin;

  signInForm = this.formBuilder.group({
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
  });

  ngOnInit(): void {}

  onSignInClick() {
    this.authService.signin(this.signinData).then(
      (user: User) => {
        this.router.navigateByUrl(`user/${user.id}`);
      },
      (error: HttpErrorResponse) => {
        this.snackBar.open(`Error signing in: ${error.message}`, 'OK');
      }
    );
  }

  onSignUpClick() {
    this.router.navigateByUrl('signup');
  }
}
