import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface TempoEditorData {
  initTempo: number;
}

@Component({
  selector: 'app-tempo-editor',
  templateUrl: './tempo-editor.component.html',
  styleUrl: './tempo-editor.component.scss',
})
export class TempoEditorComponent {
  public newTempo: number;

  constructor(
    public dialogRef: MatDialogRef<TempoEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TempoEditorData
  ) {
    this.newTempo = data.initTempo;
  }

  @HostListener('document:keydown.enter')
  onEnterDown(event: KeyboardEvent) {
    // this.copyingStarted = true;
    this.dialogRef.close(['Yes', this.newTempo]);
  }
}
