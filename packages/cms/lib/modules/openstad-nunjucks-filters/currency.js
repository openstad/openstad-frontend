'use strict';

/**
 * Converts the input to a currency string.
 *
 * @example
 * // foo = 102432.56
 * {{ foo | currency('$') }}
 * // => $102,432.56
 *
 * @param  {Number} input The input to convert.
 * @param  {String} sign  The currency string, defaults to '$'
 * @return {String}
 */
module.exports = function(input, sign) {
  const digitsRegex= /(\d{3})(?=\d)/g;

  if(input == null || !isFinite(input)) {
    //throw new Error('input needs to be a number');
    return 0;
  }

  sign = sign || '€';
  input = parseFloat(input);

  let strVal = Math.floor(Math.abs(input)).toString();
  let mod = strVal.length % 3;
  let h = mod > 0 ?
      (strVal.slice(0, mod) + (strVal.length > 3 ? '.' : '')) :
      '';
  let v = Math.abs(parseInt((input * 100) % 100, 10));
  let float = ',' + (v < 10 ? ('0' + v) : v);

  return (input < 0 ? '-' : '') +
         sign + h + strVal.slice(mod).replace(digitsRegex, '$1,') + float;
};
