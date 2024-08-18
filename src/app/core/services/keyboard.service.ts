import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  keysPressed: Array<string> = [];

  addKey(key: string): void {
    this.keysPressed.push(key);
  }
  
  removeKey(key: string): void {
    const i = this.keysPressed.indexOf(key);
    this.keysPressed.splice(i, 1);
  }

  isPressed(key: string): boolean {
    return this.keysPressed.includes(key);
  }
}
