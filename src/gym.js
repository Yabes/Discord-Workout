// External import
import prettyMs from 'pretty-ms';

// Internal imports
import Score from './score';
import * as Utils from './utils';
import Exercice from './exercice';
import Scheduler from './scheduler';
import ServerConfig from './server-config';

/**
 * @class Gym - A sport hall
 */
export default class Gym {

  /**
   * @constructor
   * @param {String} gymID
   * @param {Array<Object>} memberList
   * @param {DiscordClient} trainer
   */
  constructor(gymID, memberList, trainer) {
    this.gymID = gymID;
    this.memberList = memberList;
    this.trainer = trainer;
  }

  /**
   * @method makeDeclaration
   * @param {String} message
   * @Param {Boolean=} simulateTyping
   */
  makeDeclaration (message, simulateTyping) {
    if (process.env.NODE_ENV === 'debug') {
      console.log(message);
      return;
    }

    this.trainer.sendMessage({
      to: this.gymID,
      message: message,
      typing: !!simulateTyping
    });
  }

  /**
   * @method scheduleExercice
   * @desc schedule the next training session
   */
  scheduleExercice () {
    const timeout = Scheduler.getNextTiming(this.gymID);
    const prettyMsOptions = { compact: true };
    this.makeDeclaration(`NEXT EXERCISE IN ${prettyMs(timeout, prettyMsOptions).toUpperCase()} !`, true);

    setTimeout(() => {
      this.doExercice({ autoSchedule: true });
    }, timeout);
  }

  /**
   * @method doExercice
   * @desc Create a new exercice for a member
   * @param {Object} options
   * @param {Boolean} options.autoSchedule - reschedule another exercice
   */
  doExercice (options = {}) {
    // Pick an user
    let user;
    do {
      user = Utils.randomInArray(this.memberList);
    } while (user.ID === this.trainer.id);


    const level = ServerConfig.getConfig(this.gymID).level;

    // Create a new Exercice
    const exercice = new Exercice({
      userID: user.ID,
      username: user.username,
      level
    });

    // Send exercice message
    this.makeDeclaration(exercice.getMessage());

    // Keep score
    Score.addScore(exercice);

    // Change presence
    this.trainer.setPresence({
      game: `${exercice.name} with ${user.username}`
    });

    if (options.autoSchedule) this.scheduleExercice();
  }
}

