import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Score, Tab } from '@atikincode/tabui/dist/index';
import { CurrentUserService } from 'src/app/_services/current-user.service';
import { AudioUploaderComponent } from '../dialogs/audio-uploader/audio-uploader.component';
import { MatDialog } from '@angular/material/dialog';
import { ScoreService } from 'src/app/_services/score.service';

interface TranscribeReturn {
  initData: {
    id: number;
    name: string;
    artist: string;
    song: string;
    isPublic: boolean;
    tracks: Array<any>;
    userId: number;
    updatedAt: string;
    createdAt: string;
  };
  filename: string;
}

@Component({
  selector: 'app-score-list',
  templateUrl: './score-list.component.html',
  styleUrls: ['./score-list.component.scss'],
})
export class ScoreListComponent implements OnInit {
  @Input() scores: Score[] | undefined = undefined;
  @Input() canEdit: boolean = false;
  @Input() title: string = '';

  private currentTranscriptionData: TranscribeReturn | undefined;
  private transcriptionIntervalId: number = -1;
  public transcriptionDone: boolean = true;

  constructor(
    private currentUserService: CurrentUserService,
    private scoreService: ScoreService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  onAddClicked(): void {
    this.currentUserService
      .addScore()
      .then((score: Score) => {
        // this.scores?.push(score);
        // this.router.navigate(['score', score.id]);
      })
      .catch((error: HttpErrorResponse) => {
        this.matSnackBar.open('Error response from server, try again later');
      });
  }

  private checkTranscription(): void {
    if (this.currentTranscriptionData === undefined) {
      throw Error(
        'Attempted to check transcription status while no transcription is in progress'
      );
    }

    this.scoreService
      .getTranscription(
        this.currentTranscriptionData.filename,
        this.currentTranscriptionData.initData.id,
        this.currentTranscriptionData.initData.name,
        this.currentTranscriptionData.initData.artist,
        this.currentTranscriptionData.initData.song,
        this.currentTranscriptionData.initData.isPublic
      )
      .then((res: any) => {
        console.log('checkTranscription success', res);

        if (res.msg !== undefined) {
          this.transcriptionDone = false;
      } else {
          this.transcriptionDone = true;

          this.scores?.push(Score.fromObject(res));

          this.currentTranscriptionData = undefined;

          window.clearInterval(this.transcriptionIntervalId);
        }
      })
      .catch((error) => {
        console.log('checkTranscription error', error);
      });
  }

  onTranscribeClicked(): void {
    const dialogRef = this.dialog.open(AudioUploaderComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result[0] === 'Cancel') {
        return;
      }

      this.scoreService
        .transcribe(result[1])
        .then((res: TranscribeReturn) => {
          console.log('onTranscriptionClicked success');

          this.currentTranscriptionData = res;

          this.checkTranscription();
          this.transcriptionIntervalId = window.setInterval(() => {
            this.checkTranscription();
          }, 5000);
        })
        .catch((error) => {
          console.log('onTranscriptionClicked error', error);

          this.matSnackBar.open('Error transcribing', 'OK');
        });
    });
  }
}
