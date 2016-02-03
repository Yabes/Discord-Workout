// External requires
import bjson from 'bjson';

const scores = bjson('./scores.json');

/**
 * @typedef ScoresSav
 * @type Object
 * @prop {Object} players
 * @prop {number} players.total
 * @prop {Object.<string, number>} players.detail
 */
export default class Score {
  /**
   * @static addScore
   * @param {Exercice} exercice - exercice to save
   */
  static addScore (exercice) {
    if (!scores.players) scores.players = {};
    if (!scores.players[exercice.username]) scores.players[exercice.username] = { total: 0, detail: {PUSHUPS: 0, PLANK: 0, SITUPS: 0, WALLSIT: 0 }};

    scores.players[exercice.username].detail[exercice.name] += exercice.reps;
    scores.players[exercice.username].total++;
  }

  /**
   * @static getScore
   * @return {ScoresSav}
   */
  static getScore () {
    return scores;
  }

  /**
   * @static reset
   * @desc reset all scores
   */
  static reset () {
    scores.players = {};
  }
}

