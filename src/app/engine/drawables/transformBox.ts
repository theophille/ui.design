import { Transform, Vec2 } from "../utils/math.utils";
import { BoundingBox, Drawable } from "./drawable";
import { Ellipse } from "./ellipse";
import { Rectangle } from "./rectangle";

export class TransformBox {
  x: number;
  y: number;
  width: number;
  height: number;

  private points: Array<Vec2> = [
    { x: -0.5, y: 0.5 },
    { x: 0, y: 0.5 },
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0 },
    { x: 0.5, y: -0.5 },
    { x: 0, y: -0.5 },
    { x: -0.5, y: -0.5 },
    { x: -0.5, y: 0 }
  ];

  private rectangle!: Rectangle;
  public controls: Array<Ellipse> = [];

  constructor(boundingBox: BoundingBox) {
    this.width = boundingBox.maxX - boundingBox.minX;
    this.height = boundingBox.maxY - boundingBox.minY;
    this.x = Math.round(boundingBox.minX + this.width / 2);
    this.y = Math.round(boundingBox.minY + this.height / 2);
    this.points = Transform.applyTransform(this.points, this.x, this.y, this.width, this.height, 0);
  }

  public draw(context: CanvasRenderingContext2D, offset: Vec2, scale: number) {
    context.restore();
    this.rectangle = new Rectangle({ x: (this.x * scale) + offset.x, y: this.y * scale + offset.y, width: this.width * scale, height: this.height * scale, rotation: 0, fill: 'transparent', borderSize: 2 });
    this.rectangle.draw(context);
    this.controls = [];
    for (let i = 0; i < this.points.length; i++) {
      const ellipse = new Ellipse({x: this.points[i].x * scale + offset.x, y: this.points[i].y * scale + offset.y, width: 10, height: 10, rotation: 0, fill: "white", borderSize: 1});
      ellipse.draw(context);
      this.controls.push(ellipse);
    }
    context.save();
  }

  public isPointInside(context: CanvasRenderingContext2D, mx: number, my: number): boolean {
    return context.isPointInPath(this.rectangle.path, mx, my);
  }
}