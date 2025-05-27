import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface AudioUploaderData {
  inputFileName: string;
}

@Component({
  selector: 'app-audio-uploader',
  templateUrl: './audio-uploader.component.html',
  styleUrl: './audio-uploader.component.scss',
})
export class AudioUploaderComponent {
  public inputFileName: string;
  public file?: File;

  @ViewChild('fileUploader') fileUploader!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<AudioUploaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AudioUploaderData
  ) {
    this.inputFileName = '';
  }

  onClick(event: MouseEvent): void {
    if (this.fileUploader) {
      this.fileUploader.nativeElement.click();
    }
  }

  onInput(event: Event): void {}

  onFileSelected(event: Event): void {
    if (event.target === null) {
      throw Error("File selected 'change' event target is null");
    }

    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files === null) {
      throw Error('File list is null');
    }

    console.log('onFileSelected files', files);
    this.file = files[0];
  }

  @HostListener('document:keydown.enter')
  onEnterDown(event: KeyboardEvent) {
    this.dialogRef.close(['Yes', this.file]);
  }
}
