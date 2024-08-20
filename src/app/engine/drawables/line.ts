import { BORDER_DEFAULT, FILL_DEFAULT, STROKE_SIZE_DEFAULT } from "../constants/constants";
import { Transform } from "../utils/math.utils";
import { BoundingBox, Drawable } from "./drawable";

export class Line extends Drawable {
  color: string = BORDER_DEFAULT;
  lineWidth: number = STROKE_SIZE_DEFAULT;

  constructor(params: Partial<Line>) {
    super();
    Object.assign(this, params);
    this.anchor = { x: -this.width / 2, y: -this.height / 2 };
    this.boundingBox = this.getBoundingBoxCoords();
  }

  public override draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.strokeStyle = this.color;
    context.lineWidth = this.lineWidth;

    this.path = new Path2D();

    this.path.moveTo(this.x, this.y);
    this.path.lineTo(this.x + this.width, this.y + this.height);
    context.stroke(this.path);
    context.restore();
  }
}