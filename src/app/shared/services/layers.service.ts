import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';
import { BoundingBox, Drawable } from '../../engine/drawables/drawable';
import { DrawableFactory } from '../../engine/drawables/drawableFactory';
import { DRAWABLES } from '../../engine/constants/constants';
import { TransformBox } from '../../engine/drawables/transformBox';
import { Transform, Vec2 } from '../../engine/utils/math.utils';
import { ZoomAndPanService } from '../../features/drawing-context/zoom-and-pan.service';

export type Layers = Array<Drawable | Array<Drawable>>;

@Injectable({
  providedIn: 'root'
})
export class LayersService {
  layers: WritableSignal<Array<Drawable>> = signal([
    (DrawableFactory.createFromData(DRAWABLES.Rectangle, {
      x: 1000, y: 300,
      width: 10, height: 10,
      rotation: 50, roundness: [0, 0, 0, 0]
    }, 'hehehehe') as Drawable),
    (DrawableFactory.createFromBox(DRAWABLES.Rectangle, 100, 100, 200, 200) as Drawable),
    (DrawableFactory.createFromData(DRAWABLES.Polygon, {
      x: 100, y: 100,
      width: 300, height: 700,
      rotation: 256, pointsCount: 6
    }) as Drawable),
    (DrawableFactory.createFromData(DRAWABLES.Line, {
      x: 800, y: 200,
      width: 300, height: 300
    }) as Drawable),
    (DrawableFactory.createFromData(DRAWABLES.Ellipse, {
      x: 1000, y: 300,
      width: 300, height: 500,
      fill: '#ff6590', rotation: 17
    }) as Drawable)
  ]);

  layersLoaded = new Subject<void>();
  layerClicked = new Subject<number | null>();
  selectedLayers: WritableSignal<Array<number>> = signal([]);
  requestRedraw = new Subject<void>();
  transformBox: TransformBox = new TransformBox();
  zoomService = inject(ZoomAndPanService);

  setTransformBox(): void {
    const selectedLayers = this.selectedLayers();
    const layers = this.layers();
    const selection = selectedLayers.map((i) => layers[i]);
    const scale = this.zoomService.getScale();
    const offset = this.zoomService.getOffset();
    this.transformBox.setSelected(selection, offset, scale);
  }
}
