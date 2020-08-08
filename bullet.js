export class Bullet {
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

  setDiagonal(direction) {
    if (direction === 'left') {
      this.speed = { x: -0.4, y: -1 };
    } else {
      this.speed = { x: 0.4, y: -1 };
    }
  }

  update(deltaTime) {
    this.position.x += this.speed.x;
    this.position.y += this.speed.y - this.player.bulletSpeedMultiplier;

    if (this.markedForDeletion === true) {
      this.position = { x: 451, y: 801 };
      this.speed = { x: 0, y: 40 };
    }

    //check hit on top or bottom of area
    if (this.position.y + this.size > this.gameHeight || this.position.y < 0) {
      this.markedForDeletion = true;
    }
  }
}

export class ToxicBullet extends Bullet {
  constructor(game, player) {
    super(game, player);
    this.image = document.getElementById('toxicBullet');
    this.speed = { x: 0, y: -2.5 };
    this.toxic = true;
    this.position = { x: player.position.x + 12, y: player.position.y - 15 };
    this.size = 25;
  }

  draw(ctx) {
    super.draw(ctx);
  }

  update(deltaTime) {
    super.update(deltaTime);
  }
}
