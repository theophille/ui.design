import { Component, Input } from '@angular/core';
import { UiBoxComponent } from '../../shared/components/ui-box/ui-box.component';

@Component({
  selector: 'uid-layers',
  standalone: true,
  imports: [UiBoxComponent],
  templateUrl: './layers.component.html',
  styleUrl: './layers.component.scss'
})
export class LayersComponent {
  @Input() height: number = 50;
}
