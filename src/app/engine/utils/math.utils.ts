import { PenPoint } from "../drawables/customShape";

export interface Vec2 {
  x: number;
  y: number;
}

export class Transform {
  public static rotate(p: PenPoint, deg: number): PenPoint;
  public static rotate(p: Vec2, deg: number): Vec2;

  public static rotate(p: Vec2 | PenPoint, deg: number): Vec2 | PenPoint {
    if (p instanceof PenPoint) {
      p.center = Transform.rotate(p.center, deg);

      if (p.right) {
        p.right = Transform.rotate(p.right, deg);
      }
  
      if (p.left) {
        p.left = Transform.rotate(p.left, deg);
      }
  
      return p;
    }

    return {
      x: Math.round(p.x * Math.cos(radians(deg)) - p.y * Math.sin(radians(deg))),
      y: Math.round(p.x * Math.sin(radians(deg)) + p.y * Math.cos(radians(deg)))
    };
  }
  
  public static translate(p: Vec2, x: number, y: number): Vec2;
  public static translate(p: PenPoint, x: number, y: number): PenPoint;

  public static translate(p: Vec2 | PenPoint, x: number, y: number): Vec2 | PenPoint {
    if (p instanceof PenPoint) {
      p.center = Transform.translate(p.center, x, y);

      if (p.right) {
        p.right = Transform.translate(p.right, x, y);
      }
  
      if (p.left) {
        p.left = Transform.translate(p.left, x, y);
      }
  
      return p;
    }

    return {
      x: Math.round(x + p.x),
      y: Math.round(y + p.y)
    };
  }

  public static scale(p: Vec2, sx: number, sy: number): Vec2;
  public static scale(p: PenPoint, sx: number, sy: number): PenPoint;

  public static scale(p: Vec2 | PenPoint, sx: number, sy: number): Vec2 | PenPoint {
    if (p instanceof PenPoint) {
      p.center = Transform.scale(p.center, sx, sy);

      if (p.right) {
        p.center = Transform.scale(p.right, sx, sy);
      }
  
      if (p.left) {
        p.center = Transform.scale(p.left, sx, sy);
      }
  
      return p;
    }
    
    return {
      x: Math.round(sx * p.x),
      y: Math.round(sy * p.y)
    };
  }

  public static applyTransform(p: Vec2, x: number, y: number, w: number, h: number, r: number): Vec2;
  public static applyTransform(p: PenPoint, x: number, y: number, w: number, h: number, r: number): PenPoint;
  public static applyTransform(p: Array<Vec2>, x: number, y: number, w: number, h: number, r: number): Array<Vec2>;
  public static applyTransform(p: Array<PenPoint>, x: number, y: number, w: number, h: number, r: number): Array<PenPoint>;
  public static applyTransform(p: any, x: number, y: number, w: number, h: number, r: number): Vec2 | PenPoint | Array<Vec2> | Array<PenPoint> {
    const applyToPoint = (p: any, x: number, y: number, w: number, h: number, r: number) => {
      return Transform.translate(
        Transform.rotate(
          Transform.scale(
            p, w, h
          ), r
        ), x, y
      );
    };

    if (p instanceof Array) {
      return p.map((pt) => applyToPoint(pt, x, y, w, h, r));
    }

    return applyToPoint(p, x, y, w, h, r);
  }
}

export function radians(deg: number): number {
  return (deg * Math.PI) / 180;
}
