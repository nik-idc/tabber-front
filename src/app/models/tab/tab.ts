import { Bar } from "./bar";
import { Guitar } from "./guitar";
import { NoteDuration } from "./note-duration";

export class Tab {
	readonly id: number | null;
	public artist: string;
	public song: string;
	readonly guitar: Guitar;
	readonly bars: Bar[];

	constructor(artist: string = '', song: string = '',  guitar: Guitar = new Guitar()) {
		this.id = null;
		this.artist = artist;
		this.song = song;
		this.guitar = guitar;
		this.bars = [
			new Bar(this.guitar, 4, NoteDuration.Quarter),
		];
	}

	get name(): string {
		return this.artist + "-" + this.song;
	}
}