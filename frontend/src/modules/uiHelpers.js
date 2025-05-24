import { alertBox } from "./dom.js";

export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return "N/A";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

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