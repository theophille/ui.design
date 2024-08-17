export abstract class Drawable {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  rotation: number = 0;
  label!: string;
  path!: Path2D;

  public abstract draw(context: CanvasRenderingContext2D): void;
}