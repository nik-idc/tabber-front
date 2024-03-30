import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Signin } from '../_models/login';
import { environment } from 'src/environments/environment';
import { Signup } from '../_models/signup';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
