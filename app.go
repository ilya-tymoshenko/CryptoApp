package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	runtime.LogInfo(a.ctx, "CryptoApp application is launched. Backend is ready.")
}

func (a *App) shutdown(ctx context.Context) {
	runtime.LogInfo(a.ctx, "CryptoApp application is closing.")
}

func (a *App) SelectSourceFile(dialogTitle string) (string, error) {
	filePath, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: dialogTitle,
	})

	if err != nil {
		runtime.LogError(a.ctx, fmt.Sprintf("Error selecting source file: %v", err))
		return "", fmt.Errorf("error while selecting source file: %w", err)
	}

	if filePath == "" {
		runtime.LogInfo(a.ctx, "Source file selection was cancelled by the user.")
		return "", nil
	}

	runtime.LogInfo(a.ctx, fmt.Sprintf("Source file selected: %s", filePath))
	return filePath, nil
}

func (a *App) SelectSaveFile(dialogTitle string, defaultFileName string) (string, error) {
	savePath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           dialogTitle,
		DefaultFilename: defaultFileName,
	})

	if err != nil {
		runtime.LogError(a.ctx, fmt.Sprintf("Error while selecting save path: %v", err))
		return "", fmt.Errorf("error while selecting save path: %w", err)
	}

	if savePath == "" {
		runtime.LogInfo(a.ctx, "Save path selection cancelled by user.")
		return "", nil
	}

	runtime.LogInfo(a.ctx, fmt.Sprintf("Save path selected: %s", savePath))
	return savePath, nil
}

func (a *App) GenerateEncryptionKey() (string, error) {
	const keyByteLength = 32
	runtime.LogInfo(a.ctx, fmt.Sprintf("Request to generate a key of length %d bytes", keyByteLength))

	key := make([]byte, keyByteLength)

	if _, err := rand.Read(key); err != nil {
		runtime.LogError(a.ctx, fmt.Sprintf("Critical error generating random bytes for key: %v", err))
		return "", fmt.Errorf("failed to generate key: %w", err)
	}

	hexKey := hex.EncodeToString(key)

	runtime.LogInfo(a.ctx, fmt.Sprintf("Generated key of length %d bytes. HEX: %s", keyByteLength, hexKey))
	return hexKey, nil
}

func (a *App) EncryptFile(inputPath string, outputPath string, keyHex string) (string, error) {
	runtime.LogInfo(a.ctx, fmt.Sprintf("Attempting to encrypt file: '%s' to '%s'", inputPath, outputPath))

	if inputPath == "" {
		return "", fmt.Errorf("source file path not provided")
	}
	if outputPath == "" {
		return "", fmt.Errorf("output file path not provided")
	}
	if keyHex == "" {
		return "", fmt.Errorf("encryption key not provided")
	}

	keyBytes, err := hex.DecodeString(keyHex)
	if err != nil {
		runtime.LogError(a.ctx, fmt.Sprintf("Error decoding HEX key: %v", err))
		return "", fmt.Errorf("invalid key format (expected HEX string): %w", err)
	}

	const expectedKeyLength = 32
	if len(keyBytes) != expectedKeyLength {
		errMsg := fmt.Sprintf("invalid key length after decoding: received %d bytes, expected %d bytes", len(keyBytes), expectedKeyLength)
		runtime.LogError(a.ctx, errMsg)
		return "", fmt.Errorf(errMsg)
	}
	runtime.LogInfo(a.ctx, fmt.Sprintf("Key successfully decoded, length: %d bytes", len(keyBytes)))

	fileData, err := os.ReadFile(inputPath)
	if err != nil {
		runtime.LogError(a.ctx, fmt.Sprintf("Error reading source file '%s': %v", inputPath, err))
		return "", fmt.Errorf("failed to read source file: %w", err)
	}
	runtime.LogInfo(a.ctx, fmt.Sprintf("Source file '%s' successfully read, size: %d bytes", inputPath, len(fileData)))

	var processedData []byte
	processedData = append(processedData, []byte("PSEUDO_ENCRYPTED_BY_CRYPTOAPP_PREFIX_")...)
	processedData = append(processedData, fileData...)
	// In a real scenario, keyBytes would be used here with an encryption algorithm.

	err = os.WriteFile(outputPath, processedData, 0644)
	if err != nil {
		runtime.LogError(a.ctx, fmt.Sprintf("Error writing processed file '%s': %v", outputPath, err))
		return "", fmt.Errorf("failed to write processed file: %w", err)
	}

	successMessage := fmt.Sprintf("File '%s' successfully 'pseudo-encrypted' and saved as '%s'", inputPath, outputPath)
	runtime.LogInfo(a.ctx, successMessage)
	return successMessage, nil
}

func (a *App) DecryptFile(inputPath string, outputPath string, keyHex string) (string, error) {
	runtime.LogInfo(a.ctx, fmt.Sprintf("Attempting to decrypt file: '%s' to '%s'", inputPath, outputPath))

	if inputPath == "" {
		return "", fmt.Errorf("source file path not provided")
	}
	if outputPath == "" {
		return "", fmt.Errorf("output file path not provided")
	}
	if keyHex == "" {
		return "", fmt.Errorf("decryption key not provided")
	}

	// Placeholder for actual decryption logic
	// TODO: Decode keyHex, read inputPath, "pseudo-decrypt", write outputPath

	message := fmt.Sprintf("File '%s' would be decrypted with key (info: %s) and saved as '%s'. Decryption not yet implemented.", inputPath, "key_placeholder", outputPath)
	runtime.LogInfo(a.ctx, message)
	return message, nil
}
