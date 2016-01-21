var bjson = require('bjson');

var scores = bjson('./scores.json');

/**
 * @function addScore
 * @param {Exercice} exercice - exercice to save
 */
exports.addScore = function (exercice) {
  if (!scores.players) scores.players = {};
  if (!scores.players[exercice._username]) scores.players[exercice._username] = { PUSHUPS: 0, PLANK: 0, SITUPS: 0, WALLSIT: 0 };

  scores.players[exercice._username][exercice] += exercice._reps;
};

/**
 * @function getScore
 * @return {object}
 */
exports.getScore = function () {
  return scores;
};

