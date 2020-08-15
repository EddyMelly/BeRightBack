import { Bullet, ToxicBullet } from './bullet.js';
import Zombie from './zombie.js';
import {
  AutomaticPowerUp,
  PowerUp,
  ToxicPowerUp,
  TriplePowerUp,
} from './powerUp.js';
import { playSound } from './playSound.js';

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  VICTORY: 2,
  GAMEOVER: 3,
  CUTSCENE: 4,
  BOSSFIGHT: 5,
};
const POWERUPNAME = {
  AUTOMATIC: 0,
  TRIPLE: 1,
  TOXIC: 2,
};
const GUNSHOT = document.getElementById('gunshot');
const FOOTSTEP = document.getElementById('footstep');
const POWERUPSOUND = document.getElementById('powerUp');
const TOXICBULLETSOUND = document.getElementById('toxicBulletSound');

export default class Player {
  constructor(game) {
    this.width = 50;
    this.game = game;
    this.height = 50;
    this.maxSpeed = 50;
    this.bullets = [];
    this.image = document.getElementById('ceremorOver');
    this.ceremorScream = document.getElementById('ceremorScream');
    this.speed = 0;
    this.gameWidth = game.gameWidth;
    let xPosition = 300;
    let yPosition = game.gameHeight - this.height;
    this.canFire = true;
    this.hurtStatus = 1;
    this.zombies = [];
    this.position = { x: xPosition, y: yPosition };
    this.powerUp = { active: false, firerate: 0.8, totalFire: 0 };
    this.powerUpSpawn = {
      active: false,
      powerUpName: null,
      powerUpObject: null,
    };
    this.powerUpCollected = {
      collected: false,
      activated: false,
      powerUpName: null,
      powerUpMethod: null,
    };
    this.powerUpTimer = 0;
    this.bulletSpeedMultiplier = 0;
    this.tripleFire = 0;
  }

  moveLeft() {
    if (
      this.game.gamestate === GAMESTATE.RUNNING ||
      this.game.gamestate === GAMESTATE.BOSSFIGHT
    ) {
      if(this.position.x > 0){
        this.position.x = this.position.x - this.width;
      this.canFire = true;
      playSound(FOOTSTEP);
      }
      
    }
  }

  moveRight() {
    if (
      this.game.gamestate === GAMESTATE.RUNNING ||
      this.game.gamestate === GAMESTATE.BOSSFIGHT
    ) {
      if(this.position.x < this.game.gameWidth - 50){
        this.position.x = this.position.x + this.width;
      this.canFire = true;
      playSound(FOOTSTEP);
      }
      
    }
  }

  shoot() {
    if (
      this.game.gamestate === GAMESTATE.RUNNING ||
      this.game.gamestate === GAMESTATE.BOSSFIGHT
    ) {
      if (this.canFire) {
        switch (this.powerUpCollected.powerUpName) {
          case POWERUPNAME.TOXIC:
            this.powerUpCollected.activated = true;
            this.toxicFire();
            this.canFire = false;
            this.spawnPowerUp();
            break;
          case POWERUPNAME.TRIPLE:
            this.powerUpCollected.activated = true;
            this.tripleBullet();
            this.canFire = false;
            this.spawnPowerUp();
            break;
          case POWERUPNAME.AUTOMATIC:
            this.powerUpCollected.activated = true;
            break;
          default:
            var newBullet = new Bullet(this.game, this);
            this.bullets.push(newBullet);
            playSound(GUNSHOT);
            this.callZombie();
            this.spawnPowerUp();
            this.canFire = false;
        }
      }
    }
  }

  automaticOn() {
    this.powerUpCollected = {
      collected: true,
      activated: false,
      powerUpName: POWERUPNAME.AUTOMATIC,
      powerUpMethod: this.automatic.bind(this),
    };
    playSound(POWERUPSOUND);
  }

  toxicBulletOn() {
    this.powerUpCollected = {
      collected: true,
      activated: false,
      powerUpName: POWERUPNAME.TOXIC,
      powerUpMethod: this.toxicFire.bind(this),
    };
    playSound(POWERUPSOUND);
  }

  tripleFireOn() {
    this.powerUpCollected = {
      collected: true,
      activated: false,
      powerUpName: POWERUPNAME.TRIPLE,
      powerUpMethod: this.tripleBullet.bind(this),
    };
    this.tripleFire = 3;
    playSound(POWERUPSOUND);
  }

  tripleBullet(delta) {
    if (this.tripleFire > 0) {
      var newBulletLeft = new Bullet(this.game, this);
      newBulletLeft.setDiagonal('left');
      var newBulletRight = new Bullet(this.game, this);
      newBulletRight.setDiagonal('right');
      var newBulletNormal = new Bullet(this.game, this);
      this.bullets.push(newBulletNormal);
      this.bullets.push(newBulletLeft);
      this.bullets.push(newBulletRight);
      playSound(GUNSHOT);
      this.tripleFire--;
      if (this.tripleFire === 0) {
        this.powerUpCollected = {
          collected: false,
          activated: false,
          powerUpName: null,
          powerUpMethod: null,
        };
      }
    }
  }

