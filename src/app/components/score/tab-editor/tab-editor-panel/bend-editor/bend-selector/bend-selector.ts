import { BendPitch } from "../bend-pitch/bend-pitch";

export class BendSelector {
  public id: string;
  public minX: number;
  public maxX: number;
  public minY: number;
  public maxY: number;
  public x: number;
  public y: number;
  public cursorX: number;
  public cursorY: number;
  public cursorMaxX: number;
  public cursorMinX: number;
  public cursorMinY: number;
  public cursorMaxY: number;
  public moving: boolean;
  public radius: number;
  public pitch: BendPitch;

  constructor(
    id: string,
    radius: number,
    pitch: BendPitch,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
  ) {
    this.id = id;

    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.x = this.minX;
    this.y = this.maxY;

    this.cursorMinX = this.minX;
    this.cursorMaxX = this.maxX;
    this.cursorMinY = this.minY;
    this.cursorMaxY = this.maxY;
    this.cursorX = this.cursorMinX;
    this.cursorY = this.cursorMaxY;

    this.radius = radius;

    this.moving = false;

    this.pitch = pitch;
  }
}
