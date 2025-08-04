
const MODES = {
  pomodoro: { label: "Focus", duration: 25 * 60 },
  shortBreak: { label: "Break", duration: 5 * 60 },
  longBreak: { label: "Long Break", duration: 15 * 60 },
};

let currentMode = "pomodoro";
let secondsLeft = MODES[currentMode].duration;
let isRunning = false;
let interval = null;

const timerEl = document.getElementById("timer");
const startPauseBtn = document.getElementById("start-pause");
const resetBtn = document.getElementById("reset");
const themeToggle = document.getElementById("theme-toggle");
const modeButtons = document.querySelectorAll(".mode-btn");
const totalFocusEl = document.getElementById("total-focus");
const streakEl = document.getElementById("streak");

function updateTimerDisplay() {
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  timerEl.textContent = \`\${minutes}:\${seconds}\`;
}

function switchMode(mode) {
  currentMode = mode;
  secondsLeft = MODES[mode].duration;
  updateTimerDisplay();
  modeButtons.forEach(btn => btn.classList.remove("active"));
  document.querySelector(\`[data-mode="\${mode}"]\`).classList.add("active");
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(interval);
  } else {
    interval = setInterval(() => {
      if (secondsLeft <= 0) {
        clearInterval(interval);
        if (currentMode === "pomodoro") {
          incrementFocusTime();
        }
        switchMode("shortBreak");
        return;
      }
      secondsLeft--;
      updateTimerDisplay();
    }, 1000);
  }
  isRunning = !isRunning;
  startPauseBtn.textContent = isRunning ? "Pause" : "Start";
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  secondsLeft = MODES[currentMode].duration;
  updateTimerDisplay();
  startPauseBtn.textContent = "Start";
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

function loadTheme() {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
}

function incrementFocusTime() {
  let total = parseInt(localStorage.getItem("focusMinutes") || "0", 10);
  total += 25;
  localStorage.setItem("focusMinutes", total);
  totalFocusEl.textContent = total;

  const today = new Date().toISOString().split("T")[0];
  const lastDate = localStorage.getItem("lastFocusDate");
  let streak = parseInt(localStorage.getItem("streak") || "0", 10);
  if (today !== lastDate) {
    streak += 1;
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastFocusDate", today);
  }
  streakEl.textContent = streak;
}

function loadAnalytics() {
  totalFocusEl.textContent = localStorage.getItem("focusMinutes") || "0";
  streakEl.textContent = localStorage.getItem("streak") || "0";
}

document.getElementById("save-goal").onclick = () => {
  const date = document.getElementById("goal-date").value;
  const text = document.getElementById("goal-text").value;
  if (!date || !text) return;
  const list = document.getElementById("goals-list");
  const item = document.createElement("li");
  item.textContent = \`\${date}: \${text}\`;
  list.appendChild(item);
  document.getElementById("goal-date").value = "";
  document.getElementById("goal-text").value = "";
};

startPauseBtn.onclick = toggleTimer;
resetBtn.onclick = resetTimer;
themeToggle.onclick = toggleTheme;
modeButtons.forEach(btn =>
  btn.addEventListener("click", () => switchMode(btn.dataset.mode))
);

loadTheme();
loadAnalytics();
updateTimerDisplay();
