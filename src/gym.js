// Internal imports
import Score from './score';
import * as Utils from './utils';
import Exercice from './exercice';

// Config
import CONFIG from './config';

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
    const offset = Utils.random(-CONFIG.EXERCISES.DELAY_OFFSET, CONFIG.EXERCISES.DELAY_OFFSET);
    const timeout = CONFIG.EXERCISES.DELAY + offset;

    this.makeDeclaration(`NEXT EXERCISE IN ${Utils.msToMin(timeout)} MIN!`, true);

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

    // Create a new Exercice
    const exercice = new Exercice({
      userID: user.ID,
      username: user.username
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

