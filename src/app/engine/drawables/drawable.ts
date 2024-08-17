export abstract class Drawable {
  static CustomShape(CustomShape: any, arg1: { points: import("./customShape").PenPoint[]; }): Drawable {
    throw new Error('Method not implemented.');
  }
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  rotation: number = 0;
  label!: string;
  path!: Path2D;

  public abstract draw(context: CanvasRenderingContext2D): void;
}