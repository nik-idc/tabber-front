import { Note } from "./note";

const defaultTuning = [
	Note.E,
	Note.B,
	Note.G,
	Note.D,
	Note.A,
	Note.E,
]

export class Guitar {
	constructor (readonly stringsCount: number = 6,
		readonly tuning: Note[] = defaultTuning,
		readonly fretsCount: number = 24) {	}
}
