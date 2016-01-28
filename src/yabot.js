// External requires
import DiscordClient from 'discord.io';

// Internal requires
import Gym from './Gym';

// Config files
import CONFIG from './config';
import CREDENTIALS from './credentials';

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
        this.bot.sendMessage({
          to: topChannelID,
          message: CONFIG.GREETINGS
        });

        let gym = new Gym(topChannelID, userList, this.bot);
        gym.doExercice({ autoSchedule: true });
        this.rooms.push(gym);
      });
    });

    this.bot.on('message', ( user, userID, channelID, message, rawEvent ) => {
      if (message === '!score') {
        this.bot.sendMessage({
          to: channelID,
          message: JSON.stringify(Score.getScore())
        });
      } else if (message === '!forceall') {
        this.rooms.forEach((rooms, i) => {
          rooms.doExercice({ autoSchedule: false });
        });
      } else if (message === '!fail') {

      }
    });
  }
}

