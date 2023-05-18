import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Tab } from 'src/app/models/tab/tab';
import { User } from 'src/app/models/user';
import { TabStateService } from 'src/app/services/tab-state.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public user: User;
  public selectedTab: Tab = new Tab();

  constructor(private userService: UserService,) {
    this.user = new User();
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  onTabSelected(selectedTab: Tab): void {
    this.selectedTab = selectedTab;
  }
}
