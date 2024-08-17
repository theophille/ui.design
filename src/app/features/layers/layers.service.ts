import { Injectable, signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';
import { Drawable } from '../../engine/drawables/drawable';
import { DrawableFactory } from '../../engine/drawables/drawableFactory';
import { DRAWABLES } from '../../engine/constants/constants';
import { PenPoint } from '../../engine/drawables/customShape';

export type Layers = Array<Drawable | Array<Drawable>>;

@Injectable({
  providedIn: 'root'
})
export class LayersService {
  layers: WritableSignal<Layers> = signal([
    (DrawableFactory.createFromData(DRAWABLES.Rectangle, {
      x: 1000, y: 300,
      width: 10, height: 10,
      rotation: 0, roundness: [0, 0, 0, 0]
    }, 'hehehehe') as Drawable),
    (DrawableFactory.createFromBox(DRAWABLES.Rectangle, 100, 100, 200, 200) as Drawable),
    (DrawableFactory.createFromData(DRAWABLES.Polygon, {
      x: 500, y: 500,
      width: 300, height: 300,
      rotation: 50, pointsCount: 6
    }) as Drawable),
    (DrawableFactory.createFromData(DRAWABLES.Line, {
      x: 800, y: 200,
      width: 300, height: 300
    }) as Drawable),
    (DrawableFactory.createFromData(DRAWABLES.Ellipse, {
      x: 1000, y: 300,
      width: 300, height: 500,
      fill: '#ff6590'
    }) as Drawable)
  ]);

  layersLoaded = new Subject<void>();
  layerClicked = new Subject<number | null>();

  constructor() {
    
  }
}
