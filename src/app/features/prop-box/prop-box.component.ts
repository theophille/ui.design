import { Component, Input } from '@angular/core';
import { UiBoxComponent } from '../../shared/components/ui-box/ui-box.component';

@Component({
  selector: 'uid-prop-box',
  standalone: true,
  imports: [UiBoxComponent],
  templateUrl: './prop-box.component.html',
  styleUrl: './prop-box.component.scss'
})
export class PropBoxComponent {
  @Input() height: number = 50;
}
