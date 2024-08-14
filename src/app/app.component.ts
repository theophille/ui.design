import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesignSpaceComponent } from './workspace/design-space/design-space.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { SizesService } from './shared/services/sizes.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DesignSpaceComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  @ViewChild(NavbarComponent) navComponent!: NavbarComponent;
  @ViewChild('content') contentElement!: ElementRef;
  title = 'ui.design';

  constructor(private sizesService: SizesService) {}

  ngAfterViewInit(): void {
    this.setContentHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:Event): void {
    this.setContentHeight();
  }

  setContentHeight(): void {
    const navHeight: number = this.sizesService.navbarHeight;
    const contentHeight: number = window.innerHeight - navHeight - 5;
    this.contentElement.nativeElement.style.height = `${contentHeight}px`;
  }
}
