import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ViewChild, WritableSignal } from '@angular/core';
import { SizesService } from '../../shared/services/sizes.service';
import { ZoomAndPanDirective } from './zoom-and-pan.directive';
import { ZoomAndPanService } from './zoom-and-pan.service';
import { PagesBoxService } from '../pages-box/pages-box.service';
import { UIPage } from '../pages-box/page.model';
import { Layers, LayersService } from '../../shared/services/layers.service';
import { DesignModeDirective } from './design-mode.directive';
import { Drawable } from '../../engine/drawables/drawable';

@Component({
  selector: 'uid-drawing-context',
  standalone: true,
  imports: [ZoomAndPanDirective, DesignModeDirective],
  templateUrl: './drawing-context.component.html',
  styleUrl: './drawing-context.component.scss'
})
export class DrawingContextComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') private canvas!: ElementRef<HTMLCanvasElement>;
  
  private context!: CanvasRenderingContext2D | null;
  private pageData!: UIPage;
  private layers!: WritableSignal<Layers>;

  private zoomAndPanService = inject(ZoomAndPanService);
  private sizesService = inject(SizesService);
  private pagesService = inject(PagesBoxService);
  private layersService = inject(LayersService);

  ngOnInit(): void {
    this.context?.save();
    this.pageData = this.pagesService.selectedPageData;
    this.layers = this.layersService.layers;

    this.zoomAndPanService.viewChanged.subscribe(() => {
      this.draw();
    });

    this.pagesService.pageChanged.subscribe(() => {
      this.pageData = this.pagesService.selectedPageData;

      const scale = this.getInitialViewScale()
      
      this.zoomAndPanService.setOffset({
        x: this.canvas.nativeElement.width / 2 - scale * this.pageData.width / 2,
        y: this.canvas.nativeElement.height / 2 - scale * this.pageData.height / 2
      });

      this.zoomAndPanService.setScale(scale);

      this.draw();
    });

    this.layersService.requestRedraw.subscribe(() => {
      this.draw();
    });
  }
  
  ngAfterViewInit(): void {
    this.setCanvasSize();
    this.context = this.canvas.nativeElement.getContext('2d');
  }

  private renderLayers(): void {
    const layers = this.layers();

    for (let i = layers.length - 1; i >= 0; i--) {
      if (layers[i] instanceof Drawable) {
        (layers[i] as Drawable).draw(this.context as CanvasRenderingContext2D);
      }
    }
  }

  private draw(): void {
    const t = this.zoomAndPanService.getViewTransform();
    this.context?.save();
    this.clear();
    this.context?.translate(t.offset.x, t.offset.y);
    this.context?.scale(t.scale, t.scale);

    this.context!.fillStyle = 'white';
    this.context!.fillRect(0, 0, this.pageData.width, this.pageData.height);

    this.renderLayers();
    const box = this.layersService.transformBox;

    if (!box.hidden) {
      box.draw(this.context as CanvasRenderingContext2D, this.zoomAndPanService.getOffset(), this.zoomAndPanService.getScale());
    }

    this.context?.restore();
  }
  
  private clear(): void {
    this.context?.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }
  
  private setCanvasSize(): void {
    const navHeight: number = this.sizesService.navbarHeight;
    const contentHeight: number = window.innerHeight - navHeight - 5;
    this.canvas.nativeElement.height = contentHeight;
    this.canvas.nativeElement.width = window.innerWidth - 2 * this.sizesService.boxGroupWidth - 10;
  }

  private getInitialViewScale() {
    let scale;
    const canvas = this.canvas.nativeElement;
    const pageRatio = this.pageData.width / this.pageData.height;
    const canvasRatio = canvas.width / canvas.height;

    if (pageRatio >= canvasRatio) {
      scale = (canvas.width - 30) / this.pageData.width;
    } else {
      scale = (canvas.height - 30) / this.pageData.height;
    }

    return scale;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.setCanvasSize();
    this.draw();
  }
}
