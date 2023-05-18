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
  private updateUserUrl = 'http://localhost:3000/api/user';
  private updateTabsUrl = 'http://localhost:3000/api/tabs';

  private user: User;

  constructor(private http: HttpClient) {
    this.user = new User();
  }
  
    signUp(signupData: Signup) {
      let body = signupData;
  
      return new Promise((resolve, reject) => {
        this.http.put<User>(this.signUpUrl, body).subscribe({
          next: (res: User) => {
            this.user = res;
            resolve(res);
          },
          error: (err: any) => {
            reject(err);
          }
        })
      });
    }

  signIn(loginData: Login) {
    let body = loginData;

    return new Promise<User>((resolve, reject) => {
      this.http.post<User>(this.signInUrl, body).subscribe({
        next: (res: any) => {
          this.user = res.userData;
          this.user = res;
          resolve(res);
        },
        error: (err: any) => {
          reject(err);
        }
      })
    });
  }

  updateUser(user: User) {
    
  }

  signOut(): void {

  }

  saveNewTab(tab: Tab) {
    let body = { userId: this.user.id, userTab: tab };

    return new Promise<void>((resolve, reject) => {
      this.http.put(this.updateTabsUrl, body).subscribe({
        next: () => {
          this.user.tabs.push(tab);
          resolve();
        },
        error: (err: any) => {
          reject(err);
        }
      })
    });
  }

  updateTab(tab: Tab) {
    if (tab.id == null) {
      throw new Error('Tab id is null, need to create it in the database first');
    }

    let body = { userTab: tab };

    return new Promise<void>((resolve, reject) => {
      this.http.put(this.updateTabsUrl, body).subscribe({
        next: () => {
          resolve();
        },
        error: (err: any) => {
          reject(err);
        }
      })
    });
  }

  deleteTab(tab: Tab) {
    if (tab.id == null) {
      throw new Error('Tab id is null, need to create it in the database first');
    }

    let body = { tabId: tab.id };
    
    return new Promise<void>((resolve, reject) => {
      this.http.request('delete', this.updateTabsUrl, {body: body}).subscribe({
        next: () => {
          this.user.tabs.splice(this.user.tabs.indexOf(tab), 1);
          resolve();
        },
        error: (err: any) => {
          reject(err);
        }
      })
    });
  }

  getUser(): User {
    return this.user;
  }
}
