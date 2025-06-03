import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GuitarEffect, GuitarEffectType } from '@atikincode/tabui/dist/index';
import { GuitarEffectOptions } from '@atikincode/tabui/dist/models/guitar-effect/guitar-effect-options';
import { BendPitch } from '../bend-pitch/bend-pitch';

@Component({
  selector: 'app-bend-graph-selector',
  templateUrl: './bend-graph-selector.component.html',
  styleUrl: './bend-graph-selector.component.scss',
})
export class BendGraphSelectorComponent implements OnChanges {
  @Input() onOpenEffect: GuitarEffect | undefined;

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
  public selectedPitch: BendPitch = {
    pitch: 1,
    duration: 5 / 10,
  };
  @Output() bendChanged = new EventEmitter<GuitarEffect>();

  public svgYOffset: number = 25;
  public pitchSelectWidth: number = (2 * 500) / 3;
  public pitchSelectHeight: number = 250;
  public lineXOffset: number = 50;
  public lineHeight: number =
    this.pitchSelectHeight / (this.pitches.length - 1);
  public bendDurationsCount: number = 12;
  public pitchesY: number[] = Array(this.pitches.length).fill(0);
  public pitchesX: number[] = Array(this.bendDurationsCount).fill(0);
  //  Pixel width of a single duration of the bend
  //  NOTE: This is not the same as NoteDuration. This shows how
  //  much of the selected note's duration will be the bend
  public durationWidth: number =
    this.pitchSelectWidth / this.bendDurationsCount;
  public svg: SVGSVGElement | null = null;
  public selectorRadius: number = 7;
  public selectorMinX: number = this.lineXOffset + 1;
  public selectorMaxY: number =
    this.pitchSelectHeight + this.lineHeight + this.selectorRadius / 2;
  public selectorMaxX: number = this.pitchSelectWidth;
  public selectorMinY: number = this.svgYOffset;
  public selectorX: number = this.selectorMinX;
  public selectorY: number = this.selectorMaxY;
  public cursorX: number = this.selectorMinX;
  public cursorY: number = this.selectorMaxY;
  public selectorYDiff: number = 0;
  public selectorMoving: boolean = false;

  constructor() {
    if (this.onOpenEffect !== undefined) {
      if (this.onOpenEffect.effectType !== GuitarEffectType.Bend) {
        throw Error('Wrong effect passed to bend graph selector');
      }

      this.selectedPitch = {
        pitch: this.onOpenEffect.options!.bendPitch!,
        duration: 0.5,
      };
    }

    this.calcPitchesX();
    this.calcPitchesY();

    this.buildCoordsFromPitch();

    this.snapCoordsX();
    this.snapCoordsY();
  }

  private onOpenEffectChanged(): void {
    if (this.onOpenEffect !== undefined) {
      if (this.onOpenEffect.effectType !== GuitarEffectType.Bend) {
        throw Error('Wrong effect passed to bend graph selector');
      }

      this.selectedPitch = {
        pitch: this.onOpenEffect.options!.bendPitch!,
        duration: 0.5,
      };
    }

    this.buildCoordsFromPitch();

    this.snapCoordsX();
    this.snapCoordsY();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    // this.onOpenEffectChanged();

    if (changes['onOpenEffect'].previousValue === undefined) {
      console.log('ngOnChanges onOpenEffect is no longer undefined', changes);
      console.log(
        'This should be undefined',
        changes['onOpenEffect'].previousValue
      );
      this.onOpenEffectChanged();
    }

    // console.log('WOW CHANGES!!', changes);
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

  buildCoordsFromPitch(): void {
    const duration = this.selectedPitch.duration;
    this.cursorX =
      this.lineXOffset +
      this.pitchSelectWidth * duration -
      this.durationWidth;

    const pitchIndex = this.pitches.indexOf(this.selectedPitch.pitch);
    const graphCorrectIndex = this.pitches.length - 1 - pitchIndex;
    this.cursorY = this.svgYOffset + this.lineHeight * graphCorrectIndex;
  }

  ngOnInit(): void {
    this.svg = document.getElementById('selector') as SVGSVGElement | null;
  }

  onSelectorMouseDown(event: MouseEvent): void {
    this.selectorMoving = true;
  }

  onSelectorMouseEnter(event: MouseEvent): void {
    this.selectorRadius = 10;
  }

  onSelectorMouseLeave(event: MouseEvent): void {
    if (this.selectorMoving) {
      return;
    }

    this.selectorRadius = 7;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.selectorMoving = false;
    this.selectorRadius = 7;

    this.selectorYDiff = 0;

    // console.log(event, 'onMouseUp');
    console.log(this.selectedPitch, 'onMouseUp this.selectedPitch');
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
      if (svgCoords.x <= this.selectorMinX) {
        this.cursorX = this.selectorMinX;
      } else if (svgCoords.x >= this.selectorMaxX) {
        this.cursorX = this.selectorMaxX;
      } else {
        this.cursorX = svgCoords.x;
      }
    }

    if (setY) {
      if (svgCoords.y <= this.selectorMinY) {
        this.cursorY = this.selectorMinY;
      } else if (svgCoords.y >= this.selectorMaxY) {
        this.cursorY = this.selectorMaxY;
      } else {
        this.cursorY = svgCoords.y;
      }
    }
  }

  private snapCoordsX(): void {
    let minDiff = Number.MAX_VALUE;
    let index = 0;
    for (let i = 0; i < this.pitchesX.length; i++) {
      if (Math.abs(this.pitchesX[i] - this.cursorX) < minDiff) {
        minDiff = Math.abs(this.pitchesX[i] - this.cursorX);
        index = i;
      }
    }

    if (index === 0) {
      index = 1;
    }

    this.selectedPitch.duration = (index + 1) / 12;
    const prevSelectorX = this.selectorX;
    this.selectorX = this.lineXOffset + this.durationWidth * index;

    if (this.selectorX !== prevSelectorX) {
      const effect = new GuitarEffect(
        GuitarEffectType.Bend,
        new GuitarEffectOptions(this.selectedPitch.pitch)
      );

      this.bendChanged.emit(effect);
    }
  }

  private snapCoordsY(): void {
    let minDiff = Number.MAX_VALUE;
    let index = 0;
    for (let i = 0; i < this.pitchesY.length; i++) {
      if (Math.abs(this.pitchesY[i] - this.cursorY) < minDiff) {
        minDiff = Math.abs(this.pitchesY[i] - this.cursorY);
        index = i;
      }
    }

    if (index === this.pitches.length - 1) {
      index = this.pitches.length - 2;
    }

    this.selectedPitch.pitch = this.pitches[this.pitches.length - index - 1];
    const prevSelectorY = this.selectorY;
    this.selectorY = this.lineHeight * index + 1 + this.svgYOffset;

    if (this.selectorY !== prevSelectorY) {
      const effect = new GuitarEffect(
        GuitarEffectType.Bend,
        new GuitarEffectOptions(this.selectedPitch.pitch)
      );

      this.bendChanged.emit(effect);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.selectorMoving) {
      if (this.selectorX + event.movementX <= this.selectorMinX) {
        this.selectorX = this.selectorMinX;
      } else if (this.selectorX + event.movementX >= this.selectorMaxX) {
        this.selectorX = this.selectorMaxX;
      } else {
        this.setCursorCoords(event.clientX, event.clientY, true, false);
        this.snapCoordsX();
      }

      if (this.selectorY + event.movementY <= this.selectorMinY) {
        this.selectorY = this.selectorMinY;
      } else if (this.selectorY + event.movementY >= this.selectorMaxY) {
        this.selectorY = this.selectorMaxY;
      } else {
        this.setCursorCoords(event.clientX, event.clientY, false, true);
        this.snapCoordsY();
      }
    }
  }

  public get bendCurve(): string {
    return (
      `M ${this.selectorMinX} ${this.selectorMaxY} ` +
      `Q ${this.selectorX} ${this.selectorMaxY}, ` +
      `${this.selectorX} ${this.selectorY}`
    );
  }
}
