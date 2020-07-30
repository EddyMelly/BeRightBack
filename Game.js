import TwitchApi from './TwitchApi.js';
import InputHandler from './Input.js';
import Player from './Player.js';
import { restart } from './index.js';
import { buildLevel, level1 } from './levels.js';

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  VICTORY: 2,
  GAMEOVER: 3,
};

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    this.player = new Player(this);
    this.fences = buildLevel(this, level1);
    this.restartStatus = false;
    new InputHandler(this.player, this);
    this.victoryTune = document.getElementById('victory');
    this.failureTune = document.getElementById('failure');
  }

  start() {
    this.gamestate = GAMESTATE.RUNNING;
    this.gameObjects = [this.player, this.fences];
    this.TwitchApi = new TwitchApi('ceremor', this);
    this.TwitchApi.connectTwitchChat();
  }

  update(deltaTime) {
    if (
      this.gamestate == GAMESTATE.PAUSED ||
      this.gamestate == GAMESTATE.GAMEOVER ||
      this.gamestate == GAMESTATE.VICTORY
    ) {
      return;
    }
    if (this.fences.length <= 12 && this.fences.length > 6) {
      this.fences.forEach((fence) => {
        fence.intervalUpper = 30;
        fence.intervalLower = 14;
        fence.bulletSpeedModifier = 0.3;
      });
    }
    if (this.fences.length <= 5) {
      this.fences.forEach((fence) => {
        fence.intervalUpper = 25;
        fence.intervalLower = 13;
        fence.bulletSpeedModifier = 0.4;
      });
    }
    this.gameObjects = [this.player, ...this.fences, ...this.player.bullets];
    this.gameObjects.forEach((object) => object.update(deltaTime));
    this.gameObjects = this.gameObjects.filter(
      (object) => !object.markedForDeletion
    );
    this.fences = this.fences.filter((object) => !object.markedForDeletion);

    if (this.fences.length === 0) {
      this.gamestate = GAMESTATE.VICTORY;
    }
  }

  draw(ctx) {
    this.gameObjects.forEach((object) => object.draw(ctx));

    if (this.gamestate == GAMESTATE.PAUSED) {
      ctx.rect(200, 100, this.gameWidth / 2, this.gameHeight / 2);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fill();

      ctx.font = '35px Monospace';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('Paused', this.gameWidth / 2, this.gameHeight / 2);
    }
    if (this.gamestate == GAMESTATE.GAMEOVER) {
      ctx.rect(200, 100, this.gameWidth / 2, this.gameHeight / 2);
      ctx.fillStyle = 'rgba(51,0,0,0.75)';
      ctx.fill();
      ctx.font = '35px Monospace';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('CHAT LOSES!!', this.gameWidth / 2, this.gameHeight / 2);
      if (
        this.gamestate == GAMESTATE.GAMEOVER &&
        this.restartStatus === false
      ) {
        this.gameOver(ctx);
      }
    }
    if (this.gamestate == GAMESTATE.VICTORY) {
      ctx.rect(200, 100, this.gameWidth / 2, this.gameHeight / 2);
      ctx.fillStyle = 'rgba(0,102,51,0.75)';
      ctx.fill();
      ctx.font = '35px Monospace';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('CHAT WINS!!', this.gameWidth / 2, this.gameHeight / 2);
      if (this.gamestate == GAMESTATE.VICTORY && this.restartStatus === false) {
        this.victory(ctx);
      }
    }
  }
  gameOver(ctx) {
    this.playSound(this.failureTune);
    this.restartStatus = true;
    setTimeout(function () {
      restart();
      return;
    }, 10000);
  }

  victory(ctx) {
    this.playSound(this.victoryTune);
    this.restartStatus = true;
    setTimeout(function () {
      restart();
      return;
    }, 10000);
  }

  playSound(sound) {
    let playSound = sound;
    playSound.volume = 0.4;
    playSound.load();
    playSound.play();
  }

  togglePause() {
    if (this.gamestate == GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    } else {
      this.gamestate = GAMESTATE.PAUSED;
    }
  }
}
