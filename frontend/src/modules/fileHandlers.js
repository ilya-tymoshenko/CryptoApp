import { showAlert } from "./uiHelpers.js";

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");

export let selectedFilePath = null;

export function setupFileHandlers(updateButtons) {
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  dropArea.addEventListener("drop", handleDrop, false);
  dropArea.addEventListener("click", handleSelectSourceFile);
  fileInput.addEventListener("change", handleFileSelect);

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function highlight() {
    dropArea.classList.add("active");
  }

  function unhighlight() {
    dropArea.classList.remove("active");
  }

  async function handleSelectSourceFile() {
    try {
      if (window.go?.main?.App?.SelectSourceFile) {
        const filePath = await window.go.main.App.SelectSourceFile(
          "Select File to Encrypt/Decrypt"
        );
        if (filePath) {
          selectedFilePath = filePath;
          const fileNameOnly = filePath.split(/[\\/]/).pop();
          displayFileInfo({ name: fileNameOnly });
          updateButtons();
        }
      } else {
        showAlert("Backend function SelectSourceFile not available.", "error");
      }
    } catch (err) {
      showAlert("Error selecting file: " + err, "error");
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
    fileInfo.style.display = "block";
  }
}
