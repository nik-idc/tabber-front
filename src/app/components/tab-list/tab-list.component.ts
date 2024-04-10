import { Component, Input, OnInit } from '@angular/core';
import { Tab } from 'src/app/_models/tab/tab';

@Component({
  selector: 'app-tab-list',
  templateUrl: './tab-list.component.html',
  styleUrls: ['./tab-list.component.scss'],
})
export class TabListComponent implements OnInit {
  @Input() tabs: Tab[] | undefined = undefined;
  @Input() canEdit: boolean = false;
  @Input() title: string = '';

  constructor() {}

  ngOnInit(): void {}
}
