import { Bar } from "./bar";
import { Guitar } from "./guitar";
import { GuitarNote } from "./guitar-note";
import { NoteDuration } from "./note-duration";

export class Chord {
	readonly guitar: Guitar;
	readonly duration: NoteDuration;
	readonly notes: GuitarNote[];

	constructor (guitar: Guitar, duration: NoteDuration) {
		this.guitar = guitar;
		this.duration = duration;
		this.notes = [];
		for (let strNum = 1; strNum <= guitar.stringsCount; strNum++) {
			this.notes.push(new GuitarNote(this.guitar, strNum, null));
		}
	}
}
