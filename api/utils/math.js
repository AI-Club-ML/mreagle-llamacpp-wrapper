/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param {number} number - The number to round.
 * @param {number} decimalPlaces - The number of decimal places to round to.
 * @return {number} The rounded number.
 */
function round(number, decimalPlaces) {
  return Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}

module.exports = {
  round,
};
