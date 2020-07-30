export default class TwitchApi {
  constructor(channel, game) {
    this.channel = channel;
    this.users = [];
    this.game = game;
    this.statusElement = document.getElementById('status');
    this.twitchCall = new TwitchJs({
      log: {
        enabled: false,
      },
    });
  }
  disconnectTwitchChat() {
    const { chat } = this.twitchCall;
    chat.disconnect();
    this.statusElement.innerHTML = 'disconnected';
    this.statusElement.style.color = 'red';
  }

  connectTwitchChat() {
    const { chat } = this.twitchCall;
    chat
      .connect()
      .then(() => {
        chat
          .join(this.channel)
          .then(() => {
            console.log('connected boy');
            this.statusElement.innerHTML = 'connected';
            this.statusElement.style.color = 'green';
          })
          .catch(function (err) {
            console.log(err);
            this.statusElement.innerHTML = 'Edgar Fucked Up';
            this.statusElement.style.color = 'red';
          });
      })
      .catch(function (err) {
        console.log(err);
        statusElement.innerHTML = 'Error: Cant connect right now';
        statusElement.style.color = 'red';
      });

    chat.on('*', (message) => {
      var message = message;
      var clean_message = DOMPurify.sanitize(message.message, {
        ALLOWED_TAGS: ['b'],
      });
      this.clean_username = DOMPurify.sanitize(message.username, {
        ALLOWED_TAGS: ['b'],
      });
      this.decideMessage(clean_message, message.tags['badgeInfo']);
    });
  }

  decideMessage(cleanMessage, subBadge) {
    var uppercaseMessage = cleanMessage.toUpperCase();
    if (this.subCheck(subBadge)) {
      if (uppercaseMessage === 'LEFT') {
        this.game.player.moveLeft();
      }
      if (uppercaseMessage === 'RIGHT') {
        this.game.player.moveRight();
      }
      if (uppercaseMessage.includes('SHOOT')) {
        this.game.player.shoot();
      }
    }
  }

  subCheck(subscriber) {
    if (subscriber !== '') {
      return true;
    } else {
      return false;
    }
  }
}
