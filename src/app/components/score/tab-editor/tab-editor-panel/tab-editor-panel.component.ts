import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import {
  DURATION_TO_NAME,
  NoteDuration,
  TabWindow,
} from '@atikincode/tabui/dist/index';
import { ScoreService } from 'src/app/_services/score.service';
import { TempoEditorComponent } from './tempo-editor/tempo-editor.component';
import { TimeSigEditorComponent } from './time-sig-editor/time-sig-editor.component';

@Component({
  selector: 'app-tab-editor-panel',
  templateUrl: './tab-editor-panel.component.html',
  styleUrls: ['./tab-editor-panel.component.scss'],
})
export class TabEditorPanelComponent implements OnInit {
  @Input() tabIndex: number = 0;
  @Input() tabWindow!: TabWindow;

  public durations: NoteDuration[] = [];

  constructor(private scoreService: ScoreService, private dialog: MatDialog) {
    this.calcDurations();
  }
  ngOnInit(): void {}

  private calcDurations(): void {
    this.durations = [];
    const valuesDefault = Object.values(NoteDuration);
    for (const value of valuesDefault) {
      if (typeof value === 'string') {
        continue;
      }

      this.durations.push(value);
    }
  }

  onNoteDurationClick(duration: number): void {
    // Check if any note is selected
    const selected = this.tabWindow.getSelectedElement();
    const selectionBeats = this.tabWindow.getSelectionBeats();

    if (selected === undefined && selectionBeats.length === 0) {
      return;
    }

    if (selected !== undefined) {
      this.tabWindow.changeSelectedBeatDuration(duration);
    } else if (selectionBeats.length !== 0) {
      this.tabWindow.changeSelectionDuration(duration);
    }
  }

  onTimeSigClicked(event: MouseEvent): void {
    console.log(event, 'onTimeSigClicked');

    const selectedElement = this.tabWindow.getSelectedElement();

    if (selectedElement === undefined) {
      throw Error(
        "No element selected - don't know which bar's time signature to change"
      );
    }

    const dialogRef = this.dialog.open(TimeSigEditorComponent, {
      data: {
        initBeatsCount: selectedElement.bar.beatsCount,
        initDuration: selectedElement.bar.duration,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result[0] === 'Cancel') {
        return;
      }

      this.tabWindow.changeSelectedBarBeats(result[1]);
      this.tabWindow.changeSelectedBarDuration(1 / result[2]);
    });
  }

  onTempoClicked(event: MouseEvent): void {
    console.log(event, 'onTempoClicked');

    const selectedElement = this.tabWindow.getSelectedElement();

    if (selectedElement === undefined) {
      throw Error(
        "No element selected - don't know which bar's tempo to change"
      );
    }

    const tempo = selectedElement.bar.tempo;

    const dialogRef = this.dialog.open(TempoEditorComponent, {
      data: { initTempo: tempo },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (result[0] === 'Cancel') {
        return;
      }

      this.tabWindow.changeSelectedBarTempo(result[1]);
    });
  }

  onBeatsChanged(event: MatSelectChange) {
    // Check if any note is selected
    if (!this.tabWindow.getSelectedElement()) {
      return;
    }

    this.tabWindow.changeSelectedBarBeats(event.value);
  }

  onDurationChanged(event: MatSelectChange) {
    // Check if any note is selected
    if (!this.tabWindow.getSelectedElement()) {
      return;
    }

    this.tabWindow.changeSelectedBarDuration(1 / event.value);
  }

  onTempoChanged(event: Event) {
    // Check if any note is selected
    if (!this.tabWindow.getSelectedElement()) {
      return;
    }

    const target = event.target as HTMLTextAreaElement;
    this.tabWindow.changeSelectedBarTempo(Number(target.value));
  }

  public get DURATION_TO_NAME(): { [duration: number]: string } {
    return DURATION_TO_NAME;
  }
}
