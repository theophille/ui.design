import { Injectable, signal, WritableSignal } from '@angular/core';
import { Tool } from './tool.model';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  private activeTool: WritableSignal<number> = signal(0);
  
  private tools: Array<Tool> = [
    { name: 'Select Tool', icon: 'assets/icons/tools/select.png' },
    { name: 'Rectangle Tool', icon: 'assets/icons/tools/square.png' },
    { name: 'Ellipsis Tool', icon: 'assets/icons/tools/circle.png' },
    { name: 'Polygon Tool', icon: 'assets/icons/tools/triangle.png' },
    { name: 'Line Tool', icon: 'assets/icons/tools/line.png' },
    { name: 'Pen Tool Tool', icon: 'assets/icons/tools/pen-tool.png' },
    { name: 'Text Tool', icon: 'assets/icons/tools/text.png' },
    { name: 'Zoom Tool', icon: 'assets/icons/tools/zoom.png' }
  ];

  getActiveTool(): WritableSignal<number> {
    return this.activeTool;
  }

  setActiveTool(activeToolIndex: number): void {
    this.activeTool.set(activeToolIndex);
  }

  getTools(): Array<Tool> {
    return this.tools;
  }
}
