import TwitchApi from './TwitchApi.js';
import InputHandler from './Input.js';
import Player from './Player.js';
import { restart } from './index.js';
import { buildLevel, level1 } from './levels.js';
import { playSound } from './playSound.js';
import BossSpawn from './bossSpawn.js';
import BossFight from './bossFight.js';

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  VICTORY: 2,
  GAMEOVER: 3,
  CUTSCENE: 4,
  BOSSFIGHT: 5,
};

var savedGamestate;

export default class Game {
  constructor(gameWidth, gameHeight, ctx) {
    this.ctx = ctx;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.lastUser = { username: 'unknown', instruction: 'unknown' };
    this.player = new Player(this);
    this.fences = buildLevel(this, level1);
    this.restartStatus = false;
    this.bossSpawn = null;
    this.bossFight = null;
    new InputHandler(this.player, this);
    this.victoryTune = document.getElementById('victory');
    this.failureTune = document.getElementById('failure');
    this.bossFightStarted = true;
    this.cutSceneStarted = true;
  }

  start() {
    this.gamestate = GAMESTATE.RUNNING;
    this.gameObjects = [this.player, this.fences];
    this.TwitchApi = new TwitchApi('ceremor', this);
    this.TwitchApi.connectTwitchChat();
  }

  setLastUser(username, instruction) {
    if (
      this.gamestate === GAMESTATE.RUNNING ||
      this.gamestate === GAMESTATE.BOSSFIGHT
    ) {
      this.lastUser = { username: username, instruction: instruction };
    }
  }

  setUpBossFight() {
    if (this.bossFightStarted) {
      this.bossFight = new BossFight(this, this.ctx);
      this.gameObjects.push(this.bossFight);
      this.player.bullets = [];
      this.player.powerUp = { active: false, firerate: 0.8, totalFire: 0 };
      this.player.powerUpSpawn = {
        active: false,
        powerUpName: null,
        powerUpObject: null,
      };
      this.player.powerUpCollected = {
        collected: false,
        powerUpName: null,
        powerUpMethod: null,
      };
      this.player.powerUpTimer = 0;
      this.player.bulletSpeedMultiplier = 2;
      this.player.tripleFire = 0;
      this.player.hurtStatus = 1;
      this.player.zombies = [];
      this.bossFightStarted = false;
    }
  }
  setUpCutScene() {
    if (this.bossFightStarted) {
      this.bossSpawn = new BossSpawn(this, this.ctx);
      this.gameObjects = [this.bossSpawn];
      this.cutSceneStarted = false;
    }
  }

  update(deltaTime) {
    switch (this.gamestate) {
      case GAMESTATE.PAUSED:
      case GAMESTATE.GAMEOVER:
      case GAMESTATE.VICTORY:
        break;
      case GAMESTATE.CUTSCENE:
        this.gameObjects.forEach((object) => object.update(deltaTime));
        this.gameObjects = this.gameObjects.filter(
          (object) => !object.markedForDeletion
        );
        if (this.gameObjects.length === 0) {
          this.gamestate = GAMESTATE.BOSSFIGHT;
        }
        break;
      case GAMESTATE.BOSSFIGHT:
        if (this.bossFightStarted) {
          this.setUpBossFight();
          this.bossSpawn = null;
        }
        this.gameObjects = [
          this.player,
          this.bossFight,
          ...this.player.bullets,
        ];
        this.gameObjects.forEach((object) => object.update(deltaTime));
        break;
      case GAMESTATE.RUNNING:
        this.gameObjects = [
          this.player,
          ...this.fences,
          ...this.player.bullets,
        ];
        this.gameObjects.forEach((object) => object.update(deltaTime));
        this.gameObjects = this.gameObjects.filter(
          (object) => !object.markedForDeletion
        );
        if (this.fences.length <= 11 && this.fences.length > 7) {
          this.fences.forEach((fence) => {
            fence.intervalUpper = 27;
            fence.intervalLower = 11;
            fence.bulletSpeedModifier = 0.3;
          });
        }
        if (this.fences.length <= 7) {
          this.fences.forEach((fence) => {
            fence.intervalUpper = 20;
            fence.intervalLower = 10;
            fence.bulletSpeedModifier = 0.35;
          });
        }
        if (this.fences.length === 0) {
          //move this out
          this.setUpCutScene();
          this.lastUser = { username: '', instruction: 'unknown' };
          this.gamestate = GAMESTATE.CUTSCENE;
        }
        this.fences = this.fences.filter((object) => !object.markedForDeletion);
        break;
    }
  }

  clearOfRect(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.closePath();
    ctx.beginPath();
  }

  draw(ctx) {
    if (savedGamestate !== this.gamestate) {
      this.clearOfRect(ctx);
      savedGamestate = this.gamestate;
    }

    this.gameObjects.forEach((object) => object.draw(ctx));
    ctx.font = '12px Monospace';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.fillText(this.lastUser.username, 150, 10);

    if (this.lastUser.instruction === 'LEFT') {
      ctx.drawImage(document.getElementById('leftIcon'), 130, 0, 12, 12);
    } else if (this.lastUser.instruction === 'RIGHT') {
      ctx.drawImage(document.getElementById('rightIcon'), 130, 0, 12, 12);
    } else if (this.lastUser.instruction === 'SHOOT') {
      ctx.drawImage(document.getElementById('bulletIcon'), 130, 0, 12, 12);
    }

    if (this.gamestate == GAMESTATE.GAMEOVER) {
      this.displayMessage(ctx, 'rgba(51,0,0,0.75', {
        main: 'CHAT LOSES!!',
        subtitle: this.lastUser.username + ' ruined everything',
      });
      if (
        this.gamestate == GAMESTATE.GAMEOVER &&
        this.restartStatus === false
      ) {
        this.gameOver(ctx);
      }
    }
    if (this.gamestate == GAMESTATE.VICTORY) {
      this.displayMessage(ctx, 'rgba(0,102,51,0.75)', {
        main: 'CHAT WINS!',
        subtitle: 'You were banned from this server.',
      });
      if (this.gamestate == GAMESTATE.VICTORY && this.restartStatus === false) {
        this.victory(ctx);
      }
    }
  }

  displayMessage(ctx, rgbValue, message) {
    ctx.rect(200, 100, this.gameWidth / 2, this.gameHeight / 2);
    ctx.fillStyle = rgbValue;
    ctx.fill();
    ctx.font = '35px Monospace';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(message.main, this.gameWidth / 2, this.gameHeight / 2);
    ctx.font = '18px Monospace';
    ctx.fillText(
      message.subtitle,
      this.gameWidth / 2,
      this.gameHeight / 2 + 30
    );
  }

  gameOver() {
    playSound(this.failureTune);
    this.restartStatus = true;
    setTimeout(function () {
      restart();
      return;
    }, 10000);
  }

  victory() {
    playSound(this.victoryTune);
    this.restartStatus = true;
    setTimeout(function () {
      restart();
      return;
    }, 10000);
  }
}
