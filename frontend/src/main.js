import {
  setupFileHandlers,
  clearSelectedFile,
} from "./modules/fileHandlers.js";
import { setupCryptoActions } from "./modules/cryptoActions.js";

const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");

function updateButtons() {
  import("./modules/fileHandlers.js").then(({ selectedFilePath }) => {
    if (selectedFilePath) {
      encryptBtn.classList.remove("disabled");
      decryptBtn.classList.remove("disabled");
    } else {
      encryptBtn.classList.add("disabled");
      decryptBtn.classList.add("disabled");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupFileHandlers(updateButtons);
  setupCryptoActions(updateButtons);

  // Add clear key button logic
  const clearBtn = document.getElementById("clearBtn");
  const keyInput = document.getElementById("keyInput");
  if (clearBtn && keyInput) {
    clearBtn.addEventListener("click", () => {
      keyInput.value = "";
      clearSelectedFile();
      updateButtons();
    });
  }
});
