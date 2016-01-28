// External requires
import bjson from 'bjson';

const scores = bjson('./scores.json');

export default class Score {
  /**
   * @static addScore
   * @param {Exercice} exercice - exercice to save
   */
  static addScore (exercice) {
    if (!scores.players) scores.players = {};
    if (!scores.players[exercice._username]) scores.players[exercice._username] = { PUSHUPS: 0, PLANK: 0, SITUPS: 0, WALLSIT: 0 };

    scores.players[exercice._username][exercice._name] += exercice._reps;
  }

  /**
   * @static getScore
   * @return {object}
   */
  static getScore () {
    return scores;
  }
}


