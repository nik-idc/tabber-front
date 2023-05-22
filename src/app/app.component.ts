import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tabber';
  
  constructor(private userService: UserService, private router: Router) { }

  get loggedIn(): boolean {
    return this.userService.loggedIn;
  }

  onSignOutClick(): void {
    this.userService.signOut();
    this.router.navigateByUrl('signin');
  }
}
