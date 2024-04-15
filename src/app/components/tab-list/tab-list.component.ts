import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Tab } from 'src/app/_models/tab/tab';
import { CurrentUserService } from 'src/app/_services/current-user.service';

@Component({
  selector: 'app-tab-list',
  templateUrl: './tab-list.component.html',
  styleUrls: ['./tab-list.component.scss'],
})
export class TabListComponent implements OnInit {
  @Input() tabs: Tab[] | undefined = undefined;
  @Input() canEdit: boolean = false;
  @Input() title: string = '';

  constructor(
    private currentUserService: CurrentUserService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onAddClicked(): void {
    this.currentUserService
      .addTab()
      .then((tab: Tab) => {
        this.tabs?.push(tab);
        // this.router.navigate(['tab', tab.id]);
      })
      .catch((error: HttpErrorResponse) => {
        this.matSnackBar.open('Error response from server, try again later');
      });
  }
}
