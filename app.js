const express = require("express");
const app = express();
const path = require("path");
const puzzles = require("./data/puzzles.json");

const hintEngine = require("./ai/hint-engine");
const session = require("express-session");
const { updateUserProgress, getTopPlayers } = require("./utils/progress");

app.use(
  session({
    secret: "mysteryPuzzleSecretKey",
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  if (typeof req.session.level === "undefined") {
    req.session.level = 0;
  }
  next();
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  if (!req.session.username) {
    return res.redirect("/login");
  }

  if (typeof req.session.level === "undefined") {
    req.session.level = 0;
  }

  res.render("index", {
    username: req.session.username,
    puzzle: puzzles[req.session.level],
    level: req.session.level,
    total: puzzles.length,
  });
});

app.post("/solve", (req, res) => {
  const userAnswer = req.body.answer.trim().toLowerCase();
  const correctAnswer = puzzles[req.session.level].answer.toLowerCase();

  if (userAnswer === correctAnswer) {
    // 🟩 Update user's progress
    const username = req.session.username;
    const level = req.session.level;
    const timeTaken = parseInt(req.body.timeTaken) || 60; // you can track this in frontend

    updateUserProgress(username, level, timeTaken);

    req.session.level++;

    // 🎉 Check if it's the last level
    if (req.session.level >= puzzles.length) {
      return res.json({ correct: true, finished: true });
    }

    return res.json({ correct: true });
  } else {
    return res.json({ correct: false });
  }
});

app.get("/hint", (req, res) => {
  const hint = hintEngine.getHint(req.session.level);
  res.send({ hint });
});
app.post("/restart", (req, res) => {
  req.session.level = 0;
  res.redirect("/");
});
// Login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Handle login submission
app.post("/login", (req, res) => {
  const username = req.body.username.trim();
  if (username) {
    req.session.username = username;
    req.session.level = 0;
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});
app.get("/levels", (req, res) => {
  if (!req.session.username) return res.redirect("/login");

  const userLevel = req.session.level;
  const unlockedLevels = [];

  for (let i = 0; i <= userLevel && i < puzzles.length; i++) {
    unlockedLevels.push({
      number: i + 1,
      title: puzzles[i].title || `Puzzle ${i + 1}`,
    });
  }

  res.render("levels", { levels: unlockedLevels });
});

app.get("/level/:num", (req, res) => {
  const levelNum = parseInt(req.params.num) - 1;
  if (!req.session.username) return res.redirect("/login");

  if (levelNum <= req.session.level) {
    res.render("index", {
      username: req.session.username,
      puzzle: puzzles[levelNum],
      level: levelNum,
      total: puzzles.length,
    });
  } else {
    res.send("🔒 You haven't unlocked this level yet!");
  }
});
app.get("/congrats", (req, res) => {
  if (!req.session.username) return res.redirect("/login");
  res.render("congrats", { username: req.session.username });
});
app.get("/leaderboard", (req, res) => {
  const topUsers = getTopPlayers(); // from utils/progress.js
  res.render("leaderboard", { topUsers }); // you'll need to make a leaderboard.ejs
});

app.listen(3000, () => {
  console.log("🧩 Mystery Puzzle running at http://localhost:3000");
});
