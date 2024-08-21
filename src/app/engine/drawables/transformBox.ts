import { normalize, Transform, Vec2 } from "../utils/math.utils";
import { BoundingBox, Drawable } from "./drawable";
import { Ellipse } from "./ellipse";
import { Rectangle } from "./rectangle";

export class TransformBox {
  x!: number;
  y!: number;
  width!: number;
  height!: number;
  rotation: number = 0;
  anchor!: Vec2;
  rotatedBox?: Array<Vec2>;
  normals: Array<Vec2> = [
    normalize({ x: -1, y: 1 }),
    normalize({ x: 0, y: 1 }),
    normalize({ x: 1, y: 1 }),
    normalize({ x: 1, y: 0 }),
    normalize({ x: 1, y: -1 }),
    normalize({ x: 0, y: -1 }),
    normalize({ x: -1, y: -1 }),
    normalize({ x: -1, y: 0 })
  ];

  private points!: Array<Vec2>;

  private rectangle!: Rectangle;
  public controls: Array<Ellipse> = [];

  private setUnitPoints(): void {
    const anchorPercent = {
      x: this.anchor.x / this.width,
      y: this.anchor.y / this.height
    }

    this.points = [
      { x: -0.5 - anchorPercent.x , y: 0.5 - anchorPercent.y },
      { x: 0 - anchorPercent.x, y: 0.5 - anchorPercent.y },
      { x: 0.5 - anchorPercent.x, y: 0.5 - anchorPercent.y },
      { x: 0.5 - anchorPercent.x, y: 0 - anchorPercent.y },
      { x: 0.5 - anchorPercent.x, y: -0.5 - anchorPercent.y },
      { x: 0 - anchorPercent.x, y: -0.5 - anchorPercent.y },
      { x: -0.5 - anchorPercent.x, y: -0.5 - anchorPercent.y },
      { x: -0.5 - anchorPercent.x, y: 0 - anchorPercent.y }
    ];
  }
  
  constructor(points: Array<Vec2>, drawable: Drawable);
  constructor(points: BoundingBox);
  constructor(points: BoundingBox | Array<Vec2>, drawable?: Drawable) {
    if (points instanceof Array) {
      if (drawable) {
        this.width = drawable.width;
        this.height = drawable.height;
        this.x = drawable.x;
        this.y = drawable.y;
        this.rotation = drawable.rotation;
        this.rotatedBox = points;
        this.anchor = drawable.anchor;
        this.setUnitPoints();
        this.points = Transform.applyTransform(
          this.points,
          this.x,
          this.y,
          this.width,
          this.height,
          this.rotation
        );
        this.normals = Transform.rotateAround(this.normals, { x: 0, y: 0 }, this.rotation);
      }
    } else {
      this.width = points.maxX - points.minX;
      this.height = points.maxY - points.minY;
      this.x = Math.round(points.minX + this.width / 2);
      this.y = Math.round(points.minY + this.height / 2);
      this.anchor = {x: 0, y: 0};
      this.setUnitPoints();
      this.points = Transform.applyTransform(
        this.points,
        this.x,
        this.y,
        this.width,
        this.height,
        0
      );
    }
  }

  public draw(context: CanvasRenderingContext2D, offset: Vec2, scale: number) {
    context.restore();

    this.rectangle = new Rectangle({
      x: this.x * scale + offset.x,
      y: this.y * scale + offset.y,
      width: this.width * scale,
      height: this.height * scale,
      rotation: this.rotation,
      fill: 'transparent',
      borderSize: 2,
      anchor: { x: this.anchor.x * scale, y: this.anchor.y * scale }
    });

    this.rectangle.draw(context);

    this.controls = [];
    for (let i = 0; i < this.points.length; i++) {
      const ellipse = new Ellipse({
        x: this.points[i].x * scale + offset.x,
        y: this.points[i].y * scale + offset.y,
        width: 10,
        height: 10,
        rotation: 0,
        fill: 'white',
        borderSize: 1
      });

      ellipse.draw(context);
      this.controls.push(ellipse);
    }
    context.save();
  }

  public isPointInside(context: CanvasRenderingContext2D, mx: number, my: number): boolean {
    return context.isPointInPath(this.rectangle.path, mx, my);
  }
}