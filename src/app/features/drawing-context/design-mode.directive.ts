import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { TransformService } from '../../shared/services/transform.service';
import { LayersService } from '../../shared/services/layers.service';
import { ZoomAndPanService } from './zoom-and-pan.service';

@Directive({
  selector: '[uidDesignMode]',
  standalone: true
})
export class DesignModeDirective {

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D | null;
  private transformService = inject(TransformService);
  private layersService = inject(LayersService);
  private zoomService = inject(ZoomAndPanService);

  constructor(private el: ElementRef<HTMLCanvasElement>) { 
    this.canvas = el.nativeElement;
    this.context = el.nativeElement.getContext('2d');
  }

  private mouseDebugging(event: MouseEvent): void {
    const offset = this.zoomService.getOffset();
    const scale = this.zoomService.getScale();
    const mouse = {
      x: (event.offsetX - offset.x) / scale,
      y: (event.offsetY - offset.y) / scale
    };
    console.log(mouse);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      this.transformService.onSelection(event.offsetX, event.offsetY, this.context as CanvasRenderingContext2D);

      if (this.layersService.transformBox?.isPointInside(this.context as CanvasRenderingContext2D, event.offsetX, event.offsetY)) {
        this.transformService.dragInit(event.offsetX, event.offsetY);
      }
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.transformService.onHoverControlPoint(event.offsetX, event.offsetY, this.context as CanvasRenderingContext2D, this.canvas);
  
    if (this.transformService.overControl) {
      console.log('dragging');
    }

    if (this.transformService.isDragging) {
      this.transformService.drag(event.offsetX, event.offsetY);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.transformService.dragEnd();
  }
}
