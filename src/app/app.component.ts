import { Component } from '@angular/core';
import { UserService } from './_services/user.service';
import { Router } from '@angular/router';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'tabber';

  constructor(private authService: AuthService, private router: Router) {}

  get loggedIn(): boolean {
    return this.authService.loggedIn;
  }

  onSignOutClick(): void {
    this.authService.signout();
    this.router.navigateByUrl('signin');
  }
}
