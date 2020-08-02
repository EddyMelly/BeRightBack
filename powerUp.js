import { powerUpCollision } from './collisionDetection.js';
export default class PowerUp {
  constructor(game, player) {
    this.game = game;
    this.player = player;
    if (this.player.position.x < this.game.gameWidth / 2) {
      this.position = { x: 600, y: this.player.position.y };
    } else {
      this.position = { x: 150, y: this.player.position.y };
    }
    this.image = document.getElementById('ceremorTense');
    this.active = true;
    this.appearTime = 10;
    this.appearTimeStart = 0;
  }

  update(deltaTime) {
    this.appearTimeStart += deltaTime / 1000;
    if (this.appearTimeStart > 14) {
      this.active = false;
    }
    if (powerUpCollision(this.player, this)) {
      this.player.automaticOn();
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.position.x, this.position.y, 50, 50);
  }
}
