import Bullet from './bullet.js';
import Zombie from './zombie.js';
const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
};
export default class Player {
  constructor(game) {
    this.width = 50;
    this.game = game;
    this.height = 50;
    this.maxSpeed = 50;
    this.bullets = [];
    this.image = document.getElementById('ceremorOver');
    this.gunshot = document.getElementById('gunshot');
    this.footstep = document.getElementById('footstep');
    this.ceremorScream = document.getElementById('ceremorScream');
    this.speed = 0;
    this.gameWidth = game.gameWidth;
    let xPosition = 300;
    let yPosition = game.gameHeight - this.height;
    this.canFire = true;
    this.hurtStatus = 1;
    this.zombies = [];
    this.position = { x: xPosition, y: yPosition };
  }

  moveLeft() {
    this.position.x = this.position.x - this.width;
    this.canFire = true;
    this.playSound(this.footstep);
  }

  moveRight() {
    this.position.x = this.position.x + this.width;
    this.canFire = true;
    this.playSound(this.footstep);
  }

  shoot() {
    if (this.canFire === true) {
      var newBullet = new Bullet(this.game, this);
      this.bullets.push(newBullet);
      //var newZombie = new Zombie(this, this.game);
      //this.zombies.push(newZombie);
      this.playSound(this.gunshot);
      this.callZombie();
    }
    this.canFire = false;
  }

  playSound(sound) {
    let playSound = sound;
    playSound.volume = 0.4;
    playSound.play();
  }

  callZombie() {
    if (this.position.x >= 200 && this.position.x <= 600) {
      let randomnumber = Math.floor(Math.random() * 6) + 1;
      if (randomnumber === 6) {
        var newZombie = new Zombie(this, this.game);
        this.zombies.push(newZombie);
      }
    }
  }

  hit() {
    switch (this.hurtStatus) {
      case 1:
        this.image = document.getElementById('ceremorOver2');
        this.playSound(this.ceremorScream);
        this.hurtStatus++;
        break;
      case 2:
        this.image = document.getElementById('ceremorOver3');
        this.playSound(this.ceremorScream);
        this.hurtStatus++;
        break;
      case 3:
        this.image = document.getElementById('ceremorOver4');
        this.playSound(this.ceremorScream);
        this.hurtStatus++;
        break;
      case 4:
        this.game.gamestate = GAMESTATE.GAMEOVER;
    }
  }

  stop() {
    this.speed = 0;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.position.x, this.position.y, 50, 50);
    this.zombies.forEach((object) => object.draw(ctx));
  }

  update(deltaTime) {
    if (this.game.gamestate == GAMESTATE.PAUSED) {
      return;
    }
    this.bullets = [...this.bullets];
    this.zombies = [...this.zombies];

    if (this.position.x < 0) this.position.x = 0;
    if (this.position.x + this.width > this.gameWidth) {
      this.position.x = this.gameWidth - this.width;
    }
    this.zombies.forEach((zombie) => {
      zombie.update();
    });
    this.zombies = this.zombies.filter((object) => !object.markedForDeletion);
  }
}
