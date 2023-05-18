import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { GuitarNote } from '../models/tab/guitar-note';
import { Tab } from '../models/tab/tab';
import { Bar } from '../models/tab/bar';
import { Chord } from '../models/tab/chord';
import { NoteDuration } from '../models/tab/note-duration';
import { Guitar } from '../models/tab/guitar';
import { Note } from '../models/tab/note';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  constructor() { }


  getTab(): Tab {
	// // Create notes
	// let notes = [
	// 	new GuitarNote()
	// ]

	// // Create chords
	// let chords1 = [
	// 	new Chord
	// 	new Chord(NoteDuration.Half, [5, 6, 7, null, null, null]),
	// 	new Chord(NoteDuration.Half, [3, 5, 6, null, null, null]),
	// ]

	// let chords2 = [
	// 	new Chord(1, [9, 8, 9, null, null, null]),
	// ]

	// let chords3 = [
	// 	new Chord(NoteDuration.Quarter, [3, 3, 4, 5, 5, 3]),
	// 	new Chord(NoteDuration.Quarter, [3, 3, 4, 5, 5, 3]),
	// 	new Chord(NoteDuration.Quarter, [3, 3, 4, 5, 5, 3]),
	// 	new Chord(NoteDuration.Quarter, [3, 3, 4, 5, 5, 3]),
	// ]

	// let chords4 = [
	// 	new Chord(NoteDuration.Quarter, [10, 10, 11, 12, 12, 10]),
	// 	new Chord(NoteDuration.Quarter, [10, 10, 11, 12, 10, 10]),
	// 	new Chord(NoteDuration.Quarter, [10, 10, 11, 12, 12, 10]),
	// ]

	// let chords5 = [
	// 	new Chord(NoteDuration.Half, [5, 6, 7, null, null, null]),
	// 	new Chord(NoteDuration.Half, [3, 5, 6, null, null, null]),
	// ]

	// let chords6 = [
	// 	new Chord(1, [9, 8, 9, null, null, null]),
	// ]

	// let chords7 = [
	// 	new Chord(NoteDuration.Quarter, [3, 3, 4, 5, 5, 3]),
	// 	new Chord(NoteDuration.Quarter, [3, 3, 4, 5, 5, 3]),
	// 	new Chord(NoteDuration.Quarter, [3, 3, 4, 5, 5, 3]),
	// 	new Chord(NoteDuration.Quarter, [3, 3, 4, 5, 5, 3]),
	// ]

	// let chords8 = [
	// 	new Chord(NoteDuration.Quarter, [10, 10, 11, 12, 12, 10]),
	// 	new Chord(NoteDuration.Quarter, [10, 10, 11, 12, 10, 10]),
	// 	new Chord(NoteDuration.Quarter, [10, 10, 11, 12, 12, 10]),
	// ]

	// // Create bars
	// let bars = [
	// 	new Bar(4, 4, chords1),
	// 	new Bar(4, 4, chords2),
	// 	new Bar(4, 4, chords3),
	// 	new Bar(3, 4, chords4),
	// 	new Bar(4, 4, chords5),
	// 	new Bar(4, 4, chords6),
	// 	new Bar(4, 4, chords7),
	// 	new Bar(3, 4, chords8),
	// ];

	// Create test guitar
	let tuning = [
		Note.E,
		Note.B,
		Note.G,
		Note.D,
		Note.A,
		Note.E,
	]
	let guitar = new Guitar(6, tuning, 24);

	// Create test tab
	return new Tab('test', 'test', guitar);
  }
}
