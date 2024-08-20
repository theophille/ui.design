import { Transform, Vec2 } from "../utils/math.utils";
import { PenPoint } from "./customShape";

export interface BoundingBox {
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
}

export abstract class Drawable {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  rotation: number = 0;
  boundingBox!: BoundingBox;
  label!: string;
  path!: Path2D;
  anchor: Vec2 = { x: 0, y: 0 };

  protected points!: any;

  public setTraslate(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.boundingBox = this.getBoundingBoxCoords();
  }
  
  public setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.boundingBox = this.getBoundingBoxCoords();
  }
  
  public setRotation(deg: number): void {
    this.rotation = deg;
    this.boundingBox = this.getBoundingBoxCoords();
  }

  public getUnitBoundingBox(): Array<Vec2> {
    const anchorPercent = {
      x: this.anchor.x / this.width,
      y: this.anchor.y / this.height
    };

    return [
      { x: -0.5 - anchorPercent.x, y: 0.5 - anchorPercent.y },
      { x: 0.5 - anchorPercent.x, y: 0.5 - anchorPercent.y },
      { x: 0.5 - anchorPercent.x, y: -0.5 - anchorPercent.y },
      { x: -0.5 - anchorPercent.x, y: -0.5 - anchorPercent.y },
    ];
  }

  public getBoundingBoxCoords(): BoundingBox {
    let unitBoundingBox = this.getUnitBoundingBox();

    const p = Transform.applyTransform(unitBoundingBox, this.x, this.y, this.width, this.height, this.rotation);
    let boundingBox = {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    }

    for (let i = 0; i < p.length; i++) {
      if (boundingBox.minX > p[i].x) {
        boundingBox.minX = p[i].x;
      }
      
      if (boundingBox.minY > p[i].y) {
        boundingBox.minY = p[i].y;
      }
      
      if (boundingBox.maxX < p[i].x) {
        boundingBox.maxX = p[i].x;
      }
      
      if (boundingBox.maxY < p[i].y) {
        boundingBox.maxY = p[i].y;
      }
    }
    
    return boundingBox;
  }

  public abstract draw(context: CanvasRenderingContext2D): void;
}