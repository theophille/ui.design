import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SizesService } from '../../shared/services/sizes.service';

@Component({
  selector: 'uid-drawing-context',
  standalone: true,
  imports: [],
  templateUrl: './drawing-context.component.html',
  styleUrl: './drawing-context.component.scss'
})
export class DrawingContextComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D | null;

  constructor(private sizesService: SizesService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event:Event): void {
    this._setCanvasSize();
  }
  
  ngAfterViewInit(): void {
    this._setCanvasSize();
    this.context = this.canvas.nativeElement.getContext('2d');
    console.log(this.context);
  }

  private _setCanvasSize(): void {
    const navHeight: number = this.sizesService.navbarHeight;
    const contentHeight: number = window.innerHeight - navHeight - 5;
    this.canvas.nativeElement.height = contentHeight;
    this.canvas.nativeElement.width = window.innerWidth - 2 * this.sizesService.boxGroupWidth - 10;
  }
}
