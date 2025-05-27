import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../_models/user';
import { Signin } from '../_models/login';
import { environment } from 'src/environments/environment';
import { Signup } from '../_models/signup';
import { Score } from '@atikincode/tabui/dist/models/score';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private _currentUser?: User = undefined;

  constructor(private http: HttpClient) {
    this._currentUser = this.getCurrentUser();
  }

  private getCurrentUser(): User | undefined {
    const currentUserString = localStorage.getItem('currentUser');

    if (currentUserString === null) return undefined;

    return User.fromString(currentUserString);
  }

  private saveCurrentUser(token: string): void {
    const currentUserString = JSON.stringify({
      id: this._currentUser?.id,
      username: this._currentUser?.username,
      email: this._currentUser?.email,
      createdAt: this._currentUser?.createdAt,
    });

    localStorage.setItem('currentUser', currentUserString);
    localStorage.setItem('token', token);
  }

  edit(username: string, email: string) {
    const url = `${environment.serverAddress}/api/user/${this._currentUser?.id}`;
    const body = {
      username: this._currentUser?.username === username ? undefined : username,
      email: this._currentUser?.email === email ? undefined : email,
    };

    return new Promise<User>((resolve, reject) => {
      this.http.put<any>(url, body).subscribe({
        next: (res: any) => {
          this._currentUser = User.fromObject(res.user);
          this.saveCurrentUser(res.token);
          resolve(this._currentUser);
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        },
      });
    });
  }

  signup(signupData: Signup): Promise<User> {
    const url = `${environment.serverAddress}/api/signup`;
    const body = signupData;

    return new Promise<User>((resolve, reject) => {
      this.http.post<any>(url, body).subscribe({
        next: (res: any) => {
          this._currentUser = User.fromObject(res.user);
          this.saveCurrentUser(res.token);
          resolve(this._currentUser);
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        },
      });
    });
  }

  signin(signinData: Signin): Promise<User> {
    const url = `${environment.serverAddress}/api/signin`;
    const body = signinData;

    return new Promise<User>((resolve, reject) => {
      this.http.post<any>(url, body).subscribe({
        next: (res: any) => {
          this._currentUser = User.fromObject(res.user);
          this.saveCurrentUser(res.token);
          resolve(this._currentUser);
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        },
      });
    });
  }

  signout(): void {
    this._currentUser = undefined;
    localStorage.removeItem('currentUser');
  }

  getScores(): Promise<Score[]> {
    const url = `${environment.serverAddress}/api/user/${this._currentUser?.id}/score`;

    return new Promise<Score[]>((resolve, reject) => {
      this.http.get(url).subscribe({
        next: (resScores: any) => {
          const scores = [];
          for (const score of resScores) {
            console.log(score);
            scores.push(Score.fromObject(score));
          }

          if (this._currentUser) {
            this._currentUser.scores = scores;
          }

          resolve(scores);
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        },
      });
    });
  }

  addScore(): Promise<Score> {
    const url = `${environment.serverAddress}/api/score`;

    const emptyScore = new Score();
    const body = {
      name: emptyScore.name,
      artist: emptyScore.artist,
      song: emptyScore.song,
      isPublic: emptyScore.isPublic,
      tracks: JSON.stringify(emptyScore.tracks),
      userId: this._currentUser?.id,
    };

    console.log(JSON.parse(JSON.stringify(body)));

    return new Promise<Score>((resolve, reject) => {
      this.http.post<Score>(url, body).subscribe({
        next: (resScore: Score) => {
          const score = Score.fromObject(resScore);
          this._currentUser?.scores?.push(score);

          resolve(score);
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        },
      });
    });
  }

  editScore(scoreId: string | number): void {
    throw new Error('Method not implemented.');
  }

  deleteScore(scoreId: string | number) {
    const url = `${environment.serverAddress}/api/score/${scoreId}`;

    return new Promise<void>((resolve, reject) => {
      this.http.delete(url).subscribe({
        next: (next: any) => {
          if (this._currentUser) {
            const newScores = this._currentUser?.scores?.filter(
              (score) => score.id !== scoreId
            );
            this._currentUser.scores = newScores;
          }

          resolve();
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        },
      });
    });
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get loggedIn(): boolean {
    return this._currentUser !== undefined;
  }

  get currentUser(): User | undefined {
    return this._currentUser;
  }
}
