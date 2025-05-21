document.addEventListener("DOMContentLoaded", function () {
  const dropArea = document.getElementById("dropArea");
  const fileInput = document.getElementById("fileInput");
  const fileInfo = document.getElementById("fileInfo");
  const fileName = document.getElementById("fileName");
  const fileSize = document.getElementById("fileSize");
  const keyInput = document.getElementById("keyInput");
  const encryptBtn = document.getElementById("encryptBtn");
  const decryptBtn = document.getElementById("decryptBtn");
  const alertBox = document.getElementById("alertBox");

  let selectedFile = null;

  // Handle drag and drop events
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
  dropArea.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", handleFileSelect);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
      handleFiles(files);
    }
  }

  function handleFileSelect(e) {
    const files = e.target.files;

    if (files.length > 0) {
      handleFiles(files);
    }
  }

  function handleFiles(files) {
    selectedFile = files[0];
    displayFileInfo(selectedFile);
    updateButtons();
  }

  function displayFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.style.display = "block";
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Update buttons based on selection
  function updateButtons() {
    if (selectedFile) {
      encryptBtn.classList.remove("disabled");
      decryptBtn.classList.remove("disabled");
    } else {
      encryptBtn.classList.add("disabled");
      decryptBtn.classList.add("disabled");
    }
  }

  // Event listeners for buttons
  encryptBtn.addEventListener("click", handleEncrypt);
  decryptBtn.addEventListener("click", handleDecrypt);

  function handleEncrypt() {
    if (!selectedFile || !keyInput.value) {
      showAlert("Please select a file and enter an encryption key", "error");
      return;
    }

    // Here we'd typically implement the actual encryption
    // For this demo, we'll just simulate the process
    simulateProcessing(encryptBtn, "Encrypt");

    setTimeout(() => {
      showAlert("File encrypted successfully! Click to download.", "success");
      simulateDownload("encrypted-" + selectedFile.name);
      resetProcessing(encryptBtn, "Encrypt");
    }, 2000);
  }

  function handleDecrypt() {
    if (!selectedFile || !keyInput.value) {
      showAlert("Please select a file and enter the decryption key", "error");
      return;
    }

    // Here we'd typically implement the actual decryption
    // For this demo, we'll just simulate the process
    simulateProcessing(decryptBtn, "Decrypt");

    setTimeout(() => {
      showAlert("File decrypted successfully! Click to download.", "success");
      simulateDownload(
        "decrypted-" + selectedFile.name.replace("encrypted-", "")
      );
      resetProcessing(decryptBtn, "Decrypt");
    }, 2000);
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

  function simulateDownload(filename) {
    // In a real implementation, this would create and trigger a download
    console.log("Downloading:", filename);
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
