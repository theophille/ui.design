import { Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { UiBoxComponent } from '../../shared/components/ui-box/ui-box.component';
import { Layers, LayersService } from '../../shared/services/layers.service';
import { Shape } from '../../engine/drawables/shape';
import { BoxListItemComponent } from '../../shared/components/ui-box/box-list-item/box-list-item.component';
import { Icons, TOOL_ICONS } from '../../engine/constants/constants';
import { Drawable } from '../../engine/drawables/drawable';
import { Polygon } from '../../engine/drawables/polygon';
import { KeyboardService } from '../../core/services/keyboard.service';
import { KEYS } from '../../core/constants/constants';

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
  selectedLayers!: WritableSignal<Array<number>>;
  
  private layersService = inject(LayersService);
  private keyboardService = inject(KeyboardService);

  ngOnInit(): void {
    this.layers = this.layersService.layers;
    this.selectedLayers = this.layersService.selectedLayers;

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
      this.handleSelection(layerIndex, KEYS.shift);
    });

    this.layersService.layersLoaded.next();
  }

  public onClick(layerIndex: number): void {
    this.handleSelection(layerIndex, KEYS.control);
  }
  
  private handleSelection(layerIndex: number | null, key: string) {
    const selectedLayers = this.selectedLayers();
    
    if (this.keyboardService.isPressed(key)) {
      const indexInSelected = selectedLayers.indexOf(layerIndex as number);
    
      if (indexInSelected >= 0) {
        selectedLayers.splice(indexInSelected, 1);
      } else {
        selectedLayers.push(layerIndex as number);
      }
    } else if (layerIndex !== null && !selectedLayers.includes(layerIndex)) {
      this.selectedLayers.set([layerIndex]);
    } else if (layerIndex === null) {
      this.selectedLayers.set([]);
    }

    this.layersService.setTransformBox();
    this.layersService.requestRedraw.next();
  }
}
