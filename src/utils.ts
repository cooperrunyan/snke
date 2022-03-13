import blessed from 'blessed';

export function inBounds(box: { x: number; y: number }, parent: ReturnType<typeof blessed.box>) {
  return box.y < +parent.height && box.y >= 0 && box.x >= 0 && box.x < +parent.width;
}
