import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class TabStateService {
	private currentTabId: number | undefined;

	public onChangeCurrentTabId: EventEmitter<number | undefined> = new EventEmitter();

	setCurrentTabId(tabId: number | undefined) {
		this.currentTabId = tabId;

		this.onChangeCurrentTabId.emit(this.currentTabId);
	}

	getCurrentTabId(): number | undefined {
        return this.currentTabId;
    }
}