import {
  zombieCollision,
  zombieBulletCollision,
} from './collisionDetection.js';
export default class Zombie {
  constructor(player, game) {
    this.player = player;
    this.game = game;
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.zombieScream = document.getElementById('baserScream');

    if (player.position.x >= game.gameWidth / 2) {
      this.speed = { x: -0.35, y: 0.35 };
      this.position = {
        x: player.position.x + 400,
        y: player.position.y - 400,
      };
      this.image = document.getElementById('zombie1');
    } else {
      this.speed = { x: 0.35, y: 0.35 };
      this.position = {
        x: player.position.x - 400,
        y: player.position.y - 400,
      };
      this.image = document.getElementById('zombie2');
    }

    this.size = 50;

    this.markedForDeletion = false;

    this.width = 50;
    this.height = 50;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  playSound(sound) {
    let playSound = sound;
    playSound.volume = 0.4;
    playSound.load();
    playSound.play();
  }

  update(deltaTime) {
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    if (this.position.y + this.size > this.gameHeight || this.position.y < 0) {
      this.markedForDeletion = true;
    }

    if (zombieCollision(this, this.player)) {
      this.player.hit();
      this.markedForDeletion = true;
    }
    if (this.markedForDeletion === false) {
      this.player.bullets.forEach((bullet) => {
        if (zombieBulletCollision(this, bullet)) {
          this.playSound(this.zombieScream);
          this.markedForDeletion = true;
          bullet.markedForDeletion = true;
        }
      });
    }
  }
}
