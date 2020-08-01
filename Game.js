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
    this.lastUser = {username: "unknown", instruction:"unknown"};
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

  setLastUser(username, instruction){
    if(this.gamestate === GAMESTATE.RUNNING){
      this.lastUser = {username: username, instruction: instruction};
    }
  }

  update(deltaTime) {
    if (
      this.gamestate == GAMESTATE.PAUSED ||
      this.gamestate == GAMESTATE.GAMEOVER ||
      this.gamestate == GAMESTATE.VICTORY
    ) {
      return;
    }
    if (this.fences.length <= 11 && this.fences.length > 7) {
      this.fences.forEach((fence) => {
        fence.intervalUpper = 30;
        fence.intervalLower = 12;
        fence.bulletSpeedModifier = 0.30;
      });
    }
    if (this.fences.length <= 7) {
      this.fences.forEach((fence) => {
        fence.intervalUpper = 25;
        fence.intervalLower = 11;
        fence.bulletSpeedModifier = 0.35;
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
    ctx.font = "12px Monospace";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(this.lastUser.username, 150, 10);

    if(this.lastUser.instruction === "LEFT"){
      ctx.drawImage(document.getElementById('leftIcon'), 130, 0 , 12, 12);
    }else if(this.lastUser.instruction === "RIGHT"){
      ctx.drawImage(document.getElementById('rightIcon'), 130, 0 , 12, 12);
    }else if(this.lastUser.instruction === "SHOOT"){
      ctx.drawImage(document.getElementById('bulletIcon'), 130, 0 , 12, 12);
    }

    if (this.gamestate == GAMESTATE.PAUSED) {
      this.displayMessage(ctx, 'rgba(0,0,0,0.5)', {main: "PAUSED", subtitle: "Game is paused"});
    }
    if (this.gamestate == GAMESTATE.GAMEOVER) {
      this.displayMessage(ctx,'rgba(51,0,0,0.75', {main: "CHAT LOSES!!", subtitle:this.lastUser.username +" ruined everything"});
      if (
        this.gamestate == GAMESTATE.GAMEOVER &&
        this.restartStatus === false
      ) {
        this.gameOver(ctx);
      }
    }
    if (this.gamestate == GAMESTATE.VICTORY) {
      this.displayMessage(ctx, 'rgba(0,102,51,0.75)', {main:"CHAT WINS!", subtitle:"You were banned from this server."});
      if (this.gamestate == GAMESTATE.VICTORY && this.restartStatus === false) {
        this.victory(ctx);
      }
    }
  }


  displayMessage(ctx,rgbValue, message){
    ctx.rect(200, 100, this.gameWidth / 2, this.gameHeight / 2);
    ctx.fillStyle = rgbValue;
    ctx.fill();
    ctx.font = "35px Monospace";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(message.main, this.gameWidth / 2, this.gameHeight / 2);
    ctx.font = "18px Monospace";
    ctx.fillText(message.subtitle, this.gameWidth /2, this.gameHeight /2 + 30);
  }

  gameOver() {
    this.playSound(this.failureTune);
    this.restartStatus = true;
    setTimeout(function () {
      restart();
      return;
    }, 10000);
  }

  victory() {
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
