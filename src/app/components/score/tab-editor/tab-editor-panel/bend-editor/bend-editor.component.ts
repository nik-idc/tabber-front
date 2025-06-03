import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GuitarEffect, GuitarEffectType } from '@atikincode/tabui/dist/index';
import { GuitarEffectOptions } from '@atikincode/tabui/dist/models/guitar-effect/guitar-effect-options';
import { BendPitch } from './bend-pitch/bend-pitch';

@Component({
  selector: 'app-bend-editor',
  templateUrl: './bend-editor.component.html',
  styleUrl: './bend-editor.component.scss',
})
export class BendEditorComponent {
  public selectedType: GuitarEffectType = GuitarEffectType.Bend;
  public bendTypes: GuitarEffectType[] = [
    GuitarEffectType.Bend,
    GuitarEffectType.BendAndRelease,
    GuitarEffectType.Prebend,
    GuitarEffectType.PrebendAndRelease,
  ];
  public bendTypesNames: string[] = [
    'Bend',
    'Bend & Release',
    'Prebend',
    'Prebend & Release',
  ];
  public selectedPitch: BendPitch = {
    pitch: 1,
    duration: 5 / 10,
  };
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
  public effect: GuitarEffect;

  constructor(
    public dialogRef: MatDialogRef<BendEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public onOpenEffect: GuitarEffect | undefined
  ) {
    if (this.onOpenEffect !== undefined) {
      this.effect = this.onOpenEffect.deepCopy();
    } else {
      this.effect = new GuitarEffect(
        GuitarEffectType.Bend,
        new GuitarEffectOptions(1)
      );
    }

    this.selectedType = this.effect.effectType;
  }

  onBendChanged(value: GuitarEffect): void {
    this.effect = value;
    // console.log(this.effect, 'onBendChanged');
  }

  onBendTypeClicked(typeIndex: number): void {
    this.selectedType = this.bendTypes[typeIndex];

    let options: GuitarEffectOptions;
    switch (this.selectedType) {
      case GuitarEffectType.Bend:
        options = new GuitarEffectOptions(1);
        break;
      case GuitarEffectType.BendAndRelease:
        options = new GuitarEffectOptions(1, 0.75);
        break;
      case GuitarEffectType.Prebend:
        options = new GuitarEffectOptions(undefined, undefined, 1);
        break;
      case GuitarEffectType.PrebendAndRelease:
        options = new GuitarEffectOptions(undefined, 0.75, 1);
        break;
      default:
        options = new GuitarEffectOptions(1);
        break;
    }
    this.effect = new GuitarEffect(this.selectedType, options);

    console.log(this.selectedType);
  }

  @HostListener('document:keydown.enter')
  onEnterDown(event: KeyboardEvent) {
    this.dialogRef.close(['Yes']);
  }

  onSaveClicked(): void {
    console.log(this.effect, 'onSaveClicked');
  }

  public get GuitarEffectType(): typeof GuitarEffectType {
    return GuitarEffectType;
  }
}
