"use client"

import { useState, useEffect } from "react"
import { GameProvider } from "@/components/game-context"
import ProfileSetup from "@/components/profile-setup"
import GameBoard from "@/components/game-board"
import MainMenu from "@/components/main-menu"

export default function Home() {
  const [gameState, setGameState] = useState<"setup" | "menu" | "playing">("setup")
  const [playerName, setPlayerName] = useState("")

  useEffect(() => {
    const savedName = localStorage.getItem("playerName")
    if (savedName) {
      setPlayerName(savedName)
      setGameState("menu")
    }
  }, [])

  const handleProfileComplete = (name: string) => {
    setPlayerName(name)
    localStorage.setItem("playerName", name)
    setGameState("menu")
  }

  const startGame = () => {
    setGameState("playing")
  }

  const backToMenu = () => {
    setGameState("menu")
  }

  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        {gameState === "setup" && <ProfileSetup onComplete={handleProfileComplete} />}
        {gameState === "menu" && (
          <MainMenu playerName={playerName} onStartGame={startGame} onNameChange={setPlayerName} />
        )}
        {gameState === "playing" && <GameBoard playerName={playerName} onBackToMenu={backToMenu} />}
      </div>
    </GameProvider>
  )
}
