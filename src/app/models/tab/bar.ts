import { Chord } from "./chord";
import { Guitar } from "./guitar";
import { NoteDuration } from "./note-duration";
import { Tab } from "./tab";

export class Bar {
	readonly guitar: Guitar;
	readonly beats: number;
	readonly duration: NoteDuration;
	readonly chords: Chord[];
	private _durationsFit: boolean

	constructor(guitar: Guitar, beats: number, duration: NoteDuration) {
		this.guitar = guitar;
		this.beats = beats;
		this.duration = duration;
		this.chords = [];
		for (let beat = 0; beat < this.beats; beat++) {
			this.chords.push(new Chord(this.guitar, duration));
		}
		this._durationsFit = true;
	}

	checkDurationsFit(): void {
		let durations = 0;
		for (let chord of this.chords) {
			durations += chord.duration;
		}

		this._durationsFit = durations == (this.beats * this.duration);
	}

	insertEmptyChord(index: number): void {
		// Check index validity
		if (index < 0 || index > this.chords.length) {
			throw new Error(`${index} is invalid chord index`)
		}

		// Insert chord in the data model
		let newChord = new Chord(this.guitar, NoteDuration.Quarter);
		this.chords.splice(index, 0, newChord);

		// Check if durations fit after inserting
		this.checkDurationsFit();
	}

	prependChord(): void {
		this.insertEmptyChord(0);
	}

	appendChord(): void {
		this.insertEmptyChord(this.chords.length);
	}

	removeChord(index: number): void {
		// Check index validity
		if (index < 0 || index > this.chords.length) {
			throw new Error(`${index} is invalid chord index`)
		}

		// Remove chord
		this.chords.splice(index, 1);

		// Check if durations fit after removing
		this.checkDurationsFit();
	}

	get durationsFit(): boolean {
		return this._durationsFit;
	}

	get measure() {
		return this.beats * this.duration;
	}
}
