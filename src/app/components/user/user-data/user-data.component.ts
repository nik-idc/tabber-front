import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { LoggingService } from 'src/app/_services/logging.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss',
})
export class UserDataComponent {
  @Input() user: User | undefined = undefined;

  constructor(private loggingService: LoggingService) {}

  prettyCreatedAtDate(): string {
    // this.loggingService.log(this.user);

    if (this.user && this.user.createdAt) {
      return formatDate(this.user.createdAt, 'dd.MM.YYYY', 'en');
    } else {
      return '';
    }
  }
}
