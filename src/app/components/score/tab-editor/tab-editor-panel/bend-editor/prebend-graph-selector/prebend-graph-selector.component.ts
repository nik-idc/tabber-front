import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { GuitarEffect, GuitarEffectType } from '@atikincode/tabui/dist/index';
import { BendPitch } from '../bend-pitch/bend-pitch';
import { BendSelector } from '../bend-selector/bend-selector';
import { GuitarEffectOptions } from '@atikincode/tabui/dist/models/guitar-effect/guitar-effect-options';

@Component({
  selector: 'app-prebend-graph-selector',
  templateUrl: './prebend-graph-selector.component.html',
  styleUrl: './prebend-graph-selector.component.scss',
})
export class PrebendGraphSelectorComponent {
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
    this.pitchSelectHeight  + this.selectorRadius / 2
  );

  constructor() {
    this.calcPitchesX();
    this.calcPitchesY();

    this.snapCoordsX();
    this.snapCoordsY();
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

  onSelectorMouseDown(event: MouseEvent): void {
    this.prebendSelector.moving = true;
  }

  onSelectorMouseEnter(event: MouseEvent): void {
    if (this.prebendSelector === undefined) {
      throw Error('Selected selector undefined on selector circle mouse enter');
    }

    this.prebendSelector.radius = 10;
  }

  onSelectorMouseLeave(event: MouseEvent): void {
    if (this.prebendSelector === undefined) {
      throw Error('Selected selector undefined on selector circle mouse leave');
    }

    if (this.prebendSelector.moving) {
      return;
    }

    // this.setSelector(event);
    this.prebendSelector.radius = 7;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.prebendSelector === undefined) {
      throw Error('Selected selector undefined on mouse up');
    }

    this.prebendSelector.moving = false;
    this.prebendSelector.radius = 7;

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
      if (svgCoords.x <= this.prebendSelector.cursorMinX) {
        this.prebendSelector.cursorX = this.prebendSelector.cursorMinX;
      } else if (svgCoords.x >= this.prebendSelector.cursorMaxX) {
        this.prebendSelector.cursorX = this.prebendSelector.cursorMaxX;
      } else {
        this.prebendSelector.cursorX = svgCoords.x;
      }
    }

    if (setY) {
      if (svgCoords.y <= this.prebendSelector.cursorMinY) {
        this.prebendSelector.cursorY = this.prebendSelector.cursorMinY;
      } else if (svgCoords.y >= this.prebendSelector.cursorMaxY) {
        this.prebendSelector.cursorY = this.prebendSelector.cursorMaxY;
      } else {
        this.prebendSelector.cursorY = svgCoords.y;
      }
    }
  }

  private snapCoordsX(): void {
    if (this.prebendSelector === undefined) {
      throw Error('Selected selector undefined on snap X-coords');
    }

    let minDiff = Number.MAX_VALUE;
    let index = 0;
    for (let i = 0; i < this.pitchesX.length; i++) {
      if (Math.abs(this.pitchesX[i] - this.prebendSelector.cursorX) < minDiff) {
        minDiff = Math.abs(this.pitchesX[i] - this.prebendSelector.cursorX);
        index = i;
      }
    }

    this.prebendSelector.pitch.duration = (index + 1) / this.bendDurationsCount;
    const newSelectorX = this.lineXOffset + this.durationWidth * index;
    const prevSelectorX = this.prebendSelector.x;
    this.prebendSelector.x = newSelectorX;
    if (this.prebendSelector.x !== prevSelectorX) {
      const effect = new GuitarEffect(
        GuitarEffectType.Prebend,
        new GuitarEffectOptions(
          undefined,
          undefined,
          this.prebendSelector.pitch.pitch
        )
      );

      this.bendChanged.emit(effect);
    }
  }

  private snapCoordsY(): void {
    if (this.prebendSelector === undefined) {
      throw Error('Selected selector undefined on snap Y-coords');
    }

    let minDiff = Number.MAX_VALUE;
    let index = 0;
    for (let i = 0; i < this.pitchesY.length; i++) {
      if (Math.abs(this.pitchesY[i] - this.prebendSelector.cursorY) < minDiff) {
        minDiff = Math.abs(this.pitchesY[i] - this.prebendSelector.cursorY);
        index = i;
      }
    }

    if (index === this.pitches.length - 1) {
      index = this.pitches.length - 2;
    }

    const newSelectorY = this.lineHeight * index + 1 + this.svgYOffset;

    this.prebendSelector.pitch.pitch =
      this.pitches[this.pitches.length - index - 1];
    const prevSelectorY = this.prebendSelector.y;
    this.prebendSelector.y = newSelectorY;
    if (this.prebendSelector.y !== prevSelectorY) {
      const effect = new GuitarEffect(
        GuitarEffectType.Prebend,
        new GuitarEffectOptions(
          undefined,
          undefined,
          this.prebendSelector.pitch.pitch
        )
      );

      this.bendChanged.emit(effect);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.prebendSelector === undefined) {
      throw Error('Selected selector undefined on snap Y-coords');
    }

    if (this.prebendSelector.moving) {
      if (
        this.prebendSelector.y + event.movementY <=
        this.prebendSelector.minY
      ) {
        this.prebendSelector.y = this.prebendSelector.minY;
      } else if (
        this.prebendSelector.y + event.movementY >=
        this.prebendSelector.maxY
      ) {
        this.prebendSelector.y = this.prebendSelector.maxY;
      } else {
        this.setCursorCoords(event.clientX, event.clientY, false, true);
        this.snapCoordsY();
      }
    }
  }
}
