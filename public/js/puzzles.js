async function getHint() {
  const res = await fetch("/hint");
  const data = await res.json();
  const hintBox = document.getElementById("hintBox");
  hintBox.innerText = "💡 Hint: " + data.hint;
}

document
  .getElementById("puzzleForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const answer = document.getElementById("answer").value;

    const res = await fetch("/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `answer=${encodeURIComponent(answer)}`,
    });

    const data = await res.json();

    const feedback = document.getElementById("feedback");
    if (data.correct) {
      feedback.textContent = "✅ Correct!";
      feedback.style.color = "green";

      if (data.finished) {
        setTimeout(() => {
          window.location.href = "/congrats";
        }, 1000);
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } else {
      feedback.textContent = "❌ Oops! Try again.";
      feedback.style.color = "red";
    }
  });
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
}

// Apply saved theme on load
window.addEventListener("DOMContentLoaded", () => {
  const darkModeEnabled = localStorage.getItem("darkMode") === "true";
  if (darkModeEnabled) {
    document.body.classList.add("dark-mode");
  }
  // 2) Progress bar
  const progressContainer = document.getElementById("progressContainer");
  const currentLevel = parseInt(progressContainer.dataset.level);
  const totalLevels = parseInt(progressContainer.dataset.total);
  const percent = Math.floor((currentLevel / totalLevels) * 100);
  document.getElementById("progressBar").style.width = percent + "%";
});

// Set progress bar width based on level
function updateProgressBar(current, total) {
  const percent = Math.floor((current / total) * 100);
  document.getElementById("progressBar").style.width = percent + "%";
}

// Get data from HTML using dataset (you’ll add this next)
window.addEventListener("DOMContentLoaded", () => {
  const progressContainer = document.getElementById("progressContainer");
  const currentLevel = parseInt(progressContainer.dataset.level);
  const totalLevels = parseInt(progressContainer.dataset.total);
  updateProgressBar(currentLevel, totalLevels);
});
