import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { GuitarEffect, GuitarEffectType } from '@atikincode/tabui/dist/index';
import { GuitarEffectOptions } from '@atikincode/tabui/dist/models/guitar-effect/guitar-effect-options';
import { BendPitch } from '../bend-pitch/bend-pitch';
import { BendSelector } from '../bend-selector/bend-selector';


@Component({
  selector: 'app-bend-release-graph-selector',
  templateUrl: './bend-release-graph-selector.component.html',
  styleUrl: './bend-release-graph-selector.component.scss',
})
export class BendReleaseGraphSelectorComponent {
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
  public selectedBendPitch: BendPitch = {
    pitch: 1,
    duration: this.bendDurationsCount / 2 / this.bendDurationsCount,
  };
  public selectedReleasePitch: BendPitch = {
    pitch: 1,
    duration: 1,
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
  public bendSelector: BendSelector = new BendSelector(
    'bendSelector',
    this.selectorRadius,
    this.bendPitch,
    this.lineXOffset + 1,
    this.pitchSelectWidth - this.durationWidth,
    this.svgYOffset,
    this.pitchSelectHeight + this.lineHeight + this.selectorRadius / 2
  );
  public releaseSelector: BendSelector = new BendSelector(
    'releaseSelector',
    this.selectorRadius,
    this.bendPitch,
    this.bendSelector.minX + this.durationWidth,
    this.bendSelector.maxX + this.durationWidth - this.selectorRadius / 2,
    this.bendSelector.minY + this.lineHeight,
    this.bendSelector.maxY + this.lineHeight
  );
  public currentSelector: BendSelector = this.bendSelector;

  constructor() {
    this.calcPitchesX();
    this.calcPitchesY();

    this.currentSelector = this.bendSelector;
    this.snapCoordsX();
    this.snapCoordsY();

    this.currentSelector = this.releaseSelector;
    this.snapCoordsX();
    this.snapCoordsY();

    this.currentSelector = this.bendSelector;
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

  ngOnInit(): void {
    this.svg = document.getElementById('selector') as SVGSVGElement | null;
  }

  private setSelector(event: MouseEvent): void {
    const target = event.target as SVGCircleElement;
    const id = target.getAttribute('id');

    this.currentSelector =
      id === this.bendSelector.id ? this.bendSelector : this.releaseSelector;
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

    if (index === 0) {
      index = this.currentSelector === this.bendSelector ? 1 : 2;
    }

    const newSelectorX = this.lineXOffset + this.durationWidth * index;
    if (
      this.currentSelector === this.releaseSelector &&
      newSelectorX <= this.bendSelector.x
    ) {
      // Prevent release selector from moving further to the left than the bend selector
      return;
    }

    if (
      this.currentSelector === this.bendSelector &&
      newSelectorX >= this.releaseSelector.x
    ) {
      // Move release selector with bend selector if necessary
      this.releaseSelector.x =
        this.lineXOffset + this.durationWidth * (index + 1);
      this.releaseSelector.pitch.pitch = (index + 2) / this.bendDurationsCount;
    }

    this.currentSelector.pitch.duration = (index + 1) / this.bendDurationsCount;
    const prevSelectorX = this.currentSelector.x;
    this.currentSelector.x = newSelectorX;
    if (this.currentSelector.x !== prevSelectorX) {
      const effect = new GuitarEffect(
        GuitarEffectType.BendAndRelease,
        new GuitarEffectOptions(
          this.bendSelector.pitch.pitch,
          this.releaseSelector.pitch.pitch
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
      this.currentSelector.id === this.bendSelector.id
    ) {
      index = this.pitches.length - 2;
    }

    const newSelectorY = this.lineHeight * index + 1 + this.svgYOffset;
    if (
      this.currentSelector === this.releaseSelector &&
      newSelectorY <= this.bendSelector.y
    ) {
      // Prevent release selector from moving above or to bend level
      return;
    }

    if (
      this.currentSelector === this.bendSelector &&
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
        GuitarEffectType.BendAndRelease,
        new GuitarEffectOptions(
          this.bendSelector.pitch.pitch,
          this.releaseSelector.pitch.pitch
        )
      );

      this.bendChanged.emit(effect);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.currentSelector === undefined) {
      throw Error('Selected selector undefined on snap Y-coords');
    }

    if (this.currentSelector.moving) {
      if (
        this.currentSelector.x + event.movementX <=
        this.currentSelector.minX
      ) {
        this.currentSelector.x = this.currentSelector.minX;
      } else if (
        this.currentSelector.x + event.movementX >=
        this.currentSelector.maxX
      ) {
        this.currentSelector.x = this.currentSelector.maxX;
      } else {
        this.setCursorCoords(event.clientX, event.clientY, true, false);
        this.snapCoordsX();
      }

      if (
        this.currentSelector.y + event.movementY <=
        this.currentSelector.minY
      ) {
        this.currentSelector.y = this.currentSelector.minY;
      } else if (
        this.currentSelector.y + event.movementY >=
        this.currentSelector.maxY
      ) {
        this.currentSelector.y = this.currentSelector.maxY;
      } else {
        this.setCursorCoords(event.clientX, event.clientY, false, true);
        this.snapCoordsY();
      }
    }
  }

  public getBendCurve(): string {
    return (
      `M ${this.bendSelector.minX} ${this.bendSelector.maxY} ` +
      `Q ${this.bendSelector.x} ${this.bendSelector.maxY}, ` +
      `${this.bendSelector.x} ${this.bendSelector.y}`
    );
  }

  public getReleaseCurve(): string {
    return (
      `M ${this.bendSelector.x} ${this.bendSelector.y} ` +
      `Q ${this.releaseSelector.x} ${this.bendSelector.y}, ` +
      `${this.releaseSelector.x} ${this.releaseSelector.y}`
    );
  }
}
