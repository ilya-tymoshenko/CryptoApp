import { showAlert } from "./uiHelpers.js";

const browseBtn = document.getElementById("browseBtn");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");

export let selectedFilePath = null;

export function setupFileHandlers(updateButtons) {
  if (browseBtn) {
    browseBtn.addEventListener("click", handleSelectSourceFile);
  }
  if (fileInput) {
    fileInput.addEventListener("change", handleFileSelect);
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
        // Fallback: trigger file input for browser environments
        fileInput.click();
      }
    } catch (err) {
      showAlert("Error selecting file: " + err, "error");
    }
  }

  function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
      selectedFilePath = files[0].path || files[0].name;
      displayFileInfo(files[0]);
      updateButtons();
    }
  }

  function displayFileInfo(file) {
    fileName.textContent = file.name;
  }
}

export function clearSelectedFile() {
  selectedFilePath = null;
  if (fileName) fileName.textContent = "No file selected";
  if (fileInput) fileInput.value = "";
}
