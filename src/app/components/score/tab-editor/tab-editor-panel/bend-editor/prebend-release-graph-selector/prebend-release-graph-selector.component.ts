import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { BendPitch } from '../bend-pitch/bend-pitch';
import { GuitarEffect, GuitarEffectType } from '@atikincode/tabui/dist/index';
import { BendSelector } from '../bend-selector/bend-selector';
import { GuitarEffectOptions } from '@atikincode/tabui/dist/models/guitar-effect/guitar-effect-options';

@Component({
  selector: 'app-prebend-release-graph-selector',
  templateUrl: './prebend-release-graph-selector.component.html',
  styleUrl: './prebend-release-graph-selector.component.scss',
})
export class PrebendReleaseGraphSelectorComponent {
  public pitchesText: string[] = [
    '3',
    '2 ¾',
    '2 ½',
    '2 ¼',
    '2',
    '1 ¾',
    '1 ½',
    '1 ¼',
    'Full',
    '¾',
    '½',
    '¼',
    '0',
  ];
  public pitches: number[] = [
    0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3,
  ];
  public bendDurationsCount: number = 12;
  public selectedPrebendPitch: BendPitch = {
    pitch: 1,
    duration: (this.bendDurationsCount - 1) / this.bendDurationsCount,
  };
  @Output() bendChanged = new EventEmitter<GuitarEffect>();

  public svgYOffset: number = 25;
  public pitchSelectWidth: number = (2 * 500) / 3;
  public pitchSelectHeight: number = 250;
  public lineXOffset: number = 50;
  public lineHeight: number =
    this.pitchSelectHeight / (this.pitches.length - 1);
  public pitchesY: number[] = Array(this.pitches.length).fill(0);
  public pitchesX: number[] = Array(this.bendDurationsCount).fill(0);
  //  Pixel width of a single duration of the bend
  //  NOTE: This is not the same as NoteDuration. This shows how
  //  much of the selected note's duration will be the bend
  public durationWidth: number =
    this.pitchSelectWidth / this.bendDurationsCount;
  public svg: SVGSVGElement | null = null;
  public selectorRadius: number = 7;

  private bendPitch = {
    pitch: 1,
    duration: this.bendDurationsCount / 2 / this.bendDurationsCount,
  };
  public prebendSelector: BendSelector = new BendSelector(
    'prebendSelector',
    this.selectorRadius,
    this.bendPitch,
    this.lineXOffset,
    this.lineXOffset,
    this.svgYOffset,
    this.pitchSelectHeight + this.selectorRadius / 2
  );
  public releaseSelector: BendSelector = new BendSelector(
    'releaseSelector',
    this.selectorRadius,
    this.bendPitch,
    this.prebendSelector.minX + this.durationWidth,
    this.pitchSelectWidth - this.selectorRadius / 2,
    this.prebendSelector.minY + this.lineHeight,
    this.prebendSelector.maxY + this.lineHeight
  );
  public currentSelector: BendSelector = this.prebendSelector;

  constructor() {
    this.calcPitchesX();
    this.calcPitchesY();

    this.currentSelector = this.prebendSelector;
    this.snapCoordsX();
    this.snapCoordsY();

    this.currentSelector = this.releaseSelector;
    this.snapCoordsX();
    this.snapCoordsY();

    this.currentSelector = this.prebendSelector;
  }

  calcPitchesX(): void {
    for (let i = 0; i < this.pitchesX.length; i++) {
      this.pitchesX[i] = this.lineXOffset + this.durationWidth * i;
    }
  }

  calcPitchesY(): void {
    for (let i = 0; i < this.pitches.length; i++) {
      this.pitchesY[i] = this.lineHeight * i + 1 + this.svgYOffset;
    }
  }

  private setSelector(event: MouseEvent): void {
    const target = event.target as SVGCircleElement;
    const id = target.getAttribute('id');

    this.currentSelector =
      id === this.prebendSelector.id
        ? this.prebendSelector
        : this.releaseSelector;
  }

  onSelectorMouseDown(event: MouseEvent): void {
    this.setSelector(event);
    this.currentSelector.moving = true;
  }

  onSelectorMouseEnter(event: MouseEvent): void {
    if (this.currentSelector === undefined) {
      throw Error('Selected selector undefined on selector circle mouse enter');
    }

    this.setSelector(event);
    this.currentSelector.radius = 10;
  }

  onSelectorMouseLeave(event: MouseEvent): void {
    if (this.currentSelector === undefined) {
      throw Error('Selected selector undefined on selector circle mouse leave');
    }

    if (this.currentSelector.moving) {
      return;
    }

    // this.setSelector(event);
    this.currentSelector.radius = 7;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.currentSelector === undefined) {
      throw Error('Selected selector undefined on mouse up');
    }

    this.currentSelector.moving = false;
    this.currentSelector.radius = 7;

