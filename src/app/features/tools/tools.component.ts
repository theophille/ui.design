import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ToolsService } from './tools.service';
import { Tool } from './tool.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uid-tools',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.scss'
})
export class ToolsComponent implements OnInit {
  tools: WritableSignal<Array<Tool>> = signal([]);
  activeTool!: WritableSignal<number>;

  constructor(private toolsService: ToolsService) {}

  ngOnInit(): void {
    this.tools.set(this.toolsService.getTools());
    this.activeTool = this.toolsService.getActiveTool();
  }

  onToolClick(toolIndex: any): void {
    this.activeTool.set(toolIndex);
  }
}
