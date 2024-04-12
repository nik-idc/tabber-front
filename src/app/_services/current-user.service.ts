import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../_models/user';
import { Signin } from '../_models/login';
import { environment } from 'src/environments/environment';
import { Signup } from '../_models/signup';
import { Tab } from '../_models/tab/tab';

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

  getTabs(): Promise<Tab[]> {
    const url = `${environment.serverAddress}/api/user/${this._currentUser?.id}/tabs`;

    return new Promise<Tab[]>((resolve, reject) => {
      this.http.get(url).subscribe({
        next: (resTabs: any) => {
          const tabs = [];
          for (const tab of resTabs) {
            tabs.push(Tab.fromObject(tab));
          }

          if (this._currentUser) {
            this._currentUser.tabs = tabs;
          }

          resolve(tabs);
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        },
      });
    });
  }

  addTab(): Promise<Tab> {
    const url = `${environment.serverAddress}/api/tab`;

    const emptyTab = new Tab();
    const body = {
      artist: emptyTab.artist,
      song: emptyTab.song,
      guitar: JSON.stringify(emptyTab.guitar),
      bars: JSON.stringify(emptyTab.bars),
      isPublic: emptyTab.isPublic,
      userId: this._currentUser?.id,
    };

    return new Promise<Tab>((resolve, reject) => {
      this.http.post<Tab>(url, body).subscribe({
        next: (resTab: Tab) => {
          const tab = Tab.fromObject(resTab);
          this._currentUser?.tabs?.push(tab);

          resolve(tab);
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        },
      });
    });
  }

  editTab(tabId: string | number): void {
    throw new Error('Method not implemented.');
  }

  deleteTab(tabId: string | number) {
    const url = `${environment.serverAddress}/api/tab/${tabId}`;

    return new Promise<void>((resolve, reject) => {
      this.http.delete(url).subscribe({
        next: (next: any) => {
          if (this._currentUser) {
            const newTabs = this._currentUser?.tabs?.filter(
              (tab) => tab.id !== tabId
            );
            this._currentUser.tabs = newTabs;
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
