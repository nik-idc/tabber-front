import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Score } from '@atikincode/tabui/dist/models/score';
import { environment } from 'src/environments/environment';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private _score: Score = new Score();

  constructor(
    private http: HttpClient,
    private currentUserService: CurrentUserService
  ) {}

  loadScore(scoreId: string | number): Promise<Score> {
    const url = `${environment.serverAddress}/api/score/${scoreId}`;

    return new Promise<Score>((resolve, reject) => {
      this.http.get<Score>(url).subscribe({
        next: (res: any) => {
          this._score = Score.fromJSON(res);
          resolve(res);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        },
      });
    });
  }

  saveScore(): Promise<Score> {
    if (this._score === undefined) {
      throw Error("Can't save score - one has not been loaded yet");
    }

    if (this.currentUserService.currentUser === undefined) {
      throw Error('Current user service user value is undefined');
    }

    const url = `${environment.serverAddress}/api/score/${this._score.id}`;
    const body = {
      userId: this.currentUserService.currentUser.id,
      name: this._score.name,
      artist: this._score.artist,
      song: this._score.song,
      isPublic: this._score.isPublic,
      tracks: JSON.stringify(this._score.tracks),
    };

    return new Promise<Score>((resolve, reject) => {
      this.http.put<Score>(url, body).subscribe({
        next: (res: Score) => {
          resolve(res);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        },
      });
    });
  }

  transcribe(file: File): Promise<any> {
    const url = `${environment.serverAddress}/api/transcribe`;

    return new Promise<any>((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<any>(url, formData).subscribe({
        next: (res: any) => {
          resolve(res);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        },
      });
    });
  }

  getTranscription(
    filename: string,
    transcriptionId: number,
    name: string,
    artist: string,
    song: string,
    isPublic: boolean
  ): Promise<any> {
    const url = `${environment.serverAddress}/api/transcribe`;

    const params = new HttpParams()
      .set('filename', filename)
      .set('transcription_id', transcriptionId)
      .set('name', name)
      .set('artist', artist)
      .set('song', song)
      .set('isPublic', isPublic);

    return new Promise<any>((resolve, reject) => {
      this.http.get<any>(url, { params: params }).subscribe({
        next: (res: any) => {
          resolve(res);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        },
      });
    });
  }

  get score(): Score {
    return this._score;
  }

  set score(score: Score) {
    this._score = score;
  }
}
