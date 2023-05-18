import { Chord } from "src/app/models/tab/chord";
import { Rect } from "../shapes/rect";
import { NoteElement } from "./note-element";
import { BarElement } from "./bar-element";
import { Point } from "../shapes/point";
import { TabWindow } from "../tab-window";

export class ChordElement {
	readonly tabWindow: TabWindow;
	readonly barElement: BarElement;
	readonly noteElements: NoteElement[];
	readonly rect: Rect;
	readonly chord: Chord;

	constructor (tabWindow: TabWindow, barElement: BarElement, chordCoords: Point, chord: Chord) {
		this.tabWindow = tabWindow;
		this.barElement = barElement;
		this.noteElements = new Array<NoteElement>(this.tabWindow.tab.guitar.stringsCount);
		this.rect = new Rect(chordCoords.x, chordCoords.y);
		this.chord = chord;

		this.calc();
	}

	calc(): void {
		// Calc chord rectangle
		// 1/32 - 100%, 1/16 - 110%, 1/8 - 120%, 1/4 - 130%, 1/2 - 140%, 1 - 150%
		let chordWidth = ((100 + Math.log2(1 / this.chord.duration) * 10) / 100) * this.tabWindow.dim.noteMinSize;
		this.rect.width = chordWidth;
		this.rect.height = this.tabWindow.dim.barHeight;

		let notes = this.chord.notes;
		for (let strNum = 0; strNum < notes.length; strNum++) {
			this.noteElements[strNum] = new NoteElement(this.tabWindow, this, notes[strNum]);
		}
	}

	scaleChordHorBy(scale: number) {
		if (scale <= 0) {
			throw new Error(`${scale} is an invalid scale: scale must be positive`);
		}

		this.rect.width *= scale;
		this.rect.x *= scale;

		for (let noteElement of this.noteElements) {
			noteElement.scaleNoteHorBy(scale);
		}
	}

	translateBy(dx: number, dy: number) {
		this.rect.x += dx;
		this.rect.y += dy;
		for (let noteElement of this.noteElements) {
            noteElement.translateBy(dx, dy);
        }
	}
}