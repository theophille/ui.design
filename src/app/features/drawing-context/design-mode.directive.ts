import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { ZoomAndPanService } from './zoom-and-pan.service';
import { LayersService } from '../layers/layers.service';
import { Vec2 } from '../../engine/utils/math.utils';
import { Drawable } from '../../engine/drawables/drawable';

@Directive({
  selector: '[uidDesignMode]',
  standalone: true
})
export class DesignModeDirective {

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D | null;
  private zoomAndPanService = inject(ZoomAndPanService);
  private layersService = inject(LayersService);

  constructor(private el: ElementRef<HTMLCanvasElement>) { 
    this.canvas = el.nativeElement;
    this.context = el.nativeElement.getContext('2d');
  }

  private clickInsideDrawable(mouse: Vec2, drawable: Drawable): boolean {
    return (this.context?.isPointInPath(drawable.path, mouse.x, mouse.y) as boolean) ||
      (this.context?.isPointInStroke(drawable.path, mouse.x, mouse.y) as boolean);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      const t = this.zoomAndPanService.getViewTransform();
      const mouse: Vec2 = {
        x: Math.round((event.offsetX - t.offset.x) / t.scale),
        y: Math.round((event.offsetY - t.offset.y) / t.scale)
      };
      
      const layers = this.layersService.layers();
      let clickedLayer = null;
      let isDrawable: boolean = false;

      for (let i = 0; i < layers.length; i++) {
        if (layers[i] instanceof Drawable) {
          const drawable = (layers[i] as Drawable);
          if ((isDrawable = this.clickInsideDrawable(mouse, drawable))) {
            clickedLayer = i;
            break;
          }
        }
      }

      if (!isDrawable) {
        this.layersService.layerClicked.next(null);
      }

      if (clickedLayer !== null) {
        this.layersService.layerClicked.next(clickedLayer);
      }
    }
  }

}
