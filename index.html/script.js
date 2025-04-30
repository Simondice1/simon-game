const buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let level = 0;
let started = false;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let progress = 0;

// Set initial high score display
document.getElementById("high-score").textContent = "High Score: " + highScore;

// SOUND FUNCTION
function playSound(color) {
  const frequencies = {
    red: 261.6,
    blue: 329.6,
    green: 392.0,
    yellow: 523.3
  };

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequencies[color], audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.3);
}

// START GAME
document.getElementById("start-btn").addEventListener("click", function () {
  if (!started) {
    resetStats();
    started = true;
    nextSequence();
  }
});

// RESET SCORE BUTTON
document.getElementById("reset-score-btn").addEventListener("click", () => {
  localStorage.removeItem("highScore");
  highScore = 0;
  document.getElementById("high-score").textContent = "High Score: 0";
});

// BUTTON CLICKS
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    if (!started) return;
    const userChosenColor = this.id;
    userClickedPattern.push(userChosenColor);
    animatePress(userChosenColor);
    playSound(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
  });
});

// NEXT SEQUENCE
function nextSequence() {
  userClickedPattern = [];
  progress = 0;
  updateProgress();

  level++;
  document.getElementById("level-title").textContent = "Level " + level;

  const randomColor = buttonColors[Math.floor(Math.random() * 4)];
  gamePattern.push(randomColor);

  const shouldReplay = document.getElementById("replay-toggle").checked;
  if (shouldReplay) {
    replaySequence();
  } else {
    flashButton(randomColor);
    playSound(randomColor);
  }
}

// REPLAY FULL SEQUENCE
function replaySequence() {
  let delay = 0;
  for (let i = 0; i < gamePattern.length; i++) {
    const color = gamePattern[i];
    setTimeout(() => {
      flashButton(color);
      playSound(color);
    }, delay);
    delay += 600;
  }
}

// FLASH BUTTON
function flashButton(color) {
  const button = document.getElementById(color);
  button.style.opacity = 1;
  setTimeout(() => (button.style.opacity = 0.8), 300);
}

// CLICK ANIMATION
function animatePress(color) {
  const button = document.getElementById(color);
  button.style.opacity = 1;
  setTimeout(() => (button.style.opacity = 0.8), 100);
}

// CHECK ANSWER
function checkAnswer(currentIndex) {
  const isCorrect = gamePattern[currentIndex] === userClickedPattern[currentIndex];
  const strict = document.getElementById("strict-toggle").checked;

  if (isCorrect) {
    progress++;
    updateProgress();
    if (userClickedPattern.length === gamePattern.length) {
      updateHighScore();
      setTimeout(nextSequence, 1000);
    }
  } else {
    playSound("red");
    if (strict) {
      gameOver("Game Over! Press Start to Try Again");
    } else {
      userClickedPattern = [];
      document.getElementById("level-title").textContent = "Try Again!";
      const shouldReplay = document.getElementById("replay-toggle").checked;
      if (shouldReplay) {
        setTimeout(() => {
          replaySequence();
        }, 1000);
      }
    }
  }
}

// GAME OVER
function gameOver(message) {
  document.getElementById("level-title").textContent = message;
  started = false;
  gamePattern = [];
  level = 0;
  progress = 0;
  updateProgress();
}

// RESET STATS
function resetStats() {
  progress = 0;
  updateProgress();
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  document.getElementById("level-title").textContent = "Level 0";
}

// UPDATE HIGH SCORE
function updateHighScore() {
  const trackHighScore = document.getElementById("highscore-toggle").checked;
  if (trackHighScore && level > highScore) {
    highScore = level;
    localStorage.setItem("highScore", highScore);
    document.getElementById("high-score").textContent = "High Score: " + highScore;
  }
}

// UPDATE PROGRESS (Counter Only)
function updateProgress() {
  const showProgress = document.getElementById("progress-toggle").checked;
  const progressDisplay = document.getElementById("progress");
  progressDisplay.style.display = showProgress ? "block" : "none";
  if (showProgress) {
    progressDisplay.textContent = "Progress: " + progress;
  }
}
