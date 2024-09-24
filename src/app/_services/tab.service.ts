import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tab } from '@atikincode/tabui/dist/models/tab';
import { environment } from 'src/environments/environment';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private _tab: Tab = new Tab();

  constructor(
    private http: HttpClient,
    private currentUserService: CurrentUserService
  ) {}

  loadTab(tabId: string | number): Promise<Tab> {
    const url = `${environment.serverAddress}/api/tab/${tabId}`;

    return new Promise<Tab>((resolve, reject) => {
      this.http.get<Tab>(url).subscribe({
        next: (res: Tab) => {
          this._tab = Tab.fromObject(res);
          resolve(res);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        },
      });
    });
  }

  saveTab(): Promise<Tab> {
    const url = `${environment.serverAddress}/api/tab/${this._tab?.id}`;
    const body = {
      artist: this._tab?.artist,
      song: this._tab?.song,
      guitar: this._tab?.guitar,
      bars: this._tab?.bars,
      isPublic: this._tab?.isPublic,
      userId: this.currentUserService.currentUser?.id,
    };

    return new Promise<Tab>((resolve, reject) => {
      this.http.put<Tab>(url, body).subscribe({
        next: (res: Tab) => {
          resolve(res);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        },
      });
    });
  }

  get tab(): Tab {
    return this._tab;
  }

  set tab(tab: Tab) {
    this._tab = tab;
  }
}
