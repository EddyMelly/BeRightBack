//import { detectCollision } from './collisionDetection.js';

export default class Bullet {
  constructor(game, player) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.image = document.getElementById('bullet');
    this.speed = { x: 0, y: -1 };
    this.player = player;
    this.position = { x: player.position.x + 22, y: player.position.y - 15 };
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
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    if (this.markedForDeletion === true) {
      this.position = { x: 451, y: 801 };
      this.speed = { x: 0, y: 40 };
    }

    //check hit on left or right of area
    if (this.position.x + this.size > this.gameWidth || this.position.x < 0) {
      this.speed.x = -this.speed.x;
    }
    //check hit on top or bottom of area
    if (this.position.y + this.size > this.gameHeight || this.position.y < 0) {
      this.markedForDeletion = true;
    }
  }
}
