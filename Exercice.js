var config = require('./config.json');
var Utils = require('./Utils.js');

/**
 * @constructor Exercice
 * @param {object}       options          - Options
 * @param {ExerciceType} options.exercice - Type of exercice
 * @param {String}       options.userID   - User to do the exercice
 * @param {Number}       options.reps     - Number of reps to do
 */
function Exercice(options) {
  var opt = options || {};

  var exercice = opt.exercice || Utils.RandomInArray(config.EXERCISES.TYPES);
  this._userID = opt.userID   || "";
  this._reps   = opt.reps     || Utils.Random(exercice.REPS.MIN, exercice.REPS.MAX);
  this._name   = exercice.NAME;
  this._unit   = exercice.UNIT;
}

/**
 * @method getMessage
 * @return {string} - message
 */
Exercice.prototype.getMessage = function() {
  return 'GET UP <@' + this._userID + '> AND DO ' + this._reps + ' ' + ( this._unit !== '' ? this._unit + ' ' : '' ) + this._name + ' RIGHT NOW!';
};

module.exports = Exercice;
