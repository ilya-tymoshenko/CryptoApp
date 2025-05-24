import { setupFileHandlers } from "./modules/fileHandlers.js";
import { setupCryptoActions } from "./modules/cryptoActions.js";
import { encryptBtn, decryptBtn } from "./modules/dom.js";

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
});