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
  isDragging: boolean = false;
  dragOffset!: Vec2;
  overControl: boolean = false;

  private layersService = inject(LayersService);
  private zoomAndPanService = inject(ZoomAndPanService);
  private keyboardService = inject(KeyboardService);

  private prevClick!: Vec2;
  private currClick!: Vec2;

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
    const transformBox = this.layersService.transformBox;
    if (!transformBox) {
      return;
    }
    
    const controls = this.layersService.transformBox ? this.layersService.transformBox.controls : [];

    for (let i = 0; i < controls.length; i++) {

      if (context?.isPointInPath(controls[i].path, mouseX, mouseY)) {
        canvas.style.cursor = 'crosshair';
        this.overControl = true;
        return;
      }
    }

    this.overControl = false;
    canvas.style.cursor = 'default';
  }

  dragInit(mouseX: number, mouseY: number): void {
    const box = this.layersService.transformBox;
    const offset = this.zoomAndPanService.getOffset();
    const scale = this.zoomAndPanService.getScale();
    const mouse = {
      x: (mouseX - offset.x) / scale,
      y: (mouseY - offset.y) / scale
    };

    this.isDragging = true;

    this.prevClick = {
      x: mouse.x,
      y: mouse.y
    };
  }

  drag(mouseX: number, mouseY: number): void {
    const selectedLayers = this.layersService.selectedLayers();
    const layers = this.layersService.layers();
    const offset = this.zoomAndPanService.getOffset();
    const scale = this.zoomAndPanService.getScale();
    const mouse = {
      x: (mouseX - offset.x) / scale,
      y: (mouseY - offset.y) / scale
    };
    const delta = {
      x: mouse.x - this.prevClick.x,
      y: mouse.y - this.prevClick.y
    };

    for (let i = 0; i < selectedLayers.length; i++) {
      const drawable = layers[selectedLayers[i]];
      drawable.setTraslate(drawable.x + delta.x, drawable.y + delta.y);
    }

    this.layersService.setTransformBox();
    this.layersService.requestRedraw.next();

    this.prevClick = {
      x: mouse.x,
      y: mouse.y
    };
  }

  dragEnd() {
    this.isDragging = false;
  }
}
