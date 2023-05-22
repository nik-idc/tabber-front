import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { Login } from '../models/login';
import { Signup } from '../models/signup';
import { Tab } from '../models/tab/tab';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private signInUrl = 'http://localhost:3000/api/signin';
  private signUpUrl = 'http://localhost:3000/api/signup';
  private userUrl = 'http://localhost:3000/api/user';
  private tabsUrl = 'http://localhost:3000/api/tabs';

  private _user: User;

  constructor(private http: HttpClient) {
    this._user = new User();
  }

  private processAuthResponse(res: any) {
    // Check if response is valid
    if (res.data === undefined || res.token === undefined) {
      throw new Error('Invalid server response');
    }

    // Response body has data and token
    // Build new user instance
    let userObject = res.data as User;
    this._user = User.fromObject(userObject);

    // Save token to local storage
    let token = res.token;
    localStorage.setItem('token', token);
  }

  signUp(signupData: Signup): Promise<User> {
    let body = signupData;

    return new Promise<User>((resolve, reject) => {
      this.http.post<any>(this.signUpUrl, body).subscribe({
        next: (res: any) => {
          this.processAuthResponse(res);
          resolve(this._user);
        },
        error: (err: any) => {
          reject(err);
        }
      })
    });
  }

  signIn(loginData: Login): Promise<User> {
    let body = loginData;

    return new Promise<User>((resolve, reject) => {
      this.http.post<any>(this.signInUrl, body).subscribe({
        next: (res: any) => {
          this.processAuthResponse(res);
          resolve(this._user);
        },
        error: (err: any) => {
          reject(err);
        }
      })
    });
  }

  signOut(): void {
    localStorage.removeItem('token');
  }

  getUser(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.http.get<User>(this.userUrl).subscribe({
        next: (res: User) => {
          this._user = User.fromObject(res);
          resolve(res);
        },
        error: (err: any) => {
          reject(err);
        }
      })
    });
  }

  updateUser(): Promise<User> {
    let body = { userData: this._user };

    return new Promise<User>((resolve, reject) => {
      this.http.put<User>(this.userUrl, body).subscribe({
        next: (res: User) => {
          this._user = User.fromObject(res);
          resolve(res);
        },
        error: (err: any) => {
          reject(err);
        }
      })
    });
  }

  deleteUser(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.delete(this.userUrl).subscribe({
        next: () => {
          resolve();
        },
        error: (err: any) => {
          reject(err);
        }
      })
    });
  }

  createNewTab(): Promise<Tab> {
    let tab = new Tab();

    let body = { userId: this._user.id, userTab: tab };

    return new Promise<any>((resolve, reject) => {
      this.http.post<any>(this.tabsUrl, body).subscribe({
        next: (res: any) => {
          this._user.tabs.push(Tab.fromObject(res));
          resolve(res);
        },
        error: (err: any) => {
          reject(err);
        }
      })
    });
  }

  updateTab(tab: Tab): Promise<Tab> {
    if (tab.id === undefined) {
      throw new Error('Tab id is null, need to create it in the database first');
    }

    let body = tab;

    let tabIndex = this._user.tabs.indexOf(tab);

    return new Promise<Tab>((resolve, reject) => {
      this.http.put<Tab>(this.tabsUrl, body).subscribe({
        next: (res: Tab) => {
          this._user.tabs[tabIndex] = Tab.fromObject(res);
          resolve(res);
        },
        error: (err: any) => {
          reject(err);
        }
      })
    });
  }

  deleteTab(tab: Tab): Promise<void> {
    if (tab.id === undefined) {
      throw new Error('Tab id is null, need to create it in the database first');
    }

    let body = { tabId: tab.id };
    let tabIndex = this._user.tabs.indexOf(tab);

    return new Promise<void>((resolve, reject) => {
      this.http.request<void>('delete', this.tabsUrl, { body: body }).subscribe({
        next: () => {
          this._user.tabs.splice(tabIndex, 1);
          resolve();
        },
        error: (err: any) => {
          reject(err);
        }
      })
    });
  }

  get loggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get user(): User {
    return this._user;
  }
}
