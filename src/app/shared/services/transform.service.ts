import { inject, Injectable } from '@angular/core';
import { LayersService } from './layers.service';
import { ZoomAndPanService } from '../../features/drawing-context/zoom-and-pan.service';
import { KeyboardService } from '../../core/services/keyboard.service';
import { KEYS } from '../../core/constants/constants';
import { Drawable } from '../../engine/drawables/drawable';
import { Vec2 } from '../../engine/utils/math.utils';

@Injectable({
  providedIn: 'root'
})
export class TransformService {
  private layersService = inject(LayersService);
  private zoomAndPanService = inject(ZoomAndPanService);
  private keyboardService = inject(KeyboardService);

  private clickInsideDrawable(mouse: Vec2, drawable: Drawable, context: CanvasRenderingContext2D): boolean {
    return (context?.isPointInPath(drawable.path, mouse.x, mouse.y) as boolean) ||
      (context?.isPointInStroke(drawable.path, mouse.x, mouse.y) as boolean);
  }

  onSelection(mouseX: number, mouseY: number, context: CanvasRenderingContext2D): void {
    const t = this.zoomAndPanService.getViewTransform();
    const mouse: Vec2 = {
      x: Math.round((mouseX - t.offset.x) / t.scale),
      y: Math.round((mouseY - t.offset.y) / t.scale)
    };
    
    const layers = this.layersService.layers();
    let clickedLayer = null;

    for (let i = 0; i < layers.length; i++) {
      if (layers[i] instanceof Drawable) {
        const drawable = (layers[i] as Drawable);
        if (this.clickInsideDrawable(mouse, drawable, context)) {
          clickedLayer = i;
          break;
        }
      }
    }

    if (!this.keyboardService.isPressed(KEYS.shift) &&
      !this.layersService.transformBox?.isPointInside(context as CanvasRenderingContext2D, mouseX, mouseY)) {
      
        this.layersService.layerClicked.next(null);
    }

    if (clickedLayer !== null) {
      this.layersService.layerClicked.next(clickedLayer);
    }
  }

  onHoverControlPoint(mouseX: number, mouseY: number, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const controls = this.layersService.transformBox ? this.layersService.transformBox.controls : [];
    const cursors = ['nesw-resize', 'ns-resize', 'nwse-resize', 'ew-resize'];

    for (let i = 0; i < controls.length; i++) {

      if (context?.isPointInPath(controls[i].path, mouseX, mouseY)) {
        canvas.style.cursor = cursors[i % 4];
        return;
      } 
    }

    canvas.style.cursor = 'default';
  }
}
