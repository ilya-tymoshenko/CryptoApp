package main

import (
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet basic Greet function
func (a *App) Greet(name string) string {
	if name == "" {
		name = "World" // По умолчанию, если имя не передано
	}
	return fmt.Sprintf("Привет, %s! Это сообщение от Go!", name)
}
