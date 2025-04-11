// ai/hint-engine.js

// We'll load puzzles with their hints here
const puzzles = require("../data/puzzles.json");

// hintCount tracks how many hints have been given per puzzle
let hintCountPerLevel = {};

/**
 * getHint(level) returns the next hint in the puzzle's hints array.
 * If we run out of hints, we just return the last one.
 */
function getHint(level) {
  if (!hintCountPerLevel[level]) {
    hintCountPerLevel[level] = 0;
  }

  const puzzle = puzzles[level];
  if (!puzzle || !puzzle.hints) {
    return "No hint available for this puzzle.";
  }

  const hints = puzzle.hints;
  const index = hintCountPerLevel[level];

  // If we've given all hints, just return the last one
  const hint = index < hints.length ? hints[index] : hints[hints.length - 1];

  hintCountPerLevel[level]++;
  return hint;
}

module.exports = {
  getHint,
  // optional reset if you want to clear hint counts for a user
  resetHints() {
    hintCountPerLevel = {};
  },
};
