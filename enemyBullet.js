import { detectCollision } from './collisionDetection.js';
export default class EnemyBullet {
  constructor(game, fence, speed) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.image = document.getElementById('enemyBullet');
    this.speed = 1 * speed;
    this.fence = fence;
    if (Math.random() >= 0.5) {
      this.position = { x: fence.position.x + 65, y: fence.position.y + 50 };
    } else {
      this.position = { x: fence.position.x + 20, y: fence.position.y + 50 };
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
    //this.position.x += this.speed;
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
