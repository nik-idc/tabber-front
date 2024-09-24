import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Point, TabWindowDim } from '@atikincode/tabui/dist/index';
import { TabWindow } from '@atikincode/tabui/dist/index';
import { Tab } from '@atikincode/tabui/dist/index';
import { BarElement } from '@atikincode/tabui/dist/index';
import { NoteElement } from '@atikincode/tabui/dist/index';
import { KeyChecker } from 'src/app/_shared/key-checker/key-checker';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { TabService } from 'src/app/_services/tab.service';
import { CurrentUserService } from 'src/app/_services/current-user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { SelectionElement } from '@atikincode/tabui/dist/tab-window/elements/selection-element';

@Component({
  selector: 'app-tab-editor',
  templateUrl: './tab-editor.component.html',
  styleUrls: ['./tab-editor.component.scss'],
})
export class TabEditorComponent implements OnInit, OnChanges {
  @Input() tab: Tab = new Tab();
  public newTab: boolean = true;

  private tabLineDim: TabWindowDim = new TabWindowDim(
    1200,
    15,
    45,
    30,
    50,
    this.tab.guitar.stringsCount
  );

  public tabWindow: TabWindow = new TabWindow(this.tab, this.tabLineDim);

  private eventsTimeEpsilon: number = 250;
  private prevTabKeyPress: { time: number; key: string } | null = null;

  // Selection variables
  private selectingChords: boolean = false;
  private selectionStartDelayPx = 75;
  private selectionStartPoint: Point | undefined;

  constructor(
    private userService: UserService,
    private currentUserService: CurrentUserService,
    private tabService: TabService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {}

  createTabWindow(): void {
    this.tab = this.tabService.tab;
    this.tabWindow = new TabWindow(this.tab, this.tabLineDim);
    this.tabWindow.calc();
    console.log(this.tabWindow);
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
    if (!this.tabWindow.selectedElement) {
      return;
    }

    this.tabWindow.changeSelectedChordDuration(duration);
  }

  onBeatsChanged(beats: number) {
    // Check if any note is selected
    if (!this.tabWindow.selectedElement) {
      return;
    }

    this.tabWindow.changeSelectedBarBeats(beats);
  }

  onDurationChanged(duration: number) {
    // Check if any note is selected
    if (!this.tabWindow.selectedElement) {
      return;
    }

    this.tabWindow.changeSelectedBarDuration(duration);
  }

  onTempoChanged(tempo: number) {
    // Check if any note is selected
    if (!this.tabWindow.selectedElement) {
      return;
    }

    this.tabWindow.changeSelectedBarTempo(tempo);
  }

  onNoteClick(
    barElementLineId: number,
    barElementId: number,
    chordElementId: number,
    noteElementId: number
  ): void {
    this.tabWindow.selectNoteElement(
      barElementLineId,
      barElementId,
      chordElementId,
      noteElementId
    );

    console.log(this.tabWindow.selectionElements);
  }

  onChordMouseDown(
    barElementLineId: number,
    barElementId: number,
    chordElementId: number
  ): void {
    this.tabWindow.clearSelection();
    this.selectingChords = true;
    // this.tabWindow.selectChord(barElementsLineId, barElementId, chordElementId);
    // console.log('onChordMouseDown');
  }

  onChordMouseEnter(
    barElementLineId: number,
    barElementId: number,
    chordElementId: number
  ): void {
    if (this.selectingChords) {
      this.tabWindow.selectChord(
        barElementLineId,
        barElementId,
        chordElementId
      );
    }
  }

  onChordMouseLeave(
    barElementLineId: number,
    barElementId: number,
    chordElementId: number
  ): void {
    if (this.selectingChords) {
      // console.log(
      //   `L: ${barElementsLineId}, ${barElementId}, ${chordElementId}`
      // );
    }
  }

  onChordMouseMove(
    event: MouseEvent,
    barElementLineId: number,
    barElementId: number,
    chordElementId: number
  ): void {
    if (this.selectingChords) {
      if (this.tabWindow.selectionElements.length === 0) {
        const rectScale = 1;
        if (this.selectionStartPoint === undefined) {
          this.selectionStartPoint = new Point(event.pageX, event.pageY);
        } else {
          const dx = event.pageX - this.selectionStartPoint.x;
          const dy = event.pageY - this.selectionStartPoint.y;
          const distMoved = Math.sqrt(dx * dx + dy * dy);

          if (distMoved >= this.selectionStartDelayPx) {
            this.tabWindow.selectChord(
              barElementLineId,
              barElementId,
              chordElementId
            );
          }
        }
      }
    }
  }

  onChordMouseUp(): void {
    this.selectingChords = false;
    // console.log('onChordMouseUp');
  }

  onTabNumberDown(key: string): void {
    // Check if any note is selected
    if (!this.tabWindow.selectedElement) {
      return;
    }

    // Check if a valid key has been pressed
    let newFret = Number.parseInt(key);
    if (Number.isNaN(newFret)) {
      return;
    }

    // Check if this is the first note click
    if (!this.prevTabKeyPress) {
      this.prevTabKeyPress = { time: new Date().getTime(), key: key };
      this.tabWindow.changeSelectedNoteValue(newFret);
      return;
    }

    // Calculate time difference
    let now = new Date().getTime();
    let timeDiff = now - this.prevTabKeyPress.time;
    let combFret = Number.parseInt(this.prevTabKeyPress.key + key);
    newFret = timeDiff < this.eventsTimeEpsilon ? combFret : newFret;
    // Set fret
    this.tabWindow.changeSelectedNoteValue(newFret);

    // Update prev tab key press object
    this.prevTabKeyPress.time = now;
    this.prevTabKeyPress.key = key;
  }

  onArrowDown(key: string) {
    // Check if a note is selected
    if (!this.tabWindow.selectedElement) {
      return;
    }

    switch (key) {
      case 'ArrowDown':
        this.tabWindow.moveSelectedNoteDown();
        break;
      case 'ArrowUp':
        this.tabWindow.moveSelectedNoteUp();
        break;
      case 'ArrowLeft':
        this.tabWindow.moveSelectedNoteLeft();
        break;
      case 'ArrowRight':
        this.tabWindow.moveSelectedNoteRight();
        break;
    }
  }

  onTabBackspacePress(): void {
    if (!this.tabWindow.selectedElement) {
      return;
    }

    if (!this.tabWindow.selectedElement.noteElement.note.fret) {
      return;
    }

    this.tabWindow.selectedElement.noteElement.note.fret = undefined;
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

  editSquare(noteElement: NoteElement): string {
    return noteElement.note.fret ? '|' + noteElement.note.fret + '|' : '|-|';
  }
}
