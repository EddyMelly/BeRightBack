import Game from './Game.js';

let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');
const GAME_WIDTH = 800;
const GAME_HEIGHT = 450;
let lastTime = 0;
var game;

game = new Game(GAME_WIDTH, GAME_HEIGHT, ctx);
game.start();

export function restart() {
  game = new Game(GAME_WIDTH, GAME_HEIGHT, ctx);
  game.start();
}

function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  //clear the whole screen
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  //tell game to update
  game.update(deltaTime);
  //tell game to draw
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
