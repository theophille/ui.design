import { Shape } from "./shape";

export class Ellipse extends Shape {
  constructor(params: Partial<Ellipse>) {
    super();
    Object.assign(this, params);
    this.boundingBox = this.getBoundingBoxCoords();
  }
  
  public override draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = this.fill;
    context.strokeStyle = this.borderColor;
    context.lineWidth = this.borderSize;

    this.path = new Path2D();
    this.path.ellipse(
      Math.round(this.x),
      Math.round(this.y),
      Math.round(this.width / 2),
      Math.round(this.height / 2),
      this.rotation,
      0, 2 * Math.PI,
      false
    );
    this.path.closePath()
    context.fill(this.path);
    context.stroke(this.path);
    context.restore();
  }
}