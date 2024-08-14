import { Component, Input } from '@angular/core';
import { UiBoxComponent } from '../../shared/components/ui-box/ui-box.component';

@Component({
  selector: 'uid-color-palette',
  standalone: true,
  imports: [UiBoxComponent],
  templateUrl: './color-palette.component.html',
  styleUrl: './color-palette.component.scss'
})
export class ColorPaletteComponent {
  @Input() height: number = 50;
}
