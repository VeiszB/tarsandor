var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var interval;
var paused = false;

// Start is pressed
document.getElementById("timer-btn-start").addEventListener("click", function () {
  paused = false;

  document.querySelector("#timer-btn-start").classList.add("hidden");
  document.querySelector("#timer-btn-pause").classList.remove("hidden");
  document.querySelector("#timer-btn-restart").classList.remove("hidden");
  document.querySelector(".timer__canvas").classList.remove("hidden");

  enableInputEditable(false);

  const totalSeconds = calculateSeconds();
  startTimer(totalSeconds);
});

// Restart is pressed
document.getElementById("timer-btn-restart").addEventListener("click", function () {
  initialise();
});

// Pause is pressed
document.getElementById("timer-btn-pause").addEventListener("click", function () {
  paused = !paused;

  if (paused) {
    document.querySelector("#timer-btn-pause .timer-btn-play").classList.remove("hidden");
    document.querySelector("#timer-btn-pause .timer-btn-pause").classList.add("hidden");
  } else {
    document.querySelector("#timer-btn-pause .timer-btn-play").classList.add("hidden");
    document.querySelector("#timer-btn-pause .timer-btn-pause").classList.remove("hidden");
  }
});

function initialise() {
  canvas.height = 0;
  paused = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  enableInputEditable(true);
  clearInterval(interval);

  document.getElementById("input-minutes").textContent = "60";
  document.getElementById("input-seconds").textContent = "00";
  document.getElementById("timer-btn-start").classList.remove("hidden");
  document.getElementById("timer-btn-pause").classList.add("hidden");
  document.getElementById("timer-btn-restart").classList.add("hidden");
  document.querySelector("#timer-btn-pause .timer-btn-play").classList.add("hidden");
  document.querySelector("#timer-btn-pause .timer-btn-pause").classList.remove("hidden");
}

function calculateSeconds() {
  var numMinutes = parseInt(
    document.getElementById("input-minutes").textContent
  );
  var numSeconds = parseInt(
    document.getElementById("input-seconds").textContent
  );
  return numMinutes * 60 + numSeconds;
}

function startTimer(totalSeconds) {
  clearInterval(interval);
  var remaining = totalSeconds;

  canvas.width = 60 * 12;
  canvas.height = (totalSeconds / 60) * 12 + 100;

  drawBlocks(totalSeconds, 0);

  interval = setInterval(function () {
    if (paused) {
      return;
    }

    remaining--;

    if (remaining <= 0) {
      document.querySelector("#timer-btn-pause").classList.add("hidden");
      document.querySelector("#timer-btn-complete").classList.remove("hidden");
      clearInterval(interval);
    }

    var absoluteRemaining = totalSeconds - remaining;

    setRemaining(remaining);
    drawBlocks(totalSeconds, absoluteRemaining);
  }, 1000);
}

function drawBlocks(amount, absoluteRemaining) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var x = 0;
  var y = 0;

  for (var i = 0; i <= amount - 1; i++) {
    if (i % 60 === 0) {
      x = 0;
      y++;
    }

    ctx.fillStyle =
      i < absoluteRemaining ? "rgba(170,167,185, 1)" : "rgba(120,117,135,.5)";
    ctx.fillRect(x * 12, y * 12, 6, 6);

    x++;
  }
}

function setRemaining(remaining) {
  var mins = ~~((remaining % 3600) / 60);
  var secs = ~~remaining % 60;

  document.getElementById("input-minutes").textContent = pad(mins);
  document.getElementById("input-seconds").textContent = pad(secs);
}

function enableInputEditable(editable) {
  if (editable) {
    document
      .getElementById("input-minutes")
      .setAttribute("contenteditable", true);
    document
      .getElementById("input-seconds")
      .setAttribute("contenteditable", true);
  } else {
    document.getElementById("input-minutes").removeAttribute("contenteditable");
    document.getElementById("input-seconds").removeAttribute("contenteditable");
  }
}

function pad(number) {
  return Array(Math.max(2 - String(number).length + 1, 0)).join(0) + number;
}
