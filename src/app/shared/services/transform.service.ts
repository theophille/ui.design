import { inject, Injectable } from '@angular/core';
import { LayersService } from './layers.service';
import { ZoomAndPanService } from '../../features/drawing-context/zoom-and-pan.service';
import { KeyboardService } from '../../core/services/keyboard.service';
import { KEYS } from '../../core/constants/constants';
import { Drawable } from '../../engine/drawables/drawable';
import { Vec2 } from '../../engine/utils/math.utils';
import { TransformBox } from '../../engine/drawables/transformBox';
import { ctrlSign } from '../../engine/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class TransformService {
  isDragging: boolean = false;
  isTransforming: boolean = false;
  dragOffset!: Vec2;
  overControl: number | null = null;
  controlPosition!: Vec2;
  transDirection!: Vec2;

  private layersService = inject(LayersService);
  private zoomAndPanService = inject(ZoomAndPanService);
  private keyboardService = inject(KeyboardService);

  private prevClick!: Vec2;

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
        this.overControl = i;
        return;
      }
    }

    this.overControl = null;
    canvas.style.cursor = 'default';
  }

  dragInit(mouseX: number, mouseY: number): void {
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

  transformInit(mouseX: number, mouseY: number): void {
    const box = this.layersService.transformBox as TransformBox;
    this.transDirection = box.normals[this.overControl as number];
    this.controlPosition = box.controls[this.overControl as number].getPosition();
    this.isTransforming = true;
  }
  
  transform(mouseX: number, mouseY: number): void {
    let box = this.layersService.transformBox as TransformBox;
    const selectedLayers = this.layersService.selectedLayers();
    const layers = this.layersService.layers();
    const offset = this.zoomAndPanService.getOffset();
    const scale = this.zoomAndPanService.getScale();
    const mouseVector = {
      x: (mouseX - offset.x) / scale - (this.controlPosition.x - offset.x) / scale,
      y: (mouseY - offset.y) / scale - (this.controlPosition.y - offset.y) / scale
    };
    
    const t = mouseVector.x * this.transDirection.x + mouseVector.y * this.transDirection.y;
    
    for (let i = 0; i < selectedLayers.length; i++) {
      const drawable = layers[selectedLayers[i]];
      const ratio = drawable.width / drawable.height
      const delta = ctrlSign[this.overControl as number].y * t * this.transDirection.y
      drawable.setSize(
        (drawable.height + delta) * ratio,
        drawable.height + delta
      );
    }
    
    
    box = this.layersService.transformBox as TransformBox;
    this.layersService.setTransformBox();
    this.transDirection = box.normals[this.overControl as number];
    this.controlPosition = box.controls[this.overControl as number].getPosition();
    this.layersService.requestRedraw.next();

  }

  endTransform(): void {
    this.overControl = null;
    this.isTransforming = false;
  }
}
