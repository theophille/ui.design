import { Component, inject, Input } from '@angular/core';
import { UiBoxComponent } from '../../shared/components/ui-box/ui-box.component';
import { PagesBoxService } from './pages-box.service';

@Component({
  selector: 'uid-pages-box',
  standalone: true,
  imports: [UiBoxComponent],
  templateUrl: './pages-box.component.html',
  styleUrl: './pages-box.component.scss'
})
export class PagesBoxComponent {
  @Input() height: number = 50;

  private pagesService = inject(PagesBoxService);

  
}
