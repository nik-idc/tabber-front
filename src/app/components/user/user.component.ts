import { Component, Input, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Tab } from 'src/app/_models/tab/tab';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { ConfirmDeleteDialogComponent } from '../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TabService } from 'src/app/_services/tab.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public selectedTab: Tab | undefined;

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService,
    private tabService: TabService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  onNameChanged(): void {}

  onDeleteTabClick(selectedTab: Tab, selectedTabIndex: number): void {
    // Ask user to confirm
    let dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { tabName: selectedTab.name },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this.userService
        .deleteTab(selectedTabIndex)
        .then(() => {
          // Manage selected index
          if (this.userService.user && this.userService.user.tabs) {
            if (this.userService.user.tabs.length > 0) {
              const selectedIndex: number =
                selectedTabIndex == this.userService.user.tabs.length
                  ? selectedTabIndex - 1
                  : selectedTabIndex;
              this.selectedTab = this.userService.user.tabs[selectedIndex];
            } else {
              this.selectedTab = undefined;
            }
          }
        })
        .catch((error: HttpErrorResponse) => {
          this.snackBar.open(`Error deleting tab: ${error.message}`, 'OK');
        });
    });
  }

  onOpenTabClick(selectedTab: Tab): void {
    this.selectedTab = selectedTab;

    if (this.selectedTab.id) {
      this.tabService.loadTab(this.selectedTab.id);
    } else {
      this.tabService.tab = this.selectedTab;
    }
  }

  onAddTabClick(): void {
    if (this.userService.user && this.userService.user.tabs) {
      this.userService.user.tabs.push(new Tab());
    }
  }

  get user(): User | undefined {
    return this.userService.user;
  }

  get currentUser(): User | undefined {
    return this.authService.currentUser;
  }
}
