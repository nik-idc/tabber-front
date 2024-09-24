import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Tab } from '@atikincode/tabui/dist/models/tab';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { TabService } from 'src/app/_services/tab.service';
import { CurrentUserService } from 'src/app/_services/current-user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  @Input() tab: Tab = new Tab();
  public tabInfoForm = this.formBuilder.group({
    artist: [''],
    song: [''],
  });

  constructor(
    private userService: UserService,
    private currentUserService: CurrentUserService,
    private tabService: TabService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {}

  onSaveChangesClick(): void {
    this.tabService.saveTab().catch((error: HttpErrorResponse) => {
      this.snackBar.open(`Error during saving tab: ${error.message}`, 'OK');
    });
  }
}
