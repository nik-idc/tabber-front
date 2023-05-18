import { Tab } from "./tab/tab";

export class User {
	public id: number;
	public username: string;
	public tabs: Tab[];

	constructor (id: number = 0, username: string = '', tabs: Tab[] = []) {
		this.id = id;
		this.username = username;
		this.tabs = tabs;
	}
}