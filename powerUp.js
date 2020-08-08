import { powerUpCollision } from './collisionDetection.js';
export class PowerUp {
  constructor(game, player) {
    this.game = game;
    this.player = player;
    if (this.player.position.x < this.game.gameWidth / 2) {
      if (Math.random() >= 0.5) {
        this.position = { x: 550, y: this.player.position.y };
      } else {
        this.position = { x: 600, y: this.player.position.y };
      }
    } else {
      if (Math.random() >= 0.5) {
        this.position = { x: 150, y: this.player.position.y };
      } else {
        this.position = { x: 200, y: this.player.position.y };
      }
    }

    this.markedForDeletion = false;
  }

  update(deltaTime) {}

  draw(ctx) {
    ctx.drawImage(this.image, this.position.x, this.position.y, 50, 50);
  }
}

export class AutomaticPowerUp extends PowerUp {
  constructor(game, player) {
    super(game, player);
    this.image = document.getElementById('ceremorTense');
    this.appearTimeLower = 0;
    this.appearTimeUpper = 20;
  }

  draw(ctx) {
    super.draw(ctx);
  }

  update(deltaTime) {
    this.appearTimeLower += deltaTime / 1000;
    if (this.appearTimeStart > this.appearTimeUpper) {
      this.markedForDeletion = true;
    }
    if (powerUpCollision(this.player, this)) {
      this.player.automaticOn();
      this.markedForDeletion = true;
    }
  }
}

export class ToxicPowerUp extends PowerUp {
  constructor(game, player) {
    super(game, player);
    this.image = document.getElementById('ceremorTense');
    this.appearTimeLower = 0;
    this.appearTimeUpper = 20;
  }

  draw(ctx) {
    super.draw(ctx);
  }

  update(deltaTime) {
    this.appearTimeLower += deltaTime / 1000;
    if (this.appearTimeStart > this.appearTimeUpper) {
      this.markedForDeletion = true;
    }
    if (powerUpCollision(this.player, this)) {
      this.player.toxicBulletOn();
      this.markedForDeletion = true;
    }
  }
}

export class TriplePowerUp extends PowerUp {
  constructor(game, player) {
    super(game, player);
    this.image = document.getElementById('ceremorTense');
    this.appearTimeLower = 0;
    this.appearTimeUpper = 20;
  }

  draw(ctx) {
    super.draw(ctx);
  }

  update(deltaTime) {
    this.appearTimeLower += deltaTime / 1000;
    if (this.appearTimeStart > this.appearTimeUpper) {
      this.markedForDeletion = true;
    }
    if (powerUpCollision(this.player, this)) {
      this.player.tripleFireOn();
      this.markedForDeletion = true;
    }
  }
}
