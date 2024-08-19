import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { ZoomAndPanService } from './zoom-and-pan.service';
import { LayersService } from '../../shared/services/layers.service';
import { Vec2 } from '../../engine/utils/math.utils';
import { Drawable } from '../../engine/drawables/drawable';
import { KeyboardService } from '../../core/services/keyboard.service';
import { KEYS } from '../../core/constants/constants';
import { TransformService } from '../../shared/services/transform.service';

@Directive({
  selector: '[uidDesignMode]',
  standalone: true
})
export class DesignModeDirective {

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D | null;
  private transformService = inject(TransformService);

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
      this.transformService.onSelection(event.offsetX, event.offsetY, this.context as CanvasRenderingContext2D);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.transformService.onHoverControlPoint(event.offsetX, event.offsetY, this.context as CanvasRenderingContext2D, this.canvas);
  }
}
