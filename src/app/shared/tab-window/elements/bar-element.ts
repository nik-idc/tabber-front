import { Bar } from "src/app/models/tab/bar";
import { Rect } from "../shapes/rect";
import { ChordElement } from "./chord-element";
import { TabWindow } from "../tab-window";
import { Point } from "../shapes/point";

export class BarElement {
	readonly tabWindow: TabWindow;
	readonly chordElements: ChordElement[];
	readonly measureRect: Rect | null;
	readonly prependRect: Rect;
	readonly appendRect: Rect;
	readonly rect: Rect;
	readonly bar: Bar;

	constructor (tabWindow: TabWindow, barCoords: Point, bar: Bar, showMeasure: boolean) {
		this.tabWindow = tabWindow;
		this.chordElements = [];
		this.measureRect = showMeasure ? new Rect() : null;
		this.prependRect = new Rect();
		this.appendRect  = new Rect();
		this.rect = new Rect(barCoords.x, barCoords.y); // !! (?)
		this.bar = bar;

		this.calc();
	}

	calc(): void {
		// Set prepend rect
		this.prependRect.x = this.rect.x;
		this.prependRect.y = this.rect.y;
		this.prependRect.width = this.tabWindow.dim.noteMinSize;
		this.prependRect.height = this.tabWindow.dim.barHeight;
		
		// Calculate chords
		let chordCoords = new Point(this.prependRect.x + this.prependRect.width, this.prependRect.y);
		let chordsWidth = 0;
		
		for (let chord of this.bar.chords) {
			let chordElement = new ChordElement(this.tabWindow, this, chordCoords, chord);
			this.chordElements.push(chordElement);
			
			chordCoords.x += chordElement.rect.width;
			chordsWidth += chordElement.rect.width;
		}
		
		// Set append rectangles x coords
		this.appendRect.x = this.rect.x + this.prependRect.width + chordsWidth;
		this.appendRect.y = this.rect.y;
		this.appendRect.width = this.tabWindow.dim.noteMinSize;
		this.appendRect.height = this.tabWindow.dim.barHeight;

		this.rect.width = this.tabWindow.dim.noteMinSize + chordsWidth + this.tabWindow.dim.noteMinSize;
		this.rect.height = this.tabWindow.dim.barHeight;
	}

	scaleBarHorBy(scale: number) {
		if (scale <= 0) {
			throw new Error(`${scale} is an invalid scale: scale must be positive`);
		}

		// Scale rectangles
		this.prependRect.width *= scale;
		this.appendRect.width *= scale;
		this.rect.width *= scale;

		// Scale coords (except bar start x)
		this.prependRect.x *= scale;
		this.appendRect.x *= scale;
		this.rect.x *= scale;

		// Scale chords
		for (let chordElement of this.chordElements) {
			chordElement.scaleChordHorBy(scale);
		}
	}

	translateBy(dx: number, dy: number) {
		// Translate bar rectangles
		this.prependRect.x += dx;
		this.prependRect.y += dy;
		this.appendRect.x += dx;
		this.appendRect.y += dy;
		this.rect.x += dx;
		this.rect.y += dy;

		// Translate chord elements
		for (let chordElement of this.chordElements) {
            chordElement.translateBy(dx, dy);
        }
	}
	
	insertEmptyChord(index: number): void {
		this.bar.insertEmptyChord(index);
		this.tabWindow.calc();
	}

	prependChord(): void {
		this.bar.prependChord();
		this.tabWindow.calc();
	}

	appendChord(): void {
		this.bar.appendChord();
		this.tabWindow.calc();
	}

	removeChord(index: number): void {
		this.bar.removeChord(index);
		this.tabWindow.calc();
	}

	get durationsFit(): boolean {
		return this.bar.durationsFit;
	}
}