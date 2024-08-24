import { Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { UiBoxComponent } from '../../shared/components/ui-box/ui-box.component';
import { LayersService } from '../../shared/services/layers.service';
import { Drawable } from '../../engine/drawables/drawable';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransformService } from '../../shared/services/transform.service';

@Component({
  selector: 'uid-prop-box',
  standalone: true,
  imports: [UiBoxComponent, ReactiveFormsModule],
  templateUrl: './prop-box.component.html',
  styleUrl: './prop-box.component.scss'
})
export class PropBoxComponent implements OnInit {
  @Input() height: number = 50;

  private selectedLayer:  WritableSignal<Drawable | null> = signal(null);
  private layersService = inject(LayersService);
  private transformService = inject(TransformService);

  active: WritableSignal<boolean> = signal(false);
  props = new FormGroup({
    transform: new FormGroup({
      x: new FormControl(''),
      y: new FormControl(''),
      width: new FormControl(''),
      height: new FormControl(''),
      rotation: new FormControl('')
    })
  });
  
  ngOnInit(): void {
    this.layersService.layerClicked.subscribe((index: number | null) => {
      if (index !== null) {
        this.active.set(true);
        this.fillForm(index);
      } else {
        this.active.set(false);
      }
    });

    this.transformService.dragging.subscribe(() => {
      this.fillForm();
    });
  }

  private fillForm(index?: number | null): void {
    let drawable: any;

    if (index !== null && index !== undefined) {
      drawable = this.layersService.layers()[index];
    } else {
      drawable = this.selectedLayer();
    }

    const transform = this.props.controls.transform.controls;
    this.selectedLayer.set(drawable);

    for (const key in transform) {
      transform[key as keyof typeof transform].setValue(Math.round(drawable[key as keyof typeof transform]).toString());
    }
  }

  updateData(key: string): void {
    const transform = this.props.controls.transform.controls;
    const k = key as keyof typeof transform;
    const value = transform[k].value;
    const sl = this.selectedLayer();
    if (sl) {
      sl[k] = Number(value);
    }
    this.layersService.setTransformBox();
    this.layersService.requestRedraw.next();
  }
}
