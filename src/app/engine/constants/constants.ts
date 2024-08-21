import { Vec2 } from "../utils/math.utils";

export const FILL_DEFAULT: string = '#51a2ff';
export const BORDER_DEFAULT: string = '#0077ee';
export const STROKE_SIZE_DEFAULT: number = 3;

export const TOOLS = [
  { tool: 'select', label: 'Select Tool', icon: 'assets/icons/tools/select.png' },
  { tool: 'rectangle', label: 'Rectangle Tool', icon: 'assets/icons/tools/square.png' },
  { tool: 'ellipse', label: 'Ellipse Tool', icon: 'assets/icons/tools/circle.png' },
  { tool: 'polygon', label: 'Polygon Tool', icon: 'assets/icons/tools/triangle.png' },
  { tool: 'line', label: 'Line Tool', icon: 'assets/icons/tools/line.png' },
  { tool: 'pen', label: 'Pen Tool Tool', icon: 'assets/icons/tools/pen-tool.png' },
  { tool: 'text', label: 'Text Tool', icon: 'assets/icons/tools/text.png' },
  { tool: 'zoom', label: 'Zoom Tool', icon: 'assets/icons/tools/zoom.png' }
];

export const TOOL_ICONS = {
  select: 'assets/icons/tools/select.png',
  rectangle: 'assets/icons/tools/square.png',
  ellipse: 'assets/icons/tools/circle.png',
  polygon: 'assets/icons/tools/triangle.png',
  line: 'assets/icons/tools/line.png',
  customShape: 'assets/icons/tools/pen-tool.png',
  text: 'assets/icons/tools/text.png',
  zoom: 'assets/icons/tools/zoom.png'
}

export type Icons = 'select' | 'rectangle' | 'ellipse' | 'polygon' | 'line' | 'customShape' | 'text' | 'zoom';

export const DRAWABLES_LABELS = {
  rectangle: 'Rectangle',
  ellipse: 'Ellipse',
  polygon: 'Polygon',
  line: 'Line',
  customShape: 'CustomShape',
  text: 'Text',
  image: 'Image'
}

export const enum DRAWABLES {
  Rectangle,
  Ellipse,
  Polygon,
  Line,
  CustomShape,
  Text,
  Image
}

export const ctrlSign: Array<Vec2> = [
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 0 },
  { x: 1, y: -1 },
  { x: 0, y: -1 },
  { x: -1, y: -1 },
  { x: -1, y: 0 }
];