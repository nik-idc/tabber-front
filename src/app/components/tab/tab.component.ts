import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Rect } from 'src/app/_shared/tab-window/shapes/rect';
import { TabLineDim } from 'src/app/_shared/tab-window/tab-line-dim';
import { TabWindow } from 'src/app/_shared/tab-window/tab-window';
import { Tab } from 'src/app/_models/tab/tab';
import { BarElement } from 'src/app/_shared/tab-window/elements/bar-element';
import { ChordElement } from 'src/app/_shared/tab-window/elements/chord-element';
import { NoteElement } from 'src/app/_shared/tab-window/elements/note-element';
import { Guitar } from 'src/app/_models/tab/guitar';
import { KeyChecker } from 'src/app/_shared/key-checker/key-checker';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { TabService } from 'src/app/_services/tab.service';
import { AuthService } from 'src/app/_services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
})
export class TabComponent implements OnInit, OnChanges {
  newTab: boolean = true;
  @Input() tab: Tab = new Tab();
  private tabLineDim: TabLineDim = new TabLineDim(
    this.tab.guitar,
    15,
    3,
    20,
    20
  );
  public tabWindow: TabWindow = new TabWindow(this.tab, this.tabLineDim);

  public tabInfoForm = this.formBuilder.group({
    artist: [''],
    song: [''],
  });

  private eventsTimeEpsilon: number = 250;
  private prevTabKeyPress: { time: number; key: string } | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private tabService: TabService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {}

  createTabWindow(): void {
    this.tab = this.tabService.tab;
    this.tabLineDim = new TabLineDim(this.tab.guitar, 15, 3, 20, 20);
    this.tabWindow = new TabWindow(this.tab, this.tabLineDim);
    this.tabWindow.calc();
  }

  ngOnInit(): void {
    this.createTabWindow();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Create tab window
    this.tabWindow = new TabWindow(this.tab, this.tabLineDim);
    this.tabWindow.calc();
  }

  onNoteDurationClick(duration: number): void {
    // Check if any note is selected
    if (!this.tabWindow.selectedNoteElement) {
      return;
    }

    let chord = this.tabWindow.selectedNoteElement.chordElement.chord;
    this.tabWindow.selectedNoteElement.chordElement.barElement.changeChordDuration(
      chord,
      duration
    );
  }

  onBeatsChanged(beats: number) {
    // Check if any note is selected
    if (!this.tabWindow.selectedNoteElement) {
      return;
    }

    this.tabWindow.selectedNoteElement.chordElement.barElement.changeBarBeats(
      beats
    );
  }

  onDurationChanged(duration: number) {
    // Check if any note is selected
    if (!this.tabWindow.selectedNoteElement) {
      return;
    }

    this.tabWindow.selectedNoteElement.chordElement.barElement.changeBarDuration(
      1 / duration
    );
  }

  onTempoChanged(tempo: number) {
    // Check if any note is selected
    if (!this.tabWindow.selectedNoteElement) {
      return;
    }

    this.tabWindow.selectedNoteElement.chordElement.barElement.changeTempo(
      tempo
    );
  }

  onPrependChordClick(barElement: BarElement): void {
    barElement.prependChord();
  }

  onNoteClick(noteElement: NoteElement): void {
    this.tabWindow.selectedNoteElement = noteElement;
  }

  onAppendChordClick(barElement: BarElement): void {
    barElement.appendChord();
  }

  onTabNumberDown(key: string): void {
    // Check if any note is selected
    if (!this.tabWindow.selectedNoteElement) {
      return;
    }

    // Check if this is the first note click
    if (!this.prevTabKeyPress) {
      this.prevTabKeyPress = { time: new Date().getTime(), key: key };
      this.tabWindow.selectedNoteElement.note.fret = key;
      return;
    }

    // Calculate time difference
    let now = new Date().getTime();
    let timeDiff = now - this.prevTabKeyPress.time;
    let newFret = Number.parseInt(key);
    let combFret = Number.parseInt(this.prevTabKeyPress.key + key);
    let fret = timeDiff < this.eventsTimeEpsilon ? combFret : newFret;
    // Set fret
    this.tabWindow.selectedNoteElement.note.fret = `${fret}`;

    // Update prev tab key press object
    this.prevTabKeyPress.time = now;
    this.prevTabKeyPress.key = key;
  }

  onArrowDown(key: string) {
    // Check if a note is selected
    if (!this.tabWindow.selectedNoteElement) {
      return;
    }

    switch (key) {
      case 'ArrowDown':
        this.tabWindow.moveTabSelectedNoteDown();
        break;
      case 'ArrowUp':
        this.tabWindow.moveTabSelectedNoteUp();
        break;
      case 'ArrowLeft':
        this.tabWindow.moveTabSelectedNoteLeft();
        break;
      case 'ArrowRight':
        this.tabWindow.moveTabSelectedNoteRight();
        break;
    }
  }

  onTabBackspacePress(): void {
    if (!this.tabWindow.selectedNoteElement) {
      return;
    }

    if (!this.tabWindow.selectedNoteElement.note.fret) {
      return;
    }

    let newFret = this.tabWindow.selectedNoteElement.note.fret.slice(0, -1);
    this.tabWindow.selectedNoteElement.note.fret =
      newFret == '' ? null : newFret;
  }

  onTabCtrlDel() {
    // Delete selected note chord
  }

  onTabKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    let key = event.key;

    if (KeyChecker.isNumber(key)) {
      this.onTabNumberDown(key);
    } else if (KeyChecker.isArrow(key)) {
      this.onArrowDown(key);
    } else if (KeyChecker.isBackspace(key)) {
      this.onTabBackspacePress();
    }
  }

  onSaveChangesClick(): void {
    this.tabService.saveTab().catch((error: HttpErrorResponse) => {
      this.snackBar.open(`Error during saving tab: ${error.message}`, 'OK');
    });
  }
}
