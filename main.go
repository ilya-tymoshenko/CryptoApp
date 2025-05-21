package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp() // <<< Используем наш NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "CryptoApp", // Можете изменить заголовок
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup, // <<< Вызываем метод startup нашего экземпляра app
		Bind: []interface{}{ // <<< Привязываем ВСЕ публичные методы экземпляра app
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
