// Internal imports
import * as Utils from './utils';

// Config
import CONFIG from './config';

/**
 * @class Exercice
 * @description DO SOME PUSH-UPS BOYS!
 */
export default class Exercice {
  /**
   * @constructor Exercice
   * @param {object}       options          - Options
   * @param {ExerciceType} options.exercice - Type of exercice
   * @param {String}       options.userID   - User to do the exercice
   * @param {Number}       options.reps     - Number of reps to do
   */
  constructor (options = {}) {
    const exercice = options.exercice || Utils.randomInArray(CONFIG.EXERCISES.TYPES);
    this.userID    = options.userID   || "";
    this.username  = options.username || "";
    this.reps      = options.reps     || Utils.random(exercice.REPS.MIN * CONFIG.EXERCISES.LEVEL, exercice.REPS.MAX * CONFIG.EXERCISES.LEVEL);
    this.name      = exercice.NAME;
    this.unit      = exercice.UNIT;
  }

  /**
   * @method getMessage
   * @desc return a string about the exercice
   * @return {String} - message
   */
  getMessage () {
    return `GET UP <@${this.userID}> AND DO ${this.reps} ${(this.unit !== '' ? this.unit + ' ' : '' )}${this.name } RIGHT NOW!`;
  }
}
