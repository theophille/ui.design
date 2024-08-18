import { Transform, Vec2 } from "../utils/math.utils";
import { PenPoint } from "./customShape";

export abstract class Drawable {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  rotation: number = 0;
  boundingBox!: {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
  };
  label!: string;
  path!: Path2D;

  public setTraslate(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  public setRotation(deg: number): void {
    this.rotation = deg;
  }

  public abstract draw(context: CanvasRenderingContext2D): void;
}