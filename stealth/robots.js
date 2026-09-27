'use strict';

/**
 * Minimal robots.txt support for the adaptive engine.
 *
 * The primary wget path respects robots.txt, so the fallback engine matches
 * that behaviour: a URL whose path matches a Disallow rule for the "*"
 * user-agent is skipped. Rules that do not target "*" are ignored, and
 * anything the parser cannot make sense of is allowed (matching wget's
 * "robots.txt missing means allowed" behaviour).
 */

function parseRobots(text) {
  var groups = [];
  var current = null;
  String(text || '').split(/\r?\n/).forEach(function (rawLine) {
    var line = rawLine.trim();
    var comment = line.indexOf('#');
    if (comment >= 0) line = line.slice(0, comment).trim();
    if (!line) return;
    var match = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!match) return;
    var key = match[1].toLowerCase();
    var value = match[2].trim();
    if (key === 'user-agent') {
      if (value === '*' || value === '') {
        current = { disallows: [] };
        groups.push(current);
      } else {
        current = null;
      }
    } else if (key === 'disallow' && current && value) {
      current.disallows.push(value);
    }
  });
  return groups;
}

/**
 * Turn a Disallow pattern into a RegExp. `*` expands to any characters and a
 * trailing `$` anchors the end of the path, which is the common form used by
 * sites to block a file rather than a folder.
 */
function disallowToRegExp(pattern) {
  var anchored = pattern.slice(-1) === '$';
  var body = anchored ? pattern.slice(0, -1) : pattern;
  var source = '';
  for (var i = 0; i < body.length; i++) {
    var char = body.charAt(i);
    if (char === '*') {
      source += '.*';
    } else if (/[\\^$.|?+()[\]{}]/.test(char)) {
      source += '\\' + char;
    } else {
      source += char;
    }
  }
  return new RegExp('^' + source + (anchored ? '$' : ''));
}

function isPathAllowed(pathname, groups) {
  if (!pathname || !groups || !groups.length) return true;
  for (var g = 0; g < groups.length; g++) {
    for (var d = 0; d < groups[g].disallows.length; d++) {
      if (disallowToRegExp(groups[g].disallows[d]).test(pathname)) return false;
    }
  }
  return true;
}

module.exports = {
  parseRobots: parseRobots,
  disallowToRegExp: disallowToRegExp,
  isPathAllowed: isPathAllowed
};