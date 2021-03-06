import { detectCollision } from './collisionDetection.js';
import { EnemyBullet } from './enemyBullet.js';
import { playSound } from './playSound.js';
const FENCE2 = document.getElementById('fence2');
const FENCE3 = document.getElementById('fence3');
const FENCE4 = document.getElementById('fence4');
const FENCE5 = document.getElementById('fence5');

export class Fence {
  constructor(game, position) {
    this.image = document.getElementById('fence');
    this.impact = document.getElementById('impact');
    this.baserScream = document.getElementById('baserScream');
    this.game = game;
    this.position = position;
    this.width = 100;
    this.height = 50;
    this.markedForDeletion = false;
    this.brokenStatus = 1;
    this.bulletSpeedModifier = 0.25;
    this.timer = 0;
    this.intervalLower = 13;
    this.intervalUpper = 30;
    this.shootingInterval =
      Math.floor(Math.random() * this.intervalUpper) + this.intervalLower;
    this.bullets = [];
  }
  update(deltaTime) {
    this.bullets = [...this.bullets];
    this.timer += deltaTime / 1000;
    if (this.timer > this.shootingInterval) {
      this.timer = 0;
      this.shoot();
    }
    if (this.markedForDeletion === false) {
      this.game.player.bullets.forEach((bullet) => {
        if (detectCollision(bullet, this)) {
          if (bullet.toxic) {
            this.markedForDeletion = true;
          } else {
            bullet.markedForDeletion = true;
            this.break(this.brokenStatus);
          }
        }
      });
    }

    this.bullets.forEach((bullet) => {
      bullet.update();
    });
    this.bullets = this.bullets.filter((object) => !object.markedForDeletion);
  }

  shoot() {
    if (this.markedForDeletion === false) {
      if (this.bullets.length < 4) {
        var newBullet = new EnemyBullet(
          this.game,
          this,
          this.bulletSpeedModifier + this.brokenStatus / 12
        );
        this.bullets.push(newBullet);
        this.shootingInterval =
          Math.floor(Math.random() * this.intervalUpper) + this.intervalLower;
      }
    }
  }

  break(brokenStatus) {
    switch (brokenStatus) {
      case 1:
        this.image = FENCE2;
        this.brokenStatus++;
        playSound(this.impact);
        break;
      case 2:
        this.image = FENCE4;
        this.brokenStatus++;
        playSound(this.impact);
        break;
      case 3:
        this.image = FENCE5;
        this.brokenStatus++;
        playSound(this.impact);
        break;
      case 4:
        playSound(this.baserScream);
        this.markedForDeletion = true;
        this.game.player.fasterBullets();
        if (Math.random() >= 0.75) {
          this.game.player.tripleFireOn();
        }
    }
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    this.bullets.forEach((object) => object.draw(ctx));
  }
}

export class BossFence extends Fence {
  constructor(game, position) {
    super(game, position);
    this.position = { x: position.x, y: position.y + 50 };
  }

  break(brokenStatus) {
    switch (brokenStatus) {
      case 1:
        this.image = FENCE2;
        this.brokenStatus++;
        playSound(this.impact);
        break;
      case 2:
        this.image = FENCE3;
        this.brokenStatus++;
        playSound(this.impact);
        break;
      case 3:
        this.image = FENCE4;
        this.brokenStatus++;
        playSound(this.impact);
        break;
      case 4:
        playSound(this.impact);
        this.markedForDeletion = true;
    }
  }

  update(deltaTime) {
    if (this.markedForDeletion === false) {
      this.game.player.bullets.forEach((bullet) => {
        if (detectCollision(bullet, this)) {
          if (bullet.toxic) {
            this.markedForDeletion = true;
          } else {
            bullet.markedForDeletion = true;
            this.break(this.brokenStatus);
          }
        }
      });
    }
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
}
