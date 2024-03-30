import { Tab } from './tab/tab';

export class User {
  readonly id: number = 0;
  public username: string = '';
  public email: string = '';
  public tabs?: Tab[] = undefined;

  constructor(id: number, username: string, email: string, tabs?: Tab[]) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.tabs = tabs;
  }

  static fromObject(userObject: any): User {
    return new User(userObject.id, userObject.username, userObject.email);
  }

  static fromString(userString: string): User {
    const userObject = JSON.parse(userString);
    return User.fromObject(userObject);
  }
}
