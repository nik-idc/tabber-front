import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Score } from '@atikincode/tabui/dist/models/score';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { ScoreService } from 'src/app/_services/score.service';
import { CurrentUserService } from 'src/app/_services/current-user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent implements OnInit {
  public scoreInfoForm = this.formBuilder.group({
    name: [''],
    artist: [''],
    song: [''],
  });
  public selectedTrackIndex: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private currentUserService: CurrentUserService,
    private scoreService: ScoreService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ score }) => {
      console.log('Score resolved!', score);

      this.updateForm();
    });
  }

  updateForm(): void {
    this.scoreInfoForm.get('name')?.setValue(this.scoreService.score.name);
    this.scoreInfoForm.get('artist')?.setValue(this.scoreService.score.artist);
    this.scoreInfoForm.get('song')?.setValue(this.scoreService.score.song);
  }

  onSaveChangesClick(): void {
    this.scoreService
      .saveScore()
      .then((res) => {
        this.snackBar.open(`Tab saved`, 'OK');
      })
      .catch((error: HttpErrorResponse) => {
        this.snackBar.open(`Error during saving score: ${error.message}`, 'OK');
      });
  }

  public get score(): Score {
    return this.scoreService.score;
  }
}
