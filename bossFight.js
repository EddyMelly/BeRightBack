import { detectCollision } from './collisionDetection.js';
import { TomatoBullet, ClipBullet } from './enemyBullet.js';
import { playSound } from './playSound.js';
import { BossFence } from './fence.js';

const BOSSSTAGES = {
  TOMATOSTAGE: 0,
  HIDINGSTAGE: 1,
};
const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  VICTORY: 2,
  GAMEOVER: 3,
  CUTSCENE: 4,
  BOSSFIGHT: 5,
};

const BOSSPOSITIONS = [
  0,
  50,
  100,
  150,
  200,
  250,
  300,
  350,
  400,
  450,
  500,
  550,
  600,
  650,
  700,
  750,
];

export default class BossFight {
  constructor(game) {
    this.game = game;
    this.player = game.player;
    this.image = document.getElementById('bossOver');
    this.bossLifeBack = document.getElementById('bossLifeBack');
    this.bossScream = document.getElementById('bossScream');
    this.position = { x: BOSSPOSITIONS[7], y: 50 };
    this.width = 50;
    this.height = 50;
    this.projectiles = [];
    this.lifePoints = 10;
    this.shootLanes = [0, 2, 4, 5, 9, 11, 14];
    this.markedForDeletion = false;
    this.movementTimer = 0;
    this.direction = true;
    this.bossStage = BOSSSTAGES.TOMATOSTAGE;
    this.fenceBuilt = false;
    this.clipTiming = 0;
  }

  update(deltaTime) {
    if (this.markedForDeletion === false) {
      this.game.player.bullets.forEach((bullet) => {
        if (detectCollision(bullet, this)) {
          bullet.markedForDeletion = true;
          this.hurt();
        }
      });
    }
    if (this.lifePoints <= 0) {
      this.markedForDeletion = true;
      this.game.gamestate = GAMESTATE.VICTORY;
    }
    if (
      this.lifePoints === 8 ||
      this.lifePoints === 5 ||
      this.lifePoints === 1
    ) {
      this.bossStage = BOSSSTAGES.HIDINGSTAGE;
    } else {
      this.bossStage = BOSSSTAGES.TOMATOSTAGE;
    }

    switch (this.bossStage) {
      case BOSSSTAGES.TOMATOSTAGE:
        this.movementTimer += deltaTime / 2000;
        if (this.movementTimer > 1) {
          this.tomatoMovement(deltaTime);
          this.movementTimer = 0;
        }
        break;
      case BOSSSTAGES.HIDINGSTAGE:
        this.movementTimer += deltaTime / 500;
        if (this.movementTimer > 1) {
          this.hidingMovement(deltaTime);
          this.movementTimer = 0;
        }
        break;
    }
    this.projectiles.forEach((projectile) => {
      projectile.update();
    });
    this.projectiles = this.projectiles.filter(
      (object) => !object.markedForDeletion
    );
  }

  giveNewPosition() {
    if (this.direction) {
      return BOSSPOSITIONS.indexOf(this.position.x - 50);
    } else {
      return BOSSPOSITIONS.indexOf(this.position.x + 50);
    }
  }

  checkCurrentPosition() {
    return BOSSPOSITIONS.indexOf(this.position.x);
  }

  hidingMovement(deltaTime) {
    if (this.position.x !== BOSSPOSITIONS[7]) {
      if (this.position.x === BOSSPOSITIONS[0] && this.direction) {
        this.direction = false;
      } else if (this.position.x === BOSSPOSITIONS[15] && !this.direction) {
        this.direction = true;
      } else {
        this.position.x = BOSSPOSITIONS[this.giveNewPosition()];
      }
    } else {
      this.hidingAttack(deltaTime);
    }
  }

  hidingAttack(deltaTime) {
    this.clipTiming += deltaTime / 200;
    if (!this.fenceBuilt) {
      this.buildFence();
    } else {
      if (this.clipTiming >= 3) {
        this.clipAttack();
        this.clipTiming = 0;
      }
    }
  }

  clipAttack() {
    //CONTINUE HERE
    var dropLanes = this.getArrayOfValues(13);
    dropLanes.forEach((position) => {
      var newClipBullet = new ClipBullet(
        this.game,
        this,
        0.35,
        BOSSPOSITIONS[position]
      );
      this.projectiles.push(newClipBullet);
    });
  }

  buildFence() {
    if (!this.fenceBuilt) {
      var newFence = new BossFence(this.game, this.position);
      this.projectiles.push(newFence);
      this.clipTiming = 2.8;
      this.fenceBuilt = true;
    }
  }

  tomatoMovement(deltaTime) {
    if (this.position.x === BOSSPOSITIONS[0] && this.direction) {
      this.direction = false;
      this.shootLanes = this.getArrayOfValues(9);
    } else if (this.position.x === BOSSPOSITIONS[15] && !this.direction) {
      this.direction = true;
      this.shootLanes = this.getArrayOfValues(9);
    } else {
      this.position.x = BOSSPOSITIONS[this.giveNewPosition()];
      if (this.shootLanes.includes(this.checkCurrentPosition())) {
        this.shootTomato();
      }
    }
  }

  shootTomato() {
    var newBullet = new TomatoBullet(this.game, this, 0.3);
    this.projectiles.push(newBullet);
  }

  getArrayOfValues(arrayLength) {
    var arr = [];
    while (arr.length < arrayLength) {
      var r = Math.floor(Math.random() * 16) + 0;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
  }

  hurt() {
    if (this.lifePoints > 0) {
      if (this.bossStage === BOSSSTAGES.TOMATOSTAGE) {
        this.lifePoints = this.lifePoints - 1;
        playSound(this.bossScream);
      } else {
        this.lifePoints = this.lifePoints - 1;
        playSound(this.bossScream);
        this.projectiles = [];
        this.fenceBuilt = false;
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

    ctx.drawImage(this.bossLifeBack, 297, 17, 206, 31);
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(300, 20, this.lifePoints * 20, 25);
    this.projectiles.forEach((object) => object.draw(ctx));
  }
}
