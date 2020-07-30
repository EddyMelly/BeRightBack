import { detectCollision } from './collisionDetection.js';
import EnemyBullet from './enemyBullet.js';
export default class Fence {
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
    this.bulletSpeedModifier = 0.3;
    this.timer = 0;
    this.intervalLower = 13;
    this.intervalUpper = 35;
    this.shootingInterval =
      Math.floor(Math.random() * this.intervalUpper) + this.intervalLower;
    this.bullets = [];
  }
  update(deltaTime) {
    this.bullets = [...this.bullets];
    this.timer += deltaTime / 1000;
    //console.log(this.timer);
    if (this.timer > this.shootingInterval) {
      this.timer = 0;
      this.shoot();
    }
    if (this.markedForDeletion === false) {
      this.game.player.bullets.forEach((bullet) => {
        if (detectCollision(bullet, this)) {
          bullet.markedForDeletion = true;
          this.break(this.brokenStatus);
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
      if (this.bullets.length < 25) {
        var newBullet = new EnemyBullet(
          this.game,
          this,
          this.bulletSpeedModifier + this.brokenStatus / 10
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
        this.image = document.getElementById('fence2');
        this.brokenStatus++;
        this.playSound(this.impact);
        break;
      case 2:
        this.image = document.getElementById('fence3');
        this.brokenStatus++;
        this.playSound(this.impact);
        break;
      case 3:
        this.image = document.getElementById('fence4');
        this.brokenStatus++;
        this.playSound(this.impact);
        break;
      case 4:
        this.image = document.getElementById('fence5');
        this.brokenStatus++;
        this.playSound(this.impact);
        break;
      case 5:
        this.playSound(this.baserScream);
        this.markedForDeletion = true;
    }
  }

  playSound(sound) {
    let playSound = sound;
    playSound.volume = 0.4;
    playSound.load();
    playSound.play();
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