    // // console.log(event, 'onMouseUp');
    // console.log(this.selectedPitch, 'onMouseUp this.selectedPitch');
  }

  private setCursorCoords(
    clientX: number,
    clientY: number,
    setX: boolean,
    setY: boolean
  ): void {
    this.svg = document.getElementById('selector') as SVGSVGElement | null;
    if (this.svg === null) {
      throw Error('SVG is null');
    }

    const point = this.svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;

    const ctm = this.svg.getScreenCTM();
    if (ctm === null) {
      throw Error('Error transforming screen coords into svg coords');
    }

    const inverseCTM = ctm.inverse();
    const svgCoords = point.matrixTransform(inverseCTM);

    if (setX) {
      if (svgCoords.x <= this.currentSelector.cursorMinX) {
        this.currentSelector.cursorX = this.currentSelector.cursorMinX;
      } else if (svgCoords.x >= this.currentSelector.cursorMaxX) {
        this.currentSelector.cursorX = this.currentSelector.cursorMaxX;
      } else {
        this.currentSelector.cursorX = svgCoords.x;
      }
    }

    if (setY) {
      if (svgCoords.y <= this.currentSelector.cursorMinY) {
        this.currentSelector.cursorY = this.currentSelector.cursorMinY;
      } else if (svgCoords.y >= this.currentSelector.cursorMaxY) {
        this.currentSelector.cursorY = this.currentSelector.cursorMaxY;
      } else {
        this.currentSelector.cursorY = svgCoords.y;
      }
    }
  }

  private snapCoordsX(): void {
    if (this.currentSelector === undefined) {
      throw Error('Selected selector undefined on snap X-coords');
    }

    let minDiff = Number.MAX_VALUE;
    let index = 0;
    for (let i = 0; i < this.pitchesX.length; i++) {
      if (Math.abs(this.pitchesX[i] - this.currentSelector.cursorX) < minDiff) {
        minDiff = Math.abs(this.pitchesX[i] - this.currentSelector.cursorX);
        index = i;
      }
    }

    this.currentSelector.pitch.duration = (index + 1) / this.bendDurationsCount;
    const newSelectorX = this.lineXOffset + this.durationWidth * index;
    const prevSelectorX = this.currentSelector.x;
    this.currentSelector.x = newSelectorX;
    if (this.currentSelector.x !== prevSelectorX) {
      const effect = new GuitarEffect(
        GuitarEffectType.PrebendAndRelease,
        new GuitarEffectOptions(
          undefined,
          this.releaseSelector.pitch.pitch,
          this.prebendSelector.pitch.pitch
        )
      );

      this.bendChanged.emit(effect);
    }
  }

  private snapCoordsY(): void {
    if (this.currentSelector === undefined) {
      throw Error('Selected selector undefined on snap Y-coords');
    }

    let minDiff = Number.MAX_VALUE;
    let index = 0;
    for (let i = 0; i < this.pitchesY.length; i++) {
      if (Math.abs(this.pitchesY[i] - this.currentSelector.cursorY) < minDiff) {
        minDiff = Math.abs(this.pitchesY[i] - this.currentSelector.cursorY);
        index = i;
      }
    }

    if (
      index === this.pitches.length - 1 &&
      this.currentSelector.id === this.prebendSelector.id
    ) {
      index = this.pitches.length - 2;
    }

    const newSelectorY = this.lineHeight * index + 1 + this.svgYOffset;

    if (
      this.currentSelector === this.releaseSelector &&
      newSelectorY <= this.prebendSelector.y
    ) {
      // Prevent release selector from moving above or to bend level
      return;
    }

    if (
      this.currentSelector === this.prebendSelector &&
      newSelectorY >= this.releaseSelector.y
    ) {
      // Move release selector with bend selector if necessary
      this.releaseSelector.y =
        this.lineHeight * (index + 1) + 1 + this.svgYOffset;
      this.releaseSelector.pitch.pitch =
        this.pitches[this.pitches.length - index - 2];
    }

    this.currentSelector.pitch.pitch =
      this.pitches[this.pitches.length - index - 1];
    const prevSelectorY = this.currentSelector.y;
    this.currentSelector.y = newSelectorY;
    if (this.currentSelector.y !== prevSelectorY) {
      const effect = new GuitarEffect(
        GuitarEffectType.PrebendAndRelease,
        new GuitarEffectOptions(
          undefined,
          this.releaseSelector.pitch.pitch,
          this.prebendSelector.pitch.pitch
        )
      );

      this.bendChanged.emit(effect);
    }
  }

  private processXMove(event: MouseEvent): void {
    if (this.currentSelector === this.prebendSelector) {
      return;
    }

    if (this.currentSelector.x + event.movementX <= this.currentSelector.minX) {
      this.currentSelector.x = this.currentSelector.minX;
    } else if (
      this.currentSelector.x + event.movementX >=
      this.currentSelector.maxX
    ) {
      this.currentSelector.x = this.currentSelector.maxX;
    } else {
      this.setCursorCoords(event.clientX, event.clientY, true, false);
    }
    this.snapCoordsX();
  }

  private processYMove(event: MouseEvent): void {
    if (this.currentSelector.y + event.movementY <= this.currentSelector.minY) {
      this.currentSelector.y = this.currentSelector.minY;
    } else if (
      this.currentSelector.y + event.movementY >=
      this.currentSelector.maxY
    ) {
      this.currentSelector.y = this.currentSelector.maxY;
    } else {
      this.setCursorCoords(event.clientX, event.clientY, false, true);
    }
    this.snapCoordsY();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.currentSelector === undefined) {
      throw Error('Selected selector undefined on snap Y-coords');
    }

    if (this.currentSelector.moving) {
      this.processXMove(event);
      this.processYMove(event);
    }
  }

  public getBendCurve(): string {
    return (
      `M ${this.prebendSelector.x} ${this.prebendSelector.y} ` +
      `Q ${this.releaseSelector.x} ${this.prebendSelector.y}, ` +
      `${this.releaseSelector.x} ${this.releaseSelector.y}`
    );
  }
}
