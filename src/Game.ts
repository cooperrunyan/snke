import { UI } from './UI.js';
import { inBounds } from './utils.js';

let maxId = 1;
type Direction = 'left' | 'up' | 'down' | 'right';

type Snake = {
  x: number;
  y: number;
  id: number;
}[];

type Apple = {
  x: number;
  y: number;
};

type AppleIntance = ReturnType<typeof UI.prototype.drawBox>;

export class Game {
  UI = new UI(this);

  dead: boolean = false;
  direction: Direction = 'right';
  canChangeDirection = true;
  score = 5;
  snake!: Snake;
  int!: NodeJS.Timer;
  apple: Apple = { x: 0, y: 0 };
  appleInstance: AppleIntance;

  makeApple() {
    const apple = {
      x: Math.trunc(Math.random() * +this.UI.gamebox.width),
      y: Math.trunc(Math.random() * +this.UI.gamebox.height),
      color: 'red',
    } as const;

    this.apple = apple;
    return apple;
  }

  constructor() {
    this.start();
  }

  start() {
    this.int ? clearInterval(this.int) : null;
    this.dead = false;

    this.UI.screen.detach();
    this.UI = new UI(this);
    this.appleInstance = this.UI.drawBox(this.makeApple()); // create an apple
    this.int = setInterval(this.move.bind(this), 100);
    this.listeners();

    this.snake = [
      { x: 2, y: 2, id: 1 },
      { x: 3, y: 2, id: 2 },
      { x: 4, y: 2, id: 3 },
      { x: 5, y: 2, id: 4 },
      { x: 6, y: 2, id: 5 },
    ];
  }

  stop() {
    this.UI.flash();
    this.UI.update();
    clearInterval(this.int);
    this.dead = true;
    this.UI.gameOver();
  }

  getScore() {
    return this.snake?.length || 0;
  }

  move() {
    if (this.dead) return;
    this.canChangeDirection = true;
    this.UI.clearBox(this.snake[0].id);

    this.snake.push({
      x: this.snake.at(-1)!.x + (this.direction === 'right' ? 1 : this.direction === 'left' ? -1 : 0),
      y: this.snake.at(-1)!.y + (this.direction === 'down' ? 1 : this.direction === 'up' ? -1 : 0),
      id: maxId++,
    });

    this.snake.shift();
    this.UI.showScore(this.getScore());
    this.UI.drawBox({ ...this.snake.at(-1)!, color: 'green' });
    this.check();
  }

  check() {
    for (const pos1 of this.snake) {
      for (const pos2 of this.snake) {
        if (pos1.id !== pos2.id && pos1.x === pos2.x && pos1.y === pos2.y) this.stop();
      }
      if (this.apple.x === pos1.x && this.apple.y === pos1.y) {
        this.add();
      }
    }

    if (!inBounds(this.snake.at(-3)!, this.UI.gamebox)) this.stop();
  }

  isDead() {
    return this.dead;
  }

  add() {
    this.appleInstance?.detach();
    this.snake = [
      {
        x: this.snake.at(0)!.x,
        y: this.snake.at(0)!.y,
        id: maxId++,
      },

      ...this.snake!,
    ];
    this.UI.drawBox({ ...this.snake.at(0)!, color: 'green' });
    this.apple = this.makeApple();
    this.appleInstance = this.UI.drawBox({ ...this.apple, color: 'red' });
  }

  listeners() {
    this.UI.screen.key(['w', 'up'], () => {
      if (this.dead) return;
      if (!this.canChangeDirection) return;
      if (this.direction !== 'down') {
        this.direction = 'up';
        this.canChangeDirection = false;
      }
    });

    this.UI.screen.key(['s', 'down'], () => {
      if (this.dead) return;
      if (!this.canChangeDirection) return;
      if (this.direction !== 'up') {
        this.direction = 'down';
        this.canChangeDirection = false;
      }
    });

    this.UI.screen.key(['a', 'left'], () => {
      if (this.dead) return;
      if (!this.canChangeDirection) return;
      if (this.direction !== 'right') {
        this.direction = 'left';
        this.canChangeDirection = false;
      }
    });

    this.UI.screen.key(['d', 'right'], () => {
      if (this.dead) return;
      if (!this.canChangeDirection) return;
      if (this.direction !== 'left') {
        this.direction = 'right';
        this.canChangeDirection = false;
      }
    });
  }
}
