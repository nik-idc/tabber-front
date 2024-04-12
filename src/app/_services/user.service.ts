import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../_models/user';
import { Tab } from '../_models/tab/tab';
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
          this._user = User.fromObject(res);
          resolve(res);
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        },
      });
    });
  }

  getUserTabs(userId: string | number): Promise<Tab[]> {
    const url = `${environment.serverAddress}/api/user/${userId}/tabs`;

    return new Promise<Tab[]>((resolve, reject) => {
      this.http.get<Tab[]>(url).subscribe({
        next: (res: any) => {
          const tabs: Tab[] = [];
          for (const tab of res) {
            tabs.push(Tab.fromObject(tab));
          }

          if (this._user) {
            this._user.tabs = tabs;
          }

          resolve(tabs);
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        },
      });
    });
  }

  // createNewTab(): Promise<Tab> {
  //   let tab = new Tab();

  //   let body = { userId: this._user.id, userTab: tab };

  //   return new Promise<any>((resolve, reject) => {
  //     this.http.post<any>(this.tabsUrl, body).subscribe({
  //       next: (res: any) => {
  //         this._user.tabs.push(Tab.fromObject(res));
  //         resolve(res);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //     });
  //   });
  // }

  // updateTab(tab: Tab): Promise<Tab> {
  //   if (tab.id === undefined) {
  //     throw new Error(
  //       'Tab id is null, need to create it in the database first'
  //     );
  //   }

  //   let body = tab;

  //   let tabIndex = this._user.tabs.indexOf(tab);

  //   return new Promise<Tab>((resolve, reject) => {
  //     this.http.put<Tab>(this.tabsUrl, body).subscribe({
  //       next: (res: Tab) => {
  //         this._user.tabs[tabIndex] = Tab.fromObject(res);
  //         resolve(res);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //     });
  //   });
  // }

  deleteTab(tabId: string | number): Promise<void> {
    const url = `${environment.serverAddress}/api/tab/${tabId}`;

    return new Promise<void>((resolve, reject) => {
      this.http.delete(url).subscribe({
        next: () => {
          if (this._user) {
            const tabIndex = this._user.tabs?.findIndex((tab) => {
              return tab.id === tabId;
            });

            if (tabIndex) {
              this._user.tabs?.splice(tabIndex, 1);
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
