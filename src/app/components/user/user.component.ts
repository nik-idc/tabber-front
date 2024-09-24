import { Component, Input, OnInit, ViewChild, Inject } from '@angular/core';
import { Tab } from '@atikincode/tabui/dist/index';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { ConfirmDeleteDialogComponent } from '../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TabService } from 'src/app/_services/tab.service';
import { CurrentUserService } from 'src/app/_services/current-user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public selectedTab: Tab | undefined;
  private _canEdit: boolean = false;

  constructor(
    private snackBar: MatSnackBar,
    private currentUserService: CurrentUserService,
    private userService: UserService,
    private tabService: TabService,
    private dialog: MatDialog
  ) {
    this._canEdit =
      this.userService.user?.email ===
      this.currentUserService.currentUser?.email;
  }

  ngOnInit(): void {}

  onNameChanged(): void {}



  get user(): User | undefined {
    return this._canEdit
      ? this.currentUserService.currentUser
      : this.userService.user;
  }

  get canEdit(): boolean {
    return this._canEdit;
  }
}
