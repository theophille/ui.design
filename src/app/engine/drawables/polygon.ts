import { radians, Transform, Vec2 } from "../utils/math.utils";
import { Shape } from "./shape";

export class Polygon extends Shape {
  pointsCount: number = 3;

  constructor(params: Partial<Polygon>) {
    super();
    Object.assign(this, params);
  }

  private generatePoints(): Array<Vec2> {
    const angle = 360 / this.pointsCount;
    let points: Array<Vec2> = [];
    
    for (let i = 0; i < this.pointsCount; i++) {
      let point: Vec2 = {
        x: -Math.sin(radians(i * angle)) / 2,
        y: -Math.cos(radians(i * angle)) / 2
      };

      point = Transform.scale(point, this.width, this.height);
      point = Transform.rotate(point, this.rotation);
      point = Transform.translate(point, this.x, this.y);

      points.push(point);
    }

    return points;
  }

  public override draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = this.fill;
    context.strokeStyle = this.borderColor;
    context.lineWidth = this.borderSize;

    this.path = new Path2D();

    const unitPoints = this.generatePoints();
    this.path.moveTo(unitPoints[0].x, unitPoints[0].y);
    
    for (let i = 1; i < unitPoints.length; i++) {
      const current = unitPoints[i];
      this.path.lineTo(current.x, current.y);
    }

    this.path.closePath();

    context.fill(this.path);
    context.stroke(this.path);
    context.restore();
  }
}