import { Bar } from "../../../models/tab/bar";
import { TabLineDim } from "../tab-line-dim";
import { Tab } from "../../../models/tab/tab";
import { Rect } from "../shapes/rect";
import { NoteElement } from "./note-element";
import { Point } from "../shapes/point";
import { BarElement } from "./bar-element";
import { TabWindow } from "../tab-window";

// export class BarsLineElement {
// 	readonly tabWindow: TabWindow;
// 	readonly barElements: BarElement[];
// 	private _scale: number;

// 	constructor (tabWindow: TabWindow, barElements: BarElement[]) {
// 		this.tabWindow = tabWindow;
// 		this.barElements = barElements;
// 		this._scale = 1;

// 		this.calc();
// 	}

// 	calc(): void {
// 		// Calculate bar coords and size
// 		let calcLineWidth = 0;
// 		let barX = 0;
// 		for (let bar of this.bars) {
// 			let barElement = new BarElement(barX, bar, this.tabWindow);
// 			this.barElements.push(barElement);

// 			barX += barElement.barRect.width;
// 			calcLineWidth += barElement.barRect.width;
// 		}

// 		// Adjust the size to fit the tab line
// 		let scale = this.tabWindow.lineDim.tabLineWidth / calcLineWidth;
// 		this.barElements.forEach((barEl) => barEl.scaleBarHorBy(scale));
// 	}

// 	get scale(): number {
// 		return this._scale;
// 	}
// }