import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import {
  DURATION_TO_NAME,
  NoteDuration,
  TabWindow,
  GuitarEffectType,
  GuitarEffect,
} from '@atikincode/tabui/dist/index';
import { ScoreService } from 'src/app/_services/score.service';
import { TempoEditorComponent } from './tempo-editor/tempo-editor.component';
import { TimeSigEditorComponent } from './time-sig-editor/time-sig-editor.component';
import { GuitarEffectOptions } from '@atikincode/tabui/dist/models/guitar-effect/guitar-effect-options';
import { BendEditorComponent } from './bend-editor/bend-editor.component';

@Component({
  selector: 'app-tab-editor-panel',
  templateUrl: './tab-editor-panel.component.html',
  styleUrls: ['./tab-editor-panel.component.scss'],
})
export class TabEditorPanelComponent implements OnInit {
  @Input() tabIndex: number = 0;
  @Input() tabWindow!: TabWindow;

  public durations: NoteDuration[] = [];

  constructor(private scoreService: ScoreService, private dialog: MatDialog) {
    this.calcDurations();
  }
  ngOnInit(): void {}

  private calcDurations(): void {
    this.durations = [];
    const valuesDefault = Object.values(NoteDuration);
    for (const value of valuesDefault) {
      if (typeof value === 'string') {
        continue;
      }

      this.durations.push(value);
    }
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

  onTimeSigClicked(event: MouseEvent): void {
    console.log(event, 'onTimeSigClicked');

    const selectedElement = this.tabWindow.getSelectedElement();

    if (selectedElement === undefined) {
      throw Error(
        "No element selected - don't know which bar's time signature to change"
      );
    }

    const dialogRef = this.dialog.open(TimeSigEditorComponent, {
      data: {
        initBeatsCount: selectedElement.bar.beatsCount,
        initDuration: selectedElement.bar.duration,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result[0] === 'Cancel') {
        return;
      }

      this.tabWindow.changeSelectedBarBeats(result[1]);
      this.tabWindow.changeSelectedBarDuration(1 / result[2]);
    });
  }

  onTempoClicked(event: MouseEvent): void {
    console.log(event, 'onTempoClicked');

    const selectedElement = this.tabWindow.getSelectedElement();

    if (selectedElement === undefined) {
      throw Error(
        "No element selected - don't know which bar's tempo to change"
      );
    }

    const tempo = selectedElement.bar.tempo;

    const dialogRef = this.dialog.open(TempoEditorComponent, {
      data: { initTempo: tempo },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (result[0] === 'Cancel') {
        return;
      }

      this.tabWindow.changeSelectedBarTempo(result[1]);
    });
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

  private applyOrRemoveEffect(
    effectType: GuitarEffectType,
    options?: GuitarEffectOptions
  ): void {
    const selected = this.tabWindow.getSelectedElement();
    if (selected === undefined) {
      return;
    }

    const effectIndex = selected.note.effects.findIndex((e) => {
      return e.effectType === effectType;
    });

    if (effectIndex === -1) {
      this.tabWindow.applyEffectSingle(effectType, options);
    } else {
      this.tabWindow.removeEffectSingle(effectType, options);
    }
  }

  private removeEffect(type: GuitarEffectType): void {
    const selected = this.tabWindow.getSelectedElement();
    if (selected === undefined) {
      throw Error("Can't remove effect since selected element undefined");
    }

    const curEffect = selected.note.effects.find((e) => {
      return e.effectType === type;
    });
    if (curEffect === undefined) {
      throw Error(
        `Can't remove effect since no effect of type ${type} present`
      );
    }

    this.tabWindow.removeEffectSingle(type, curEffect.options);
  }

  private updateEffect(updatedEffect: GuitarEffect): void {
    const selected = this.tabWindow.getSelectedElement();
    if (selected === undefined) {
      throw Error("Can't remove effect since selected element undefined");
    }

    const curEffect = selected.note.effects.find((e) => {
      return e.effectType === updatedEffect.effectType;
    });
    if (curEffect !== undefined) {
      this.tabWindow.removeEffectSingle(
        curEffect.effectType,
        curEffect.options
      );
    }

    this.tabWindow.applyEffectSingle(
      updatedEffect.effectType,
      updatedEffect.options
    );
  }

  onEffectClicked(effectType: GuitarEffectType): void {
    const bends = [
      GuitarEffectType.Bend,
      GuitarEffectType.BendAndRelease,
      GuitarEffectType.Prebend,
      GuitarEffectType.PrebendAndRelease,
    ];

    if (!bends.includes(effectType)) {
      this.applyOrRemoveEffect(effectType);
      return;
    }

    const selected = this.tabWindow.getSelectedElement();
    const onOpenEffect = selected?.note.effects.find((e) => {
      return bends.includes(e.effectType);
    });
    const dialogRef = this.dialog.open(BendEditorComponent, {
      data: onOpenEffect,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (result[0] === 'Cancel') {
        return;
      }

      const effect = result[1] as GuitarEffect;
      switch (result[0]) {
        case 'Cancel':
          return;
        case 'Remove':
          this.removeEffect(effect.effectType);
          break;
        case 'Save':
          this.updateEffect(effect);
          break;
        default:
          break;
      }

      const bendType = result[1] as GuitarEffectType;
      const options = result[2] as GuitarEffectOptions;
      this.applyOrRemoveEffect(bendType, options);
    });
  }

  public get DURATION_TO_NAME(): { [duration: number]: string } {
    return DURATION_TO_NAME;
  }

  public get GuitarEffectType(): typeof GuitarEffectType {
    return GuitarEffectType;
  }
}
