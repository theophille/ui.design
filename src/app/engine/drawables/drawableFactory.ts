import { DRAWABLES, DRAWABLES_LABELS } from "../constants/constants";
import { CustomShape } from "./customShape";
import { Drawable } from "./drawable";
import { Ellipse } from "./ellipse";
import { Line } from "./line";
import { Polygon } from "./polygon";
import { Rectangle } from "./rectangle";

export class DrawableFactory {
  private static count = {
    rectangle: 0,
    ellipse: 0,
    polygon: 0,
    line: 0,
    customShape: 0,
    text: 0,
    image: 0
  }

  public static createFromBox(what: number, startX: number, startY: number,
    endX: number, endY: number): Drawable | null {
    
    const w = Math.abs(endX - startX);
    const h = Math.abs(endY - startY);
    const x = Math.round(startX);
    const y = Math.round(startY);

    return this.createFromData(what, {
      x: x,
      y: y,
      width: w,
      height: h,
      rotation: 0
    });
  }

  public static createFromData(what: number, data: any, label?: string): Drawable | null {
    if (what === DRAWABLES.Rectangle) {
      const id = this.count.rectangle++;
      const l = label ? label : `${DRAWABLES_LABELS.rectangle} ${id}`;
      let rectangle = new Rectangle({ ...data, label: l });
      return rectangle;
    }

    if (what == DRAWABLES.Ellipse) {
      const id = this.count.ellipse++;
      const l = label ? label : `${DRAWABLES_LABELS.ellipse} ${id}`;
      let ellipse = new Ellipse({ ...data, label: l });
      return ellipse;
    }

    if (what == DRAWABLES.Polygon) {
      const id = this.count.polygon++;
      const l = label ? label : `${DRAWABLES_LABELS.polygon} ${id}`;
      let polygon = new Polygon({ ...data, label: l });
      return polygon;
    }

    if (what == DRAWABLES.Line) {
      const id = this.count.line++;
      const l = label ? label : `${DRAWABLES_LABELS.line} ${id}`;
      let line = new Line({ ...data, label: l });
      return line;
    }

    if (what == DRAWABLES.CustomShape) {
      const id = this.count.customShape++;
      const l = label ? label : `${DRAWABLES_LABELS.customShape} ${id}`;
      let customShape = new CustomShape({ ...data, label: l });
      return customShape;
    }

    return null;
  }
}