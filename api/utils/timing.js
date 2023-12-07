/**
 * Creates a debounced version of a callback function that will only be
 * invoked after a specified delay.
 *
 * @param {Function} callback The function to be debounced.
 * @param {number} [delay=1000] The delay in milliseconds before invoking
 *   the debounced callback.
 * @return {Function} The debounced function.
 */
function debounce(callback, delay = 1000) {
  var time;

  return (...args) => {
    clearTimeout(time);
    time = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

/**
 * Throttles the execution of a callback function.
 *
 * @param {function} callback The callback function to be throttled.
 * @param {number} [delay=1000] The delay in milliseconds between each execution of the callback. Default is 1000 milliseconds.
 * @return {function} The throttled version of the callback function.
 */
function throttle(callback, delay = 1000) {
  let shouldWait = false;

  return (...args) => {
    if (shouldWait) return;

    callback(...args);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
}

module.exports = {
  debounce,
  throttle,
};
