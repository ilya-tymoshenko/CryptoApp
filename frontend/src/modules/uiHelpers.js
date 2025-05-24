const alertBox = document.getElementById("alertBox");

export function showAlert(message, type) {
  alertBox.textContent = message;
  alertBox.className = "alert alert-" + type;
  alertBox.style.display = "block";
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 5000);
}

export function simulateProcessing(button, originalText) {
  button.disabled = true;
  button.querySelector(".spinner").style.display = "inline-block";
  button.innerHTML = button.innerHTML.replace(originalText, "Processing...");
}

export function resetProcessing(button, originalText) {
  button.disabled = false;
  button.querySelector(".spinner").style.display = "none";
  button.innerHTML = button.innerHTML.replace("Processing...", originalText);
}