import { Component } from '@angular/core';
import { UserService } from './_services/user.service';
import { Router } from '@angular/router';
import { CurrentUserService } from './_services/current-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tabber';

  constructor(
    private currentUserService: CurrentUserService,
    private router: Router
  ) {}

  get loggedIn(): boolean {
    return this.currentUserService.loggedIn;
  }

  onSignOutClick(): void {
    this.currentUserService.signout();
    this.router.navigateByUrl('signin');
  }

  onProfileClick(): void {
    this.router.navigateByUrl(
      `user/${this.currentUserService.currentUser!.id}`
    );
  }
}
