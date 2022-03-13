import blessed from 'blessed';
import { Game } from './Game.js';
import { SCREEN, GAME_BOX, NEW_BOX, FLASH_BOX } from './constants.js';
import { inBounds } from './utils.js';

export class UI {
  private game: Game;

  private ids: {
    id: number;
    box: ReturnType<typeof blessed.box>;
  }[] = [];

  screen: blessed.Widgets.Screen;
  gamebox;
  score!: blessed.Widgets.TextElement;
  message!: blessed.Widgets.BoxElement;

  constructor(game: Game) {
    this.screen = blessed.screen(SCREEN);
    this.gamebox = blessed.box(GAME_BOX);
    this.game = game;
    this.init();
    this.showScore(game.getScore());
  }

  init() {
    this.screen.append(this.gamebox);
    this.update();
    this.listenForClose();
  }

  showScore(score: number) {
    this.score?.detach();

    this.score = blessed.text({
      content: `Score: ${score}`,
      top: 0,
      left: 0,
      width: '100%',
      fg: 'white',
      bg: 'grey',
    });

    this.screen.append(this.score);
  }

  private listenForClose() {
    this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  }

  update() {
    this.screen.render();
  }

  clearBox(id?: number) {
    if (!id) return;

    const box = (() => {
      for (const el of this.ids) {
        if (el.id === id) return el.box;
      }
      return null;
    })();

    box?.detach();
    this.update();
  }

  drawBox({ x, y, color, id }: { x: number; y: number; color: 'green' | 'red'; id?: number }) {
    if (this.game.isDead()) return;

    const box = blessed.box(NEW_BOX({ x, y, color }));
    if (id) this.ids.push({ id, box });

    this.gamebox.append(box);

    return box;
  }

  flash() {
    const box = blessed.box(FLASH_BOX);
    this.gamebox.append(box);

    setTimeout(() => {
      box.detach();
      this.update();
    }, 100);
  }

  gameOver() {
    this.message = blessed.box({
      bg: 'grey',
      fg: 'white',
      top: 'center',
      left: 'center',
    });

    const text = blessed.text({
      content: `Game Over
Your score: ${this.game.getScore()}
      `,
      fg: 'white',
      bg: 'grey',
      padding: 2,
    });

    this.message.append(text);
    this.gamebox.append(this.message);
  }
}
