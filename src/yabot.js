// External requires
import DiscordClient from 'discord.io';

// Internal requires
import Gym from './gym';
import Score from './score';
import ServerConfig from './server-config';

// Config files
import CONFIG from '../config';
import CREDENTIALS from '../credentials';

/**
 * @class Yabot
 */
export default class Yabot  {

  /**
   * @constructor
   * @param {Object} options - Yabot options
   */
  constructor (options = {}) {
    this.rooms = [];

    this.bot = new DiscordClient({
      autorun: true,
      email: CREDENTIALS.EMAIL,
      password: CREDENTIALS.PASSWORD
    });

    this.bot.on('ready', () => {
      console.log(`${this.bot.username } - (${this.bot.id})`);

      Object.keys(this.bot.servers).forEach( (serverID, index) => {
        let server = this.bot.servers[serverID];
        let serverConfig = ServerConfig.getConfig(serverID);

        let userList = [];
        let topChannelID;

        // List users
        for (let userID in server.members) {
          let member = server.members[userID];

          userList.push({
            ID: userID,
            username: member.user.username
          });
        }

        // List Channel
        for (let channelID in server.channels) {
          let channel = server.channels[channelID];
          if (channel.type !== 'text') continue;

          if (channel.position === 0) topChannelID = channelID;
        }

        // If no top channel, exit
        if (!topChannelID) return;

        // Warn everyone about pushups
        this.say(topChannelID, CONFIG.GREETINGS);

        let gym = new Gym(topChannelID, userList, this.bot);

        if (serverConfig.EXERCISE_AT_STARTUP) {
          gym.doExercice({ autoSchedule: true });
        } else {
          gym.scheduleExercice();
        }

        this.rooms.push(gym);
      });
    });

    this.bot.on('message', ( user, userID, channelID, message, rawEvent ) => {
      const words = message.split(' ');
      const action = words.splice(0, 1);

      // Define actions
      const actions = {
        // Show every scores
        '!score': () => {
          const score = Score.getScore();
          const message = Object.keys(score.players).map((name) => {
            const member = score.players[name];
            const detail = Object.keys(member.detail)
              .map((type) => `${type}: ${member.detail[type]}`)
              .join(', ');

              return `${name} (${member.total}):\n    ${detail}`;
          }).join('\n\n');

          this.say(channelID, message);
        },

        // Force exercice on all servers
        '!forceall': () => {
          this.rooms.forEach((rooms, i) => {
            rooms.doExercice({ autoSchedule: false });
          });
        },

        // Force exercice on a specific server
        '!force': (serverID) => {
          if (this.rooms[serverID]) {
            this.rooms[serverID].doExercice({ autoSchedule: false });
          } else {
            this.say(channelID, `No server with ID: ${serverID}`);
          }
        },

        // Reset all scores
        '!listserver': () => {
          const message = Object.keys(this.bot.servers)
            .map((id, index) => `${this.bot.servers[id].name}: ${id}`)
            .join('\n');
          this.say(channelID, message);
        },

        // Reset all scores
        '!reset': () => {
          Score.reset();
        },

        // Show Usage
        '!help': () => {
          const usage = `Yabot usage:
          * !help       - Display this text
          * !score      - Show global scores
          * !forceall   - Force an exercice on every server
          * !listserver - List servers' name & id
          * !reset      - Reset all scores`;

          this.say(channelID, usage);
        }
      };

      if (actions[action]) {
        actions[action](...words);
      }

    });
  }

  /**
   * @method say
   * @param {String} to - recipient
   * @param {String} message - message to deliver
   */
  say (to, message) {
    if (process.env.NODE_ENV === 'debug') {
      console.log(message);
      return;
    }

    this.bot.sendMessage({
      to,
      message
    });
  }
}

