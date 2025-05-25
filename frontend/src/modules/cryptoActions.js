import { selectedFilePath } from "./fileHandlers.js";
import { showAlert, simulateProcessing, resetProcessing } from "./uiHelpers.js";

const keyInput = document.getElementById("keyInput");
const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const generateKeyBtn = document.getElementById("generateKeyBtn");
const copyKeyBtn = document.getElementById("copyKeyBtn");

function isValidHexKey(key) {
  return /^[0-9a-fA-F]{64}$/.test(key);
}

export function setupCryptoActions(updateButtons) {
  encryptBtn.addEventListener("click", handleEncrypt);
  decryptBtn.addEventListener("click", handleDecrypt);
  generateKeyBtn.addEventListener("click", generateRandomKey);
  copyKeyBtn.addEventListener("click", handleCopyKey);

  async function generateRandomKey() {
    try {
      if (window.go?.main?.App?.GenerateEncryptionKey) {
        const hexKey = await window.go.main.App.GenerateEncryptionKey();
        keyInput.value = hexKey;
        showAlert("Encryption key generated!", "success");
      } else {
        showAlert(
          "Backend function GenerateEncryptionKey not available.",
          "error"
        );
      }
    } catch (err) {
      showAlert("Error generating key: " + err, "error");
    }
  }

  async function handleCopyKey() {
    if (!keyInput.value) {
      showAlert("No key to copy!", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(keyInput.value);
      showAlert("Key copied to clipboard!", "success");
    } catch (err) {
      showAlert("Failed to copy key: " + err, "error");
    }
  }

  async function handleEncrypt() {
    if (!selectedFilePath || !keyInput.value) {
      showAlert("Please select a file and enter an encryption key", "error");
      return;
    }
    if (!isValidHexKey(keyInput.value)) {
      showAlert(
        "Invalid key format. Please enter a 64-character hexadecimal key (0-9, a-f).",
        "error"
      );
      return;
    }
    try {
      if (window.go?.main?.App?.SelectSaveFile) {
        simulateProcessing(encryptBtn, "Encrypt");
        const outputPath = await window.go.main.App.SelectSaveFile(
          "Save Encrypted File",
          "encrypted-" + selectedFilePath.split(/[\\/]/).pop()
        );
        if (!outputPath) {
          resetProcessing(encryptBtn, "Encrypt");
          showAlert("Encryption cancelled: No output file selected", "error");
          return;
        }
        await window.go.main.App.EncryptFile(
          selectedFilePath,
          outputPath,
          keyInput.value
        );
        showAlert(
          "File encrypted successfully! Saved to: " + outputPath,
          "success"
        );
        resetProcessing(encryptBtn, "Encrypt");
      } else {
        showAlert("Backend function EncryptFile not available.", "error");
      }
    } catch (err) {
      showAlert("Error encrypting file: " + err, "error");
      resetProcessing(encryptBtn, "Encrypt");
    }
  }

  async function handleDecrypt() {
    if (!selectedFilePath || !keyInput.value) {
      showAlert("Please select a file and enter the decryption key", "error");
      return;
    }
    if (!isValidHexKey(keyInput.value)) {
      showAlert(
        "Invalid key format. Please enter a 64-character hexadecimal key (0-9, a-f).",
        "error"
      );
      return;
    }
    try {
      if (window.go?.main?.App?.SelectSaveFile) {
        simulateProcessing(decryptBtn, "Decrypt");
        const outputPath = await window.go.main.App.SelectSaveFile(
          "Save Decrypted File",
          selectedFilePath.split(/[\\/]/).pop().replace("encrypted-", "")
        );
        if (!outputPath) {
          resetProcessing(decryptBtn, "Decrypt");
          showAlert("Decryption cancelled: No output file selected", "error");
          return;
        }
        await window.go.main.App.DecryptFile(
          selectedFilePath,
          outputPath,
          keyInput.value
        );
        showAlert(
          "File decrypted successfully! Saved to: " + outputPath,
          "success"
        );
        resetProcessing(decryptBtn, "Decrypt");
      } else {
        showAlert("Backend function DecryptFile not available.", "error");
      }
    } catch (err) {
      showAlert("Error decrypting file: " + err, "error");
      resetProcessing(decryptBtn, "Decrypt");
    }
  }
}
