import { detectCollision } from './collisionDetection.js';
import { playSound } from './playSound.js';

var charIndex = 0;
const BOSSAPPEAR = document.getElementById('bossAppear');
const TAPPING = document.getElementById('tapping');

export default class BossSpawn {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.image = document.getElementById('bossOver');
    this.impact = document.getElementById('impact');
    this.baserScream = document.getElementById('baserScream');
    this.textBack = document.getElementById('textBack');
    this.game = game;
    this.bossPosition = { x: 375, y: 50 };
    this.width = 50;
    this.height = 50;
    this.blackBarOpacity = 0;
    this.animationTimer = 0;
    this.animationTicker = 0;
    this.updateTimer = 0;
    this.textStart = false;
    this.dialogueText = '';
    this.playSound = true;
    this.markedForDeletion = false;
    this.drawTextBackingBool = false;
    this.drawEnemyBool = false;
  }
  update(deltaTime) {
    this.animationTimer += deltaTime / 1000;
    this.animationTicker += deltaTime / 100;
    if (this.updateTimer !== Math.floor(this.animationTicker)) {
      this.updateTimer = Math.floor(this.animationTicker);
      this.updatePerQuarterSecond(this.nextDialogue);

      if (this.updateTimer === 500) {
        this.markedForDeletion = true;
      }
    }

    if (this.animationTimer > 0) {
      if (this.animationTimer > 2 && this.blackBarOpacity < 1) {
        this.blackBarOpacity += this.animationTimer / 200;
      }
    }
    if (this.animationTimer > 7) {
      this.drawEnemyBool = true;
      if (this.playSound) {
        playSound(BOSSAPPEAR);
        this.playSound = false;
      }
    }
    if (this.animationTimer > 13) {
      this.drawTextBackingBool = true;
    }
    if (
      this.animationTimer > 15 &&
      this.animationTimer < 16 &&
      this.textStart === false
    ) {
      charIndex = 0;
      this.nextDialogue = `NO! You can't just raid the bases!`;
      this.textStart = true;
    }
    if (
      this.animationTimer > 25 &&
      this.animationTimer < 26 &&
      this.textStart === false
    ) {
      charIndex = 0;
      this.nextDialogue = `It's so toxic, you are SO TOXIC!!`;
      this.textStart = true;
    }
    if (
      this.animationTimer > 35 &&
      this.animationTimer < 36 &&
      this.textStart === false
    ) {
      charIndex = 0;
      this.nextDialogue = `Think about the spirit of the server!!`;
      this.textStart = true;
    }
  }

  updatePerQuarterSecond() {
    if (this.textStart) {
      this.drawText(this.nextDialogue);
    }
  }

  drawTextBacking(ctx) {
    ctx.drawImage(this.textBack, 100, 250, 600, 100);
  }

  drawEnemy(ctx) {
    ctx.drawImage(
      this.image,
      this.bossPosition.x,
      this.bossPosition.y,
      this.width,
      this.height
    );
  }

  drawText(sentence) {
    if (charIndex <= sentence.length) {
      charIndex++;
      this.dialogueText = sentence.substring(0, charIndex);
      if (sentence.substring(charIndex - 1, charIndex) !== ' ') {
        playSound(TAPPING);
      }
    }
    if (charIndex > sentence.length) {
      this.textStart = false;
    }
  }

  draw(ctx) {
    ctx.rect(0, 0, this.game.gameWidth, 50);
    ctx.fillStyle = `rgba(0,0,0,${this.blackBarOpacity})`;
    ctx.fill();
    ctx.rect(0, 400, this.game.gameWidth, 50);

    if (this.drawTextBackingBool) {
      this.drawTextBacking(ctx);
    }
    if (this.drawEnemyBool) {
      this.drawEnemy(ctx);
    }
    ctx.font = '20px Monospace';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.fillText(this.dialogueText, 225, 325);
  }
}
