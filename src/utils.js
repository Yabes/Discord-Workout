/**
 * Utils
 */

/**
 * @function Random
 * @param {Number} min - inclusive
 * @param {Number} max - inclusive
 * @return {Number}
 */
export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @function RandomInArray
 * @param {Array} array - Array
 */
export function randomInArray(array) {
  return array[random(0, array.length - 1)];
}

/**
 * @method msToMin
 * @param {Number} ms - duration in ms
 * @return {Number} - duration in min
 */
export function msToMin(ms) {
  return Math.round(ms / 60000);
}

