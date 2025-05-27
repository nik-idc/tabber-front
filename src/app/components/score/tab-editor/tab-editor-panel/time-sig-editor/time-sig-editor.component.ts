import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface TimeSigEditorData {
  initBeatsCount: number;
  initDuration: number;
}

@Component({
  selector: 'app-time-sig-editor',
  templateUrl: './time-sig-editor.component.html',
  styleUrl: './time-sig-editor.component.scss',
})
export class TimeSigEditorComponent {
  public newBeatsCount: number;
  public newDuration: number;

  constructor(
    public dialogRef: MatDialogRef<TimeSigEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TimeSigEditorData
  ) {
    this.newBeatsCount = data.initBeatsCount;
    this.newDuration = 1 / data.initDuration;
  }

  @HostListener('document:keydown.enter')
  onEnterDown(event: KeyboardEvent) {
    this.dialogRef.close(['Yes', this.newBeatsCount, this.newDuration]);
  }
}
