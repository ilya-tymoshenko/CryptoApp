package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
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
		// Filters: []runtime.FileFilter{
		// 	{DisplayName: "All Files(*.*)", Pattern: "*.*"},
		// },
	})

	if err != nil {
		runtime.LogError(a.ctx, fmt.Sprintf("Error selecting source file: %v", err))
		return "", fmt.Errorf("error while selecting file: %w", err)
	}

	if filePath == "" {
		runtime.LogInfo(a.ctx, "The source file selection was cancelled by the user.")
		return "", nil
	}

	runtime.LogInfo(a.ctx, fmt.Sprintf("Source file selected: %s", filePath))
	return filePath, nil
}

func (a *App) SelectSaveFile(dialogTitle string, defaultFileName string) (string, error) {
	savePath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           dialogTitle,
		DefaultFilename: defaultFileName,
		// Filters: []runtime.FileFilter{
		// 	{DisplayName: "Encrypted Files (*.enc)", Pattern: "*.enc"},
		// },
	})

	if err != nil {
		runtime.LogError(a.ctx, fmt.Sprintf("Error while selecting save path: %v", err))
		return "", fmt.Errorf("error while selecting save path: %w", err)
	}

	if savePath == "" {
		runtime.LogInfo(a.ctx, "Save path selection cancelled by user.")
		return "", nil
	}

	runtime.LogInfo(a.ctx, fmt.Sprintf("The save path has been selected: %s", savePath))
	return savePath, nil
}

func (a *App) GenerateEncryptionKey(byteLength int) (string, error) {
	runtime.LogInfo(a.ctx, fmt.Sprintf("Request to generate a key of length %d bytes", byteLength))

	if byteLength <= 0 {
		runtime.LogInfo(a.ctx, fmt.Sprintf("Incorrect key length requested (%d bytes), default length of 32 bytes used.", byteLength))
		byteLength = 32
	} else if !(byteLength == 16 || byteLength == 24 || byteLength == 32) {
		runtime.LogInfo(a.ctx, fmt.Sprintf("A non-standard key length (%d bytes) was requested for AES, using the closest match or default (32 bytes). Recommended 16, 24, or 32.", byteLength))
	}

	const keyByteLength = 32 // AES-256

	key := make([]byte, keyByteLength)

	if _, err := rand.Read(key); err != nil {
		runtime.LogError(a.ctx, fmt.Sprintf("Critical error generating random bytes for key: %v", err))
		return "", fmt.Errorf("failed to generate key: %w", err)
	}

	hexKey := hex.EncodeToString(key)

	runtime.LogInfo(a.ctx, fmt.Sprintf("Generated key length %d bytes. HEX: %s", keyByteLength, hexKey))
	return hexKey, nil
}

func (a *App) EncryptFile(inputPath string, outputPath string, key string) (string, error) {
	runtime.LogInfo(a.ctx, fmt.Sprintf("Request to encrypt a file: %s -> %s", inputPath, outputPath))

	if inputPath == "" || outputPath == "" || key == "" {
		return "", fmt.Errorf("not all required parameters are specified: path to source file, path to save or key")
	}

	message := fmt.Sprintf("File '%s' would be encrypted and stored as '%s'", inputPath, outputPath)
	runtime.LogInfo(a.ctx, message)
	return message, nil
}

func (a *App) DecryptFile(inputPath string, outputPath string, key string) (string, error) {
	runtime.LogInfo(a.ctx, fmt.Sprintf("Request to decrypt file: %s -> %s", inputPath, outputPath))

	if inputPath == "" || outputPath == "" || key == "" {
		return "", fmt.Errorf("not all required parameters are specified: path to source file, path to save or key")
	}

	message := fmt.Sprintf("File '%s' would be decrypted and saved as '%s'", inputPath, outputPath)
	runtime.LogInfo(a.ctx, message)
	return message, nil
}
