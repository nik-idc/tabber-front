import { Score } from '@atikincode/tabui';
import { Tab } from '@atikincode/tabui/dist/models/tab';

export class User {
  readonly id: number = 0;
  public username: string = '';
  public email: string = '';
  public createdAt?: string | Date;
  public scores?: Score[] = undefined;

  constructor(
    id: number,
    username: string,
    email: string,
    createdAt?: string | Date,
    scores?: Score[]
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.createdAt = createdAt;
    this.scores = scores;
  }

  static fromObject(userObject: any): User {
    return new User(
      userObject.id,
      userObject.username,
      userObject.email,
      userObject.createdAt
    );
  }

  static fromString(userString: string): User {
    const userObject = JSON.parse(userString);
    return User.fromObject(userObject);
  }
}
