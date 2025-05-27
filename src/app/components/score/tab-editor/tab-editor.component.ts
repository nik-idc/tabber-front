import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Sanitizer,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  BeatElement,
  NoteDuration,
  Point,
  Rect,
  Score,
  SelectedElement,
  TabPlayerSVGAnimator,
  TabWindowDim,
  DURATION_TO_NAME,
} from '@atikincode/tabui/dist/index';
import { TabWindow } from '@atikincode/tabui/dist/index';
import { Tab } from '@atikincode/tabui/dist/index';
import { BarElement } from '@atikincode/tabui/dist/index';
import { NoteElement } from '@atikincode/tabui/dist/index';

import { KeyChecker } from 'src/app/_shared/key-checker/key-checker';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { ScoreService } from 'src/app/_services/score.service';
import { CurrentUserService } from 'src/app/_services/current-user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { SelectionElement } from '@atikincode/tabui/dist/tab-window/elements/selection-element';
import { TabLineElement } from '@atikincode/tabui/dist/tab-window/elements/tab-line-element';
import { BeatNotesElement } from '@atikincode/tabui/dist/tab-window/elements/beat-notes-element';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GuitarEffectType } from '@atikincode/tabui/dist/models/guitar-effect/guitar-effect-type';
import { GuitarEffectOptions } from '@atikincode/tabui/dist/models/guitar-effect/guitar-effect-options';
import { SelectedMoveDirection } from '@atikincode/tabui/dist/tab-window/elements/selected-element';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-tab-editor',
  templateUrl: './tab-editor.component.html',
  styleUrls: ['./tab-editor.component.scss'],
})
export class TabEditorComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('tabSVG') tabSVG!: ElementRef<SVGElement>;
  private isSVGFocused: boolean = false;

  @Input() tabIndex: number = 0;
  public tab = new Tab();
  public newTab: boolean = true;

  private width = 3 * ((window.innerWidth - 50) / 4);
  // private width = 1200;
  private noteTextSize = 12;
  private timeSigTextSize = 45;
  private tempoTextSize = 30;
  private durationsHeight = 50;

  public tabDim: TabWindowDim;
  public tabWindow: TabWindow;
  public playerAnimator: TabPlayerSVGAnimator | undefined;
  private restartAnimator: boolean = false;

  private eventsTimeEpsilon: number = 250;
  private prevTabKeyPress: { time: number; key: string } | null = null;

  // Selection variables
  private selectingBeats: boolean = false;
  private selectionStartPoint: Point | undefined;

  // private copyingStarted: boolean = false;
  public isPlaying: boolean = false;

  // Offsets
  public tleOffset: Point = new Point();
  public barOffset: Point = new Point();
  public beatOffset: Point = new Point();
  public beatNotesOffset: Point = new Point();

  constructor(
    private userService: UserService,
    private currentUserService: CurrentUserService,
    private scoreService: ScoreService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.tab = this.scoreService.score.tracks[this.tabIndex];

    this.tabDim = new TabWindowDim(
      this.width,
      this.noteTextSize,
      this.timeSigTextSize,
      this.tempoTextSize,
      this.durationsHeight,
      this.tab.guitar.stringsCount
    );

    this.tabWindow = new TabWindow(
      this.scoreService.score,
      this.tab,
      this.tabDim
    );
  }

  ngAfterViewInit(): void {
    this.tabSVG.nativeElement.addEventListener('focus', () => {
      this.isSVGFocused = true;
    });

    this.tabSVG.nativeElement.addEventListener('blur', () => {
      this.isSVGFocused = false;
    });
  }

  createTabWindow(): void {
    this.tabWindow = new TabWindow(
      this.scoreService.score,
      this.tab,
      this.tabDim
    );
    this.tabWindow.selectNoteElementUsingIds(0, 0, 0, 0);

    console.log(this.tabWindow);
  }

  ngOnInit(): void {
    // this.tab = this.scoreService.score.tracks[this.tabIndex];
    this.createTabWindow();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(`On changes, index = ${this.tabIndex}`);

    this.tab = this.scoreService.score.tracks[this.tabIndex];

    this.tabDim = new TabWindowDim(
      this.width,
      this.noteTextSize,
      this.timeSigTextSize,
      this.tempoTextSize,
      this.durationsHeight,
      this.tab.guitar.stringsCount
    );

    // Create tab window
    this.tabWindow = new TabWindow(
      this.scoreService.score,
      this.tab,
      this.tabDim
    );
    this.tabWindow.calcTabElement();

    this.restartAnimator = true;
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

  onNoteClick(
    tabLineElementId: number,
    barElementId: number,
    beatElementId: number,
    noteElementId: number
  ): void {
    this.tabWindow.selectNoteElementUsingIds(
      tabLineElementId,
      barElementId,
      beatElementId,
      noteElementId
    );

    // console.log(this.tabWindow.selectionManager.selectionElements);
  }

  onBeatMouseDown(
    tabLineElementId: number,
    barElementId: number,
    beatElementId: number
  ): void {
    this.tabWindow.clearSelection();
    this.tabWindow.recalcBeatElementSelection();
    this.selectingBeats = true;
    // this.tabWindow.selectBeat(barElementsLineId, barElementId, beatElementId);
    console.log('onBeatMouseDown');
  }

  onBeatMouseEnter(
    tabLineElementId: number,
    barElementId: number,
    beatElementId: number
  ): void {
    if (this.selectingBeats) {
      this.tabWindow.selectBeatUsingIds(
        tabLineElementId,
        barElementId,
        beatElementId
      );
    }
  }

  onBeatMouseLeave(
    tabLineElementId: number,
    barElementId: number,
    beatElementId: number
  ): void {
    if (this.selectingBeats) {
      // console.log(
      //   `L: ${barElementsLineId}, ${barElementId}, ${beatElementId}`
      // );
    }
  }

  onBeatMouseMove(
    event: MouseEvent,
    tabLineElementId: number,
    barElementId: number,
    beatElementId: number
  ): void {
    if (this.selectingBeats) {
      if (this.tabWindow.getSelectionBeats().length === 0) {
        if (this.selectionStartPoint === undefined) {
          this.selectionStartPoint = new Point(event.pageX, event.pageY);
        } else {
          const dx = event.pageX - this.selectionStartPoint.x;
          const dy = event.pageY - this.selectionStartPoint.y;
          const distMoved = Math.sqrt(dx * dx + dy * dy);

          const lines = this.tabWindow.getTabLineElements();
          const beatElement =
            lines[tabLineElementId].barElements[barElementId].beatElements[
              beatElementId
            ];
          const rect = beatElement.rect;

          if (distMoved >= rect.width / 4) {
            this.tabWindow.selectBeatUsingIds(
              tabLineElementId,
              barElementId,
              beatElementId
            );
          }
        }
      }
    }
  }

  onBeatMouseUp(): void {
    this.selectingBeats = false;
    this.selectionStartPoint = undefined;
  }

  @HostListener('document:keydown.control.c', ['$event'])
  ctrlCEvent(event: KeyboardEvent) {
    // this.copyingStarted = true;
    this.tabWindow.copy();
  }

  @HostListener('document:keydown.control.v', ['$event'])
  ctrlVEvent(event: KeyboardEvent) {
    // console.log(JSON.parse(JSON.stringify(this.tabWindow)));
    this.tabWindow.paste();
    // console.log(JSON.parse(JSON.stringify(this.tabWindow)));
    // this.copyingStarted = false;
  }

  @HostListener('document:keydown.control.z', ['$event'])
  ctrlZEvent(event: KeyboardEvent) {
    this.tabWindow.undo();
  }

  @HostListener('document:keydown.control.y', ['$event'])
  ctrlYEvent(event: KeyboardEvent) {
    this.tabWindow.redo();
  }

  @HostListener('document:keydown.delete', ['$event'])
  deleteEvent(event: KeyboardEvent) {
    this.tabWindow.deleteSelectedBeats();
  }

  private applyOrRemoveEffect(
    effectType: GuitarEffectType,
    options?: GuitarEffectOptions
  ): void {
    const selected = this.tabWindow.getSelectedElement();

    if (selected !== undefined) {
      const effectIndex = selected.note.effects.findIndex((e) => {
        return e.effectType === effectType;
      });

      if (effectIndex === -1) {
        console.log('APPLYING EFFECT');
        const result = this.tabWindow.applyEffectSingle(effectType, options);
        console.log(`APPLY RESULT: ${result}`);
      } else {
        this.tabWindow.removeEffectSingle(effectType, options);
      }
    }
  }

  @HostListener('document:keydown.shift.v', ['$event'])
  shiftVEvent(event: KeyboardEvent) {
    this.applyOrRemoveEffect(GuitarEffectType.Vibrato);
  }

  @HostListener('document:keydown.shift.p', ['$event'])
  shiftPEvent(event: KeyboardEvent) {
    this.applyOrRemoveEffect(GuitarEffectType.PalmMute);
  }

  @HostListener('document:keydown.shift.b', ['$event'])
  shiftBEvent(event: KeyboardEvent) {
    this.applyOrRemoveEffect(GuitarEffectType.Bend, new GuitarEffectOptions(1));
  }

  @HostListener('document:keydown.space', ['$event'])
  spaceEvent(event: KeyboardEvent) {
    if (!this.isSVGFocused) {
      return;
    }

    this.onPlayClicked();
  }

  onTabNumberDown(key: string): void {
    // Check if any note is selected
    if (!this.tabWindow.getSelectedElement()) {
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
      this.tabWindow.setSelectedElementFret(newFret);
      return;
    }

    // Calculate time difference
    let now = new Date().getTime();
    let timeDiff = now - this.prevTabKeyPress.time;
    let combFret = Number.parseInt(this.prevTabKeyPress.key + key);
    newFret = timeDiff < this.eventsTimeEpsilon ? combFret : newFret;
    // Set fret
    this.tabWindow.setSelectedElementFret(newFret);

    // Update prev tab key press object
    this.prevTabKeyPress.time = now;
    this.prevTabKeyPress.key = key;
  }

  onArrowDown(key: string) {
    // Check if a note is selected
    if (!this.tabWindow.getSelectedElement()) {
      return;
    }

    switch (key) {
      case 'ArrowDown':
        this.tabWindow.moveSelectedNote(SelectedMoveDirection.Down);
        break;
      case 'ArrowUp':
        this.tabWindow.moveSelectedNote(SelectedMoveDirection.Up);
        break;
      case 'ArrowLeft':
        this.tabWindow.moveSelectedNote(SelectedMoveDirection.Left);
        break;
      case 'ArrowRight':
        this.tabWindow.moveSelectedNote(SelectedMoveDirection.Right);
        break;
    }
  }

  onTabBackspacePress(): void {
    const selected = this.tabWindow.getSelectedElement();

    if (!selected) {
      return;
    }

    if (!selected.note.fret) {
      return;
    }

    this.tabWindow.setSelectedElementFret(undefined);
  }

  onTabCtrlDel() {
    // Delete selected note beat
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

  public getTabWindowHeight(): number {
    const lines = this.tabWindow.getTabLineElements();

    let height = 0;
    for (const tabLineElement of lines) {
      height += tabLineElement.rect.height;
    }

    return height;
  }

  public setTabLineElementOffset(tabLineElement: TabLineElement): void {
    this.tleOffset = new Point(0, tabLineElement.rect.y);
  }

  public setBarElementOffset(barElement: BarElement): void {
    this.barOffset = new Point(barElement.rect.x, this.tleOffset.y);
  }

  public setBeatElementOffset(beatElement: BeatElement): void {
    this.beatOffset = new Point(
      this.barOffset.x + beatElement.rect.x,
      this.barOffset.y + beatElement.rect.y
    );
  }

  public setBeatNotesOffset(beatNotesElement: BeatNotesElement): void {
    this.beatNotesOffset = new Point(
      this.beatOffset.x + beatNotesElement.rect.x,
      this.beatOffset.y + beatNotesElement.rect.y
    );
  }

  public sanitizeSVG(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  public getPlayerCursorRect(): Rect {
    if (!this.isPlaying) {
      return new Rect();
    }

    const currentBeatElement = this.tabWindow.getPlayerCurrentBeatElement();
    if (currentBeatElement === undefined) {
      return new Rect();
    }

    const beatElementCoords =
      this.tabWindow.getBeatElementGlobalCoords(currentBeatElement);

    const playerCursorWidth = 5;
    const playerCursorAddHeight = 10;

    return new Rect(
      beatElementCoords.x + currentBeatElement.rect.width / 2,
      beatElementCoords.y - playerCursorAddHeight,
      playerCursorWidth,
      currentBeatElement.rect.height + playerCursorAddHeight
    );
  }

  private renderCursor(playerCursor: SVGRectElement): void {
    const cursorRect = this.getPlayerCursorRect();
    playerCursor.setAttribute('x', `${cursorRect.x}`);
    playerCursor.setAttribute('y', `${cursorRect.y}`);
    playerCursor.setAttribute('width', `${cursorRect.width}`);
    playerCursor.setAttribute('height', `${cursorRect.height}`);
  }

  private setupPlayerAnimator(playerCursor: SVGRectElement): void {
    if (!this.isPlaying) {
      return;
    }

    this.renderCursor(playerCursor);

    this.playerAnimator = new TabPlayerSVGAnimator(
      playerCursor,
      this.tabWindow
    );
    this.playerAnimator.bindToBeatChanged();
  }

  public onPlayClicked(): void {
    const playerCursor = document.getElementById(
      'playerCursor'
    ) as SVGRectElement | null;
    if (playerCursor === null) {
      throw Error('Playing but no cursor SVG rect');
    }

    if (this.isPlaying) {
      this.isPlaying = false;

      this.renderCursor(playerCursor);
      this.tabWindow.stopPlayer();
    } else {
      this.isPlaying = true;

      if (this.playerAnimator === undefined || this.restartAnimator) {
        this.setupPlayerAnimator(playerCursor);
        if (this.restartAnimator) {
          this.restartAnimator = false;
        }
      }

      this.renderCursor(playerCursor);
      this.tabWindow.startPlayer();
    }
  }

  public get DURATION_TO_NAME(): { [duration: number]: string } {
    return DURATION_TO_NAME;
  }
}
