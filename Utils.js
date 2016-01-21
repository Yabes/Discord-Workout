/**
 * Utils
 */

/**
 * @method Random
 * @param {Number} min - inclusive
 * @param {Number} max - inclusive
 * @return {Number}
 */
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.Random = random;

/**
 * @method RandomInArray
 * @param {Array} array - Array
 */
function randomInArray(array) {
  return array[random(0, array.length - 1)];
}

exports.RandomInArray = randomInArray;
