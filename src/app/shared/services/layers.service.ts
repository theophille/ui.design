import { Injectable, signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';
import { BoundingBox, Drawable } from '../../engine/drawables/drawable';
import { DrawableFactory } from '../../engine/drawables/drawableFactory';
import { DRAWABLES } from '../../engine/constants/constants';
import { TransformBox } from '../../engine/drawables/transformBox';
import { Transform, Vec2 } from '../../engine/utils/math.utils';

export type Layers = Array<Drawable | Array<Drawable>>;

@Injectable({
  providedIn: 'root'
})
export class LayersService {
  layers: WritableSignal<Array<Drawable>> = signal([
    (DrawableFactory.createFromData(DRAWABLES.Rectangle, {
      x: 1000, y: 300,
      width: 10, height: 10,
      rotation: 0, roundness: [0, 0, 0, 0]
    }, 'hehehehe') as Drawable),
    (DrawableFactory.createFromBox(DRAWABLES.Rectangle, 100, 100, 200, 200) as Drawable),
    (DrawableFactory.createFromData(DRAWABLES.Polygon, {
      x: 100, y: 100,
      width: 100, height: 700,
      rotation: 15, pointsCount: 6
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
  selectedLayers: WritableSignal<Array<number>> = signal([]);
  requestRedraw = new Subject<void>();
  transformBox: TransformBox | null = null;

  setTransformBox(): void {
    const selectedLayers = this.selectedLayers();
    const layers = this.layers();

    if (selectedLayers.length === 0) {
      this.transformBox = null;
      return;
    }

    if(selectedLayers.length === 1) {
      const drawable = layers[selectedLayers[0]];
      this.transformBox = new TransformBox(Transform.applyTransform(
        drawable.getUnitBoundingBox(),
        drawable.x,
        drawable.y,
        drawable.width,
        drawable.height,
        drawable.rotation
      ), drawable);
      return;
    }
    
    let boundingBox: BoundingBox = {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    }

    for (let i = 0; i < selectedLayers.length; i++) {
      const drawable: Drawable = layers[selectedLayers[i]];
      const dbb = drawable.boundingBox;
      console.log(dbb);
      
      if (boundingBox.minX > dbb.minX) {
        boundingBox.minX = dbb.minX;  
      }
      
      if (boundingBox.minY > dbb.minY) {
        boundingBox.minY = dbb.minY;
      }
      
      if (boundingBox.maxX < dbb.maxX) {
        boundingBox.maxX = dbb.maxX;
      }
      
      if (boundingBox.maxY < dbb.maxY) {
        boundingBox.maxY = dbb.maxY;
      }
    }

    this.transformBox = new TransformBox(boundingBox as BoundingBox);
  }
}
