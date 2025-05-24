document.addEventListener("DOMContentLoaded", function () {
  const dropArea = document.getElementById("dropArea");
  const fileInput = document.getElementById("fileInput");
  const fileInfo = document.getElementById("fileInfo");
  const fileName = document.getElementById("fileName");
  const fileSize = document.getElementById("fileSize");
  const keyInput = document.getElementById("keyInput");
  const encryptBtn = document.getElementById("encryptBtn");
  const decryptBtn = document.getElementById("decryptBtn");
  const generateKeyBtn = document.getElementById("generateKeyBtn");
  const alertBox = document.getElementById("alertBox");

  let selectedFilePath = null;

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    dropArea.classList.add("active");
  }

  function unhighlight() {
    dropArea.classList.remove("active");
  }

  // Handle file selection
  dropArea.addEventListener("drop", handleDrop, false);
  dropArea.addEventListener("click", handleSelectSourceFile);
  fileInput.addEventListener("change", handleFileSelect);

  async function handleSelectSourceFile() {
    try {
      if (window.go && window.go.main && window.go.main.App && window.go.main.App.SelectSourceFile) {
        const filePath = await window.go.main.App.SelectSourceFile("Select File to Encrypt/Decrypt");
        if (filePath) {
          selectedFilePath = filePath;
          const fileNameOnly = filePath.split(/[\\/]/).pop();
          displayFileInfo({ name: fileNameOnly });
          updateButtons();
        }
      } else {
        showAlert("Backend function SelectSourceFile not available.", "error");
        console.error("Wails backend function SelectSourceFile not found.");
      }
    } catch (err) {
      showAlert("Error selecting file: " + err, "error");
      console.error("Error selecting file:", err);
    }
  }

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
      selectedFilePath = files[0].path; 
      displayFileInfo(files[0]);
      updateButtons();
    }
  }

  function handleFileSelect(e) {
    const files = e.target.files;

    if (files.length > 0) {
      selectedFilePath = files[0].path; 
      displayFileInfo(files[0]);
      updateButtons();
    }
  }

  function displayFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = file.size ? formatFileSize(file.size) : "N/A";
    fileInfo.style.display = "block";
  }

  function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return "N/A";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function updateButtons() {
    if (selectedFilePath) {
      encryptBtn.classList.remove("disabled");
      decryptBtn.classList.remove("disabled");
    } else {
      encryptBtn.classList.add("disabled");
      decryptBtn.classList.add("disabled");
    }
  }

  encryptBtn.addEventListener("click", handleEncrypt);
  decryptBtn.addEventListener("click", handleDecrypt);
  generateKeyBtn.addEventListener("click", generateRandomKey);

  async function generateRandomKey() {
    try {
      if (window.go && window.go.main && window.go.main.App && window.go.main.App.GenerateEncryptionKey) {
        const hexKey = await window.go.main.App.GenerateEncryptionKey();
        keyInput.value = hexKey;
        showAlert("Encryption key generated successfully!", "success");
      } else {
        showAlert("Backend function GenerateEncryptionKey not available.", "error");
        console.error("Wails backend function GenerateEncryptionKey not found.");
      }
    } catch (err) {
      showAlert("Error generating key: " + err, "error");
      console.error("Error generating key:", err);
    }
  }

  async function handleEncrypt() {
    if (!selectedFilePath || !keyInput.value) {
      showAlert("Please select a file and enter an encryption key", "error");
      return;
    }

    try {
      if (window.go && window.go.main && window.go.main.App && window.go.main.App.SelectSaveFile) {
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

        const result = await window.go.main.App.EncryptFile(
          selectedFilePath,
          outputPath,
          keyInput.value
        );

        showAlert("File encrypted successfully! Saved to: " + outputPath, "success");
        resetProcessing(encryptBtn, "Encrypt");
      } else {
        showAlert("Backend function EncryptFile not available.", "error");
        console.error("Wails backend function EncryptFile not found.");
      }
    } catch (err) {
      showAlert("Error encrypting file: " + err, "error");
      console.error("Error encrypting file:", err);
      resetProcessing(encryptBtn, "Encrypt");
    }
  }

  async function handleDecrypt() {
    if (!selectedFilePath || !keyInput.value) {
      showAlert("Please select a file and enter the decryption key", "error");
      return;
    }

    try {
      if (window.go && window.go.main && window.go.main.App && window.go.main.App.SelectSaveFile) {
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

        const result = await window.go.main.App.DecryptFile(
          selectedFilePath,
          outputPath,
          keyInput.value
        );

        showAlert("File decrypted successfully! Saved to: " + outputPath, "success");
        resetProcessing(decryptBtn, "Decrypt");
      } else {
        showAlert("Backend function DecryptFile not available.", "error");
        console.error("Wails backend function DecryptFile not found.");
      }
    } catch (err) {
      showAlert("Error decrypting file: " + err, "error");
      console.error("Error decrypting file:", err);
      resetProcessing(decryptBtn, "Decrypt");
    }
  }

  function simulateProcessing(button, originalText) {
    button.disabled = true;
    button.querySelector(".spinner").style.display = "inline-block";
    button.innerHTML = button.innerHTML.replace(originalText, "Processing...");
  }

  function resetProcessing(button, originalText) {
    button.disabled = false;
    button.querySelector(".spinner").style.display = "none";
    button.innerHTML = button.innerHTML.replace("Processing...", originalText);
  }

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = "alert alert-" + type;
    alertBox.style.display = "block";

    setTimeout(() => {
      alertBox.style.display = "none";
    }, 5000);
  }
});