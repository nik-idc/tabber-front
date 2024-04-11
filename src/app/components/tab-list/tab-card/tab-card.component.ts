import { Component, Input, OnInit } from '@angular/core';
import { Tab } from 'src/app/_models/tab/tab';

@Component({
  selector: 'app-tab-card',
  templateUrl: './tab-card.component.html',
  styleUrls: ['./tab-card.component.scss'],
})
export class TabCardComponent implements OnInit {
  @Input() tab: Tab | undefined = undefined;
  @Input() canEdit: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  tabInfo(): string {
    const info = `${this.tab?.artist} - ${this.tab?.song}`;

    if (info.length > 50) {
      return `${info.slice(0, 30)}...`;
    } else {
      return info;
    }
  }
}
