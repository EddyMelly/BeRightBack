import { detectCollision } from './collisionDetection.js';
const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  VICTORY: 2,
  GAMEOVER: 3,
  CUTSCENE: 4,
  BOSSFIGHT: 5,
};
export class EnemyBullet {
  constructor(game, enemy, speed) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.image = document.getElementById('enemyBullet');
    this.speed = 1 * speed;
    this.fence = enemy;
    if (Math.random() >= 0.5) {
      this.position = { x: enemy.position.x + 65, y: enemy.position.y + 50 };
    } else {
      this.position = { x: enemy.position.x + 20, y: enemy.position.y + 50 };
    }

    this.size = 10;
    this.game = game;
    this.markedForDeletion = false;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }

  update(deltaTime) {
    this.position.y += this.speed;

    if (this.position.y + this.size > this.gameHeight || this.position.y < 0) {
      this.markedForDeletion = true;
    }

    if (detectCollision(this, this.game.player)) {
      this.game.player.hit();
      this.markedForDeletion = true;
    }
  }
}

export class TomatoBullet extends EnemyBullet {
  constructor(game, enemy, speed) {
    super(game, enemy, speed);
    this.image = document.getElementById('tomatoBullet');
    this.size = 11;
    this.position = { x: enemy.position.x + 12, y: enemy.position.y + 50 };
  }

  draw(ctx) {
    super.draw(ctx);
  }
  update(deltaTime) {
    super.update(deltaTime);
  }
}

export class ClipBullet extends EnemyBullet {
  constructor(game, enemy, speed, positionX) {
    super(game, enemy, speed);
    this.image = document.getElementById('clipBullet');
    this.size = 50;
    this.position = { x: positionX, y: 0 };
  }

  draw(ctx) {
    super.draw(ctx);
  }
  update(deltaTime) {
    this.position.y += this.speed;

    if (this.position.y + this.size > this.gameHeight || this.position.y < 0) {
      this.markedForDeletion = true;
    }

    if (detectCollision(this, this.game.player)) {
      this.game.gamestate = GAMESTATE.GAMEOVER;
    }
  }
}
