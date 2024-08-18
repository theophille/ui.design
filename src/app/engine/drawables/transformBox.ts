import { Vec2 } from "../utils/math.utils";
import { Drawable } from "./drawable";

export class TransformBox {
  private _selection: Array<Drawable> = [];
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

  public draw() {

  }

  public get selection(): Array<Drawable> {
    return this._selection;
  }

  public addToSelection(drawable: Drawable): void {
    this._selection.push(drawable);
  }

  public removeFromSelection(index: number): void {
    this._selection.splice(index, 1);
  }

  public clearSelection(): void {
    this._selection = []
  }
}