import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../_models/user';
import { Score } from '@atikincode/tabui/dist/models/score';
import { environment } from 'src/environments/environment';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user: User | undefined = undefined;

  constructor(
    private http: HttpClient,
    private loggingService: LoggingService
  ) {}

  getUser(id: string | number): Promise<User> {
    const url = `${environment.serverAddress}/api/user/${id}`;

    return new Promise<User>((resolve, reject) => {
      this.http.get<User>(url).subscribe({
        next: (res: User) => {
          this._user = User.fromJSON(res);
          resolve(res);
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        },
      });
    });
  }

  getUserScores(userId: string | number): Promise<Score[]> {
    const url = `${environment.serverAddress}/api/user/${userId}/score`;

    return new Promise<Score[]>((resolve, reject) => {
      this.http.get<Score[]>(url).subscribe({
        next: (res: any) => {
          const scores: Score[] = [];
          for (const score of res) {
            scores.push(Score.fromJSON(score));
          }

          if (this._user) {
            this._user.scores = scores;
          }

          resolve(scores);
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        },
      });
    });
  }

  // createNewScore(): Promise<Score> {
  //   let score = new Score();

  //   let body = { userId: this._user.id, userScore: score };

  //   return new Promise<any>((resolve, reject) => {
  //     this.http.post<any>(this.scoresUrl, body).subscribe({
  //       next: (res: any) => {
  //         this._user.scores.push(Score.fromJSON(res));
  //         resolve(res);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //     });
  //   });
  // }

  // updateScore(score: Score): Promise<Score> {
  //   if (score.id === undefined) {
  //     throw new Error(
  //       'Score id is null, need to create it in the dascorease first'
  //     );
  //   }

  //   let body = score;

  //   let scoreIndex = this._user.scores.indexOf(score);

  //   return new Promise<Score>((resolve, reject) => {
  //     this.http.put<Score>(this.scoresUrl, body).subscribe({
  //       next: (res: Score) => {
  //         this._user.scores[scoreIndex] = Score.fromJSON(res);
  //         resolve(res);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //     });
  //   });
  // }

  deleteScore(scoreId: string | number): Promise<void> {
    const url = `${environment.serverAddress}/api/score/${scoreId}`;

    return new Promise<void>((resolve, reject) => {
      this.http.delete(url).subscribe({
        next: () => {
          if (this._user) {
            const scoreIndex = this._user.scores?.findIndex((score) => {
              return score.id === scoreId;
            });

            if (scoreIndex) {
              this._user.scores?.splice(scoreIndex, 1);
            }
          }
          resolve();
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }

  get user(): User | undefined {
    return this._user;
  }
}
