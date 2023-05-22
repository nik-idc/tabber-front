import { Tab } from "./tab/tab";

export class User {
	readonly id: number;
	public username: string;
	public tabs: Tab[];

	constructor (id: number = 0, username: string = '', tabs: Tab[] = []) {
		this.id = id;
		this.username = username;
		this.tabs = tabs;
	}

	static fromObject (obj: any): User {
		if (obj.id === undefined ||
			obj.username === undefined ||
            obj.tabs === undefined) {
            throw new Error('Invalid js obj to parse to user');
        }

		let user = new User(obj.id, obj.username, []); // Create a user instance
		obj.tabs.forEach((tab: Tab) => user.tabs.push(Tab.fromObject(tab))); // Parse tabs
		return user;
	}
}