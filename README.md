# CryptoApp - Secure File Encryption & Decryption

CryptoApp is a desktop application built with Wails (Go backend, JavaScript frontend) that allows you to securely encrypt and decrypt your files locally on your computer. It is designed to work on **Windows, macOS, and Linux**. The application uses AES-GCM for strong, authenticated encryption.

## Features

* **File Encryption:** Encrypt any file using a user-provided or generated key.
* **File Decryption:** Decrypt files that were previously encrypted with CryptoApp using the correct key.
* **Secure Key Generation:** Generate cryptographically strong 32-byte (256-bit) encryption keys, provided as a 64-character HEX string.
* **Key Management:**
    * Manually input your encryption key.
    * Copy generated keys to the clipboard.
    * Clear the key input field.
* **Native File Dialogs:** Uses native OS dialogs for selecting source files and choosing save locations.
* **User Feedback:** Provides alerts for success and error messages.
* **Local Processing:** All encryption and decryption operations happen locally on your computer. Files are not uploaded to any server.

## Technology Stack

* **Wails (v2.10.1):** Framework for building cross-platform desktop apps with Go and web technologies.
* **Go (Golang):** For the backend logic, including cryptographic operations (AES-GCM).
* **JavaScript (ES Modules):** For the frontend logic.
* **HTML & CSS:** For the user interface structure and styling.

## How to Use

### Encryption

1.  **Launch CryptoApp.**
2.  **Select File:** Click the "Browse" button (or the drop area) to open a system dialog and choose the file you want to encrypt. The selected file name will be displayed.
3.  **Encryption Key:**
    * **Generate Key:** Click the "Generate Random Key" button. A secure 64-character hexadecimal key will be generated and displayed in the key input field. It will also be copied to your clipboard.
    * **Manual Input:** Alternatively, you can type or paste your own 64-character hexadecimal encryption key into the input field.
4.  **Encrypt:** Click the "Encrypt" button.
5.  **Save Encrypted File:** A system dialog will appear, allowing you to choose the location and name for the encrypted output file.
6.  **Notification:** You will receive an alert message indicating success or failure.

### Decryption

1.  **Launch CryptoApp.**
2.  **Select Encrypted File:** Click the "Browse" button (or the drop area) to select the file you previously encrypted.
3.  **Encryption Key:** Enter the *exact* 64-character hexadecimal key that was used to encrypt the file into the key input field.
4.  **Decrypt:** Click the "Decrypt" button.
5.  **Save Decrypted File:** A system dialog will appear, allowing you to choose the location and name for the decrypted output file.
6.  **Notification:** You will receive an alert message indicating success or failure.

## Security Notes

* **Key Management is Crucial:** The security of your encrypted files depends entirely on the secrecy and strength of your encryption key.
    * If you use the "Generate Random Key" feature, ensure you save the generated 64-character HEX key in a very secure location (e.g., a password manager). **If you lose this key, you will permanently lose access to your encrypted files.**
    * If you manually enter a key, ensure it is cryptographically strong. The application expects a 64-character HEX string for AES-256.
* **AES-GCM Encryption:** This application uses AES-256 in GCM mode, which provides strong encryption and authenticity, protecting against unauthorized access and tampering.
* **Local Processing:** All file processing (reading, encryption, decryption, writing) occurs locally on your computer. Your files and keys are not sent to any external servers. Data is processed by the local Go backend.

## Building from Source (Optional)

If you wish to build the application from its source code:

1.  Ensure you have [Go](https://golang.org/dl/) installed (version compatible with Wails v2.10.1, e.g., Go 1.18+).
2.  Ensure you have the [Wails CLI](https://wails.io/docs/gettingstarted/installation) (v2.10.1 or compatible) installed.
3.  Ensure you have [Node.js/npm](https://nodejs.org/) installed (for frontend dependencies).
4.  Clone the repository (if applicable).
5.  Navigate to the project's root directory in your terminal.
6.  Run `wails build`. This will typically build an application for your current operating system (Windows, macOS, or Linux).
7.  The executable will be located in the `build/bin` directory.

## Authors

* **Illia Tymoshenko**
* **Paul Shkoda**