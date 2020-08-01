export default class InputHandler {
  constructor(player, game) {
    document.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 37:
          player.moveLeft();
          break;
        case 38:
          player.shoot();
          break;
        case 39:
          player.moveRight();
          break;
        case 27:
          game.togglePause();
          break;
          case 40:
            player.automaticOn();
      }
    });

    document.addEventListener('keyup', (event) => {
      switch (event.keyCode) {
        case 37:
          if (player.speed < 0) {
            player.stop();
          }
          break;
        case 39:
          if (player.speed > 0) {
            player.stop();
          }
          break;
      }
    });
  }
}
