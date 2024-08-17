import { Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { UiBoxComponent } from '../../shared/components/ui-box/ui-box.component';
import { Layers, LayersService } from './layers.service';
import { Shape } from '../../engine/drawables/shape';
import { BoxListItemComponent } from '../../shared/components/ui-box/box-list-item/box-list-item.component';
import { Icons, TOOL_ICONS } from '../../engine/constants/constants';
import { Drawable } from '../../engine/drawables/drawable';
import { Polygon } from '../../engine/drawables/polygon';

@Component({
  selector: 'uid-layers',
  standalone: true,
  imports: [UiBoxComponent, BoxListItemComponent],
  templateUrl: './layers.component.html',
  styleUrl: './layers.component.scss'
})
export class LayersComponent implements OnInit {
  @Input() height: number = 50;
  layers!: WritableSignal<Layers>;
  layersListData: any[] = [];
  selectedLayer: WritableSignal<number> = signal(-1);
  
  private layersService = inject(LayersService);

  ngOnInit(): void {
    this.layers = this.layersService.layers;

    this.layersService.layersLoaded.subscribe(() => {
      const layers = this.layers();
      const icons = TOOL_ICONS;

      for (let i = 0; i < layers.length; i++) {
        if (layers[i] instanceof Drawable) {
          const className = (layers[i].constructor.name.toLowerCase() as Icons);
          this.layersListData.push({
            icon: icons[className],
            label: (layers[i] as Drawable).label
          });
        }
      }
    });

    this.layersService.layerClicked.subscribe((layerIndex: number | null) => {
      if (layerIndex !== null) {
        this.selectedLayer.set(layerIndex);
      } else {
        this.selectedLayer.set(-1);
      }
    });

    this.layersService.layersLoaded.next();
  }

  
}
