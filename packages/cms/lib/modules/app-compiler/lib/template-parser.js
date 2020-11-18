var cache = {};

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
/**
 * Replaces variable placeholders inside a string with any given data. Each key
 * in `data` corresponds to a variable placeholder name in `str`.
 *
 * Usage:
 * {{{
 * template('My name is [:name] and I am [:age] years old.', { name: 'Bob', age: '65' });
 * }}}
 *
 * @param  String str     A string containing variable place-holders.
 * @param  Object data    A key, value array where each key stands for a place-holder variable
 *                        name to be replaced with value.
 * @param  Object options Available options are:
 *                        - `'before'`: The character or string in front of the name of the variable
 *                          place-holder (defaults to `'${'`).
 *                        - `'after'`: The character or string after the name of the variable
 *                          place-holder (defaults to `}`).
 *                        - `'escape'`: The character or string used to escape the before character or string
 *                          (defaults to `'\\'`).
 *                        - `'clean'`: A boolean or array with instructions for cleaning.
 * @return String
 */
function template(str, data, options) {
  var data = data || {};
  var options = options || {};

  var keys = Array.isArray(data) ? Array.apply(null, { length: data.length }).map(Number.call, Number) : Object.keys(data);
  var len = keys.length;

  if (!len) {
    return str;
  }

  var before = options.before !== undefined ? options.before : '[:';
  var after = options.after !== undefined ? options.after : ']';
  var escape = options.escape !== undefined ? options.escape : '\\';
  var clean = options.clean !== undefined ? options.clean : false;

  cache[escape] = cache[escape] || escapeRegExp(escape);
  cache[before] = cache[before] || escapeRegExp(before);
  cache[after] = cache[after] || escapeRegExp(after);

  var begin = escape ? '(' + cache[escape] + ')?' + cache[before] : cache[before];
  var end = cache[after];

  for (var i = 0; i < len; i++) {
    str = str.replace(new RegExp(begin + String(keys[i]) + end, 'g'), function(match, behind) {
      let placeholderValue = data[keys[i]];

      if (Array.isArray(placeholderValue) {
        placeholderValue.join('\n');
      }

      return behind ? match : String(placeholderValue);
    });
  }

  if (escape) {
    str = str.replace(new RegExp(escapeRegExp(escape) + escapeRegExp(before), 'g'), before);
  }
  return clean ? template.clean(str, options) : str;
}

/**
 * Cleans up a formatted string with given `options` depending
 * on the `'clean'` option. The goal of this function is to replace all whitespace
 * and unneeded mark-up around place-holders that did not get replaced by `Text::insert()`.
 *
 * @param  String str     The string to clean.
 * @param  Object options Available options are:
 *                        - `'before'`: characters marking the start of targeted substring.
 *                        - `'after'`: characters marking the end of targeted substring.
 *                        - `'escape'`: The character or string used to escape the before character or string
 *                          (defaults to `'\\'`).
 *                        - `'gap'`: Regular expression matching gaps.
 *                        - `'word'`: Regular expression matching words.
 *                        - `'replacement'`: String to use for cleaned substrings (defaults to `''`).
 * @return String         The cleaned string.
 */
template.clean = function(str, options) {
  var options = options || {};

  var before = options.before !== undefined ? options.before : '${';
  var after = options.after !== undefined ? options.after : '}';
  var escape = options.escape !== undefined ? options.escape : '\\';
  var word = options.word !== undefined ? options.word : '[\\w,.]+';
  var gap = options.gap !== undefined ? options.gap : '(\\s*(?:(?:and|or|,)\\s*)?)';
  var replacement = options.replacement !== undefined ? options.replacement : '';

  cache[escape] = cache[escape] || escapeRegExp(escape);
  cache[before] = cache[before] || escapeRegExp(before);
  cache[after] = cache[after] || escapeRegExp(after);

  var begin = escape ? '(' + cache[escape] + ')?' + cache[before] : cache[before];
  var end = cache[after];

  str = str.replace(new RegExp(gap + begin + word + end + gap, 'g'), function(match, before, behind, after) {
    if (behind) {
      return match;
    }
    if (before && after && before.trim() === after.trim()) {
      if (before.trim() || (before && after)) {
        return before + replacement;
      }
    }
    return replacement;
  });

  if (escape) {
    str = str.replace(new RegExp(escapeRegExp(escape) + escapeRegExp(before)), before);
  }
  return str;
}

module.exports = template;
