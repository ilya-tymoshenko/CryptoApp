const alertBox = document.getElementById("alertBox");

const progressBarContainer = document.querySelector(
  ".fake-progress-bar-container"
);
const progressBar = document.querySelector(".fake-progress-bar");
let progressInterval = null;
let progressValue = 0;

function startFakeProgressBar() {
  if (!progressBarContainer || !progressBar) return;
  progressBarContainer.style.display = "block";
  progressValue = Math.random() * 3 + 2;
  progressBar.style.width = progressValue + "%";
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (progressValue < 70) {
      progressValue += Math.random() * 4 + 2;
    } else if (progressValue < 90) {
      progressValue += Math.random() * 1.5 + 0.5;
    } else if (progressValue < 98) {
      progressValue += Math.random() * 0.4 + 0.1;
    }
    if (progressValue > 98) progressValue = 98;
    progressBar.style.width = progressValue + "%";
  }, 180);
}

function finishFakeProgressBar() {
  if (!progressBarContainer || !progressBar) return;
  clearInterval(progressInterval);
  progressBar.style.width = "100%";
  setTimeout(() => {
    progressBarContainer.style.display = "none";
    progressBar.style.width = "0%";
  }, 400);
}

export function showAlert(message, type) {
  alertBox.textContent = message;
  alertBox.className = "alert alert-" + type;
  alertBox.style.display = "block";
  if (type === "error") {
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 12000);
  } else {
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 6000);
  }
}

export function simulateProcessing(button, originalText) {
  button.disabled = true;
  button.querySelector(".spinner").style.display = "inline-block";
  button.innerHTML = button.innerHTML.replace(originalText, "Processing...");
  startFakeProgressBar();
}

export function resetProcessing(button, originalText) {
  button.disabled = false;
  button.querySelector(".spinner").style.display = "none";
  button.innerHTML = button.innerHTML.replace("Processing...", originalText);
  finishFakeProgressBar();
}
