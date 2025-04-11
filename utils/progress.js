const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/progress.json");

function loadProgress() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function saveProgress(progress) {
  fs.writeFileSync(filePath, JSON.stringify(progress, null, 2));
}

function updateUserProgress(username, level, timeTaken) {
  let progress = loadProgress();
  let user = progress.find((u) => u.username === username);

  const newAchievements = [];

  if (!user) {
    user = { username, level, timeTaken, achievements: [] };
    progress.push(user);
    newAchievements.push("First Puzzle Solved");
  } else {
    if (level > user.level) user.level = level;
    if (timeTaken < user.timeTaken || !user.timeTaken)
      user.timeTaken = timeTaken;

    if (level >= 5 && !user.achievements.includes("5 Levels Cleared")) {
      newAchievements.push("5 Levels Cleared");
    }
  }

  user.achievements = Array.from(
    new Set([...user.achievements, ...newAchievements])
  );
  saveProgress(progress);
}

function getTopPlayers() {
  const progress = loadProgress();
  return progress
    .sort((a, b) => b.level - a.level || a.timeTaken - b.timeTaken)
    .slice(0, 10);
}

module.exports = {
  updateUserProgress,
  getTopPlayers,
  loadProgress,
};
