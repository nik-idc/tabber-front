import { Guitar } from "src/app/models/tab/guitar";
import { Tab } from "../../models/tab/tab";

export class TabLineDim {
	readonly noteMinSize: number;
	readonly durationWidth: number;
	readonly durationHeight: number;
	readonly barsPerLine: number;
	readonly xOffset: number;
	readonly yOffset: number;
	readonly barWidth: number;
	readonly barHeight: number;
	readonly durationsLineHeight: number;
	readonly tabLineWidth: number;
	readonly tabLineHeight: number;
	readonly svgLineWidth: number;
	readonly svgLineHeight: number;

	constructor(guitar: Guitar, noteMinSize: number, barsPerLine: number, xOffset: number, yOffset: number) {
		this.noteMinSize = noteMinSize;
		this.durationWidth = this.noteMinSize;
		this.durationHeight = this.noteMinSize;
		this.barsPerLine = barsPerLine;
		this.xOffset = xOffset;
		this.yOffset = yOffset;
		// Min note is 1/32, standard bar width is a full 4/4 bar of 1/32 notes
		// plus prepend/append rectangles on both left and right of the bar
		this.barWidth = this.noteMinSize + 32 * this.noteMinSize + this.noteMinSize;
		this.barHeight = this.noteMinSize * (guitar.stringsCount - 1);
		this.durationsLineHeight = this.barHeight / 2;
		this.tabLineWidth = this.barWidth * this.barsPerLine
		this.tabLineHeight = this.barHeight + this.durationsLineHeight;
		this.svgLineWidth = this.xOffset + this.tabLineWidth + this.xOffset;
		this.svgLineHeight = this.yOffset + this.tabLineHeight + this.yOffset;
	}
}