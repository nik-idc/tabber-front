import { Dialog } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Score, Tab } from '@atikincode/tabui/dist/index';
import { CurrentUserService } from 'src/app/_services/current-user.service';
import { ConfirmDeleteDialogComponent } from '../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.component.html',
  styleUrls: ['./score-card.component.scss'],
})
export class ScoreCardComponent implements OnInit {
  @Input() score: Score | undefined = undefined;
  @Input() canEdit: boolean = false;

  constructor(
    private currentUserService: CurrentUserService,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  tabInfo(): string {
    const info = `${this.score?.artist} - ${this.score?.song}`;

    if (info.length > 50) {
      return `${info.slice(0, 30)}...`;
    } else {
      return info;
    }
  }

  onDeleteClicked(): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { tabName: this.score?.song },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'Yes') {
        return;
      }

      if (!this.score || !this.score.id) {
        return;
      }

      this.currentUserService
        .deleteScore(this.score.id)
        .catch((error: HttpErrorResponse) => {
          this.matSnackBar.open(
            'Server error deleting tab. Try again later',
            'Ok'
          );
        });
    });
  }
}
