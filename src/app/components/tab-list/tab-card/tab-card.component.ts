import { Dialog } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tab } from '@atikincode/tabui/dist/index';
import { CurrentUserService } from 'src/app/_services/current-user.service';
import { ConfirmDeleteDialogComponent } from '../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tab-card',
  templateUrl: './tab-card.component.html',
  styleUrls: ['./tab-card.component.scss'],
})
export class TabCardComponent implements OnInit {
  @Input() tab: Tab | undefined = undefined;
  @Input() canEdit: boolean = false;

  constructor(
    private currentUserService: CurrentUserService,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  tabInfo(): string {
    const info = `${this.tab?.artist} - ${this.tab?.song}`;

    if (info.length > 50) {
      return `${info.slice(0, 30)}...`;
    } else {
      return info;
    }
  }

  onDeleteClicked(): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { tabName: this.tab?.name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'Yes') {
        return;
      }

      if (!this.tab || !this.tab.id) {
        return;
      }

      this.currentUserService
        .deleteTab(this.tab.id)
        .catch((error: HttpErrorResponse) => {
          this.matSnackBar.open(
            'Server error deleting tab. Try again later',
            'Ok'
          );
        });
    });
  }
}
