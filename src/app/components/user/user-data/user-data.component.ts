import { Component, Input } from '@angular/core';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss',
})
export class UserDataComponent {
  @Input() user: User | undefined = undefined;
}
