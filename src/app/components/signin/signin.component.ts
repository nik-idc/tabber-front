import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Route, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Login } from 'src/app/models/login';


@Component({
  selector: 'app-sign-in',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit {
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService) {
    this.loginData = new Login();
  }

  public loginData: Login;

  signInForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,30}')]],
  })

  ngOnInit(): void {

  }

  onSignInClick() {
    this.userService.signIn(this.loginData).then(
      (user: User) => {
        this.router.navigateByUrl(`user`);
      },
      (error: any) => {
        // Angular material dialog box signin error

        // Navigate to signin url
        this.router.navigateByUrl('signin');
      }
    );
  }

  onSignUpClick() {
    // Redirect to the sign up page
    this.router.navigateByUrl('signup');
  }
}