  toxicFire(deltaTime) {
    if (this.powerUpCollected.collected && this.powerUpCollected.activated) {
      var newBullet = new ToxicBullet(this.game, this);
      this.bullets.push(newBullet);
      playSound(TOXICBULLETSOUND);
      this.powerUpCollected = {
        collected: false,
        activated: false,
        powerUpName: null,
        powerUpMethod: null,
      };
    }
  }

  automatic(deltaTime) {
    if (this.powerUpCollected.collected && this.powerUpCollected.activated) {
      this.powerUpTimer += deltaTime / 1000;
      if (this.powerUpTimer > this.powerUp.firerate) {
        var newBullet = new Bullet(this.game, this);
        this.bullets.push(newBullet);
        playSound(GUNSHOT);
        this.powerUpTimer = 0;
        this.powerUp.totalFire++;
        this.canFire = false;
      }
      if (this.powerUp.totalFire > 8) {
        this.powerUp = { active: false, firerate: 0.8, totalFire: 0 };
        this.powerUpCollected = {
          collected: false,
          activated: false,
          powerUpName: null,
          powerUpMethod: null,
        };
        this.canFire = true;
      }
    }
  }

  spawnPowerUp() {
    if (
      this.game.gamestate === GAMESTATE.RUNNING ||
      this.game.gamestate === GAMESTATE.BOSSFIGHT
    ) {
      let randomNumber = Math.floor(Math.random() * 10) + 1;
      if (randomNumber === 2) {
        if (this.powerUpSpawn.active === false) {
          var newAutoPowerUp = new AutomaticPowerUp(this.game, this);
          this.powerUpSpawn = {
            active: true,
            powerUpName: POWERUPNAME.AUTOMATIC,
            powerUpObject: newAutoPowerUp,
          };
        }
      }
      if (randomNumber === 1) {
        if (this.powerUpSpawn.active === false) {
          if (this.game.gamestate === GAMESTATE.RUNNING) {
            var newToxicPowerUp = new ToxicPowerUp(this.game, this);
            this.powerUpSpawn = {
              active: true,
              powerUpName: POWERUPNAME.TOXIC,
              powerUpObject: newToxicPowerUp,
            };
          } else {
            var newTriplePowerUp = new TriplePowerUp(this.game, this);
            this.powerUpSpawn = {
              active: true,
              powerUpName: POWERUPNAME.TRIPLE,
              powerUpObject: newTriplePowerUp,
            };
          }
        }
      }
    }
  }

  fasterBullets() {
    this.bulletSpeedMultiplier = this.bulletSpeedMultiplier + 0.1;
  }

  callZombie() {
    if (
      this.game.gamestate === GAMESTATE.RUNNING ||
      this.game.gamestate === GAMESTATE.BOSSFIGHT
    ) {
      if (this.position.x >= 200 && this.position.x <= 600) {
        let randomnumber = Math.floor(Math.random() * 8) + 1;
        if (randomnumber === 6) {
          var newZombie = new Zombie(this, this.game);
          this.zombies.push(newZombie);
        }
      }
    }
  }

  hit() {
    switch (this.hurtStatus) {
      case 1:
        this.image = document.getElementById('ceremorOver2');
        playSound(this.ceremorScream);
        this.hurtStatus++;
        break;
      case 2:
        this.image = document.getElementById('ceremorOver3');
        playSound(this.ceremorScream);
        this.hurtStatus++;
        break;
      case 3:
        this.image = document.getElementById('ceremorOver4');
        playSound(this.ceremorScream);
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
    if (this.powerUpSpawn.active === true) {
      this.powerUpSpawn.powerUpObject.draw(ctx);
    }
  }

  update(deltaTime) {
    if (
      this.game.gamestate == GAMESTATE.PAUSED ||
      this.game.gamestate == GAMESTATE.VICTORY ||
      this.game.gamestate == GAMESTATE.CUTSCENE ||
      this.game.gamestate == GAMESTATE.GAMEOVER
    ) {
      return;
    }

    if (
      this.powerUpCollected.collected &&
      this.powerUpCollected.powerUpName === POWERUPNAME.AUTOMATIC &&
      this.powerUpCollected.activated
    ) {
      this.powerUpCollected.powerUpMethod(deltaTime);
    }
    if (this.powerUpSpawn.active) {
      this.powerUpSpawn.powerUpObject.update(deltaTime);
      if (this.powerUpSpawn.powerUpObject.markedForDeletion === true) {
        this.powerUpSpawn = {
          active: false,
          powerUpName: null,
          powerUpObject: null,
        };
      }
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
