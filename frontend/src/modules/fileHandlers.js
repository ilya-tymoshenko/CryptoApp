import { showAlert } from "./uiHelpers.js";

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");

export let selectedFilePath = null;

export function setupFileHandlers(updateButtons) {
  if (selectedFilePath) {
    fileInfo.style.display = "block";
    fileName.textContent = selectedFilePath.split(/[\\/]/).pop();
  }

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

  dropArea.addEventListener("click", () => {
    fileInput.click();
  });

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

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      const file = files[0];
      selectedFilePath = file.path || file.name;
      displayFileInfo(file);
      updateButtons();
    }
  }

  function handleFileSelect(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      selectedFilePath = file.path || file.name;
      displayFileInfo(file);
      updateButtons();
    }
  }

  function displayFileInfo(file) {
    fileName.textContent =
      file.name || (file.path ? file.path.split(/[\\/]/).pop() : "Unknown");
    fileInfo.style.display = "block";
  }
}

export function clearSelectedFile() {
  selectedFilePath = null;
  if (fileName) fileName.textContent = "No file selected";
  if (fileInfo) fileInfo.style.display = "none";
  if (fileInput) fileInput.value = "";
}
