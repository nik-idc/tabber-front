import { Component, Input, OnInit, ViewChild, Inject } from '@angular/core';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Tab } from 'src/app/models/tab/tab';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDeleteDialogComponent } from '../dialogs/confirm-delete-dialog/confirm-delete-dialog.component'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public selectedTab: Tab | undefined;

  private editTimeoutId: NodeJS.Timeout | undefined;

  constructor(private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    
  }

  private autoUpdateUser(): void {
    // Cancel sending changes to the server
    clearTimeout(this.editTimeoutId);

    this.editTimeoutId = setTimeout(() => {
      // Update the user on the server
      this.userService.updateUser();

      // Inform about update

    }, 2500);
  }

  onNameChanged(): void {
    this.autoUpdateUser();
  }

  onDeleteTabClick(selectedTab: Tab): void {
    // Get index of the selected tab
    let selectedIndex = this.userService.user.tabs.indexOf(selectedTab);

    // Ask user to confirm
    let dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, { data: { tabName: selectedTab.name } });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this.userService.deleteTab(selectedTab).then(
        (res) => {
          // Manage selected index
          if (this.userService.user.tabs.length > 0) {
            selectedIndex = selectedIndex == this.userService.user.tabs.length ? selectedIndex - 1 : selectedIndex;
            this.selectedTab = this.userService.user.tabs[selectedIndex];
          } else {
            this.selectedTab = undefined;
          }
        },
        (err) => {

        }
      )
    });
  }

  onOpenTabClick(selectedTab: Tab): void {
    this.selectedTab = selectedTab;
  }

  onAddTabClick(): void {
    // Save new tab
    this.userService.createNewTab().then(
      (res) => {
        // Select tab to be displayed in the tab component
        this.selectedTab = this.userService.user.tabs[this.userService.user.tabs.length - 1];
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  get user(): User {
    return this.userService.user;
  }
}
