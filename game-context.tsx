"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface GameContextType {
  currentLevel: number
  score: number
  unlockedLevels: number
  setCurrentLevel: (level: number) => void
  setScore: (score: number) => void
  setUnlockedLevels: (levels: number) => void
  completeLevel: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [unlockedLevels, setUnlockedLevels] = useState(1)

  useEffect(() => {
    const savedLevel = localStorage.getItem("currentLevel")
    const savedScore = localStorage.getItem("score")
    const savedUnlocked = localStorage.getItem("unlockedLevels")

    if (savedLevel) setCurrentLevel(Number.parseInt(savedLevel))
    if (savedScore) setScore(Number.parseInt(savedScore))
    if (savedUnlocked) setUnlockedLevels(Number.parseInt(savedUnlocked))
  }, [])

  const completeLevel = () => {
    const newScore = score + 100
    const newUnlocked = Math.max(unlockedLevels, currentLevel + 1)

    setScore(newScore)
    setUnlockedLevels(newUnlocked)

    localStorage.setItem("score", newScore.toString())
    localStorage.setItem("unlockedLevels", newUnlocked.toString())
  }

  const updateCurrentLevel = (level: number) => {
    setCurrentLevel(level)
    localStorage.setItem("currentLevel", level.toString())
  }

  return (
    <GameContext.Provider
      value={{
        currentLevel,
        score,
        unlockedLevels,
        setCurrentLevel: updateCurrentLevel,
        setScore,
        setUnlockedLevels,
        completeLevel,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
