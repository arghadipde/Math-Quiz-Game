"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useGame } from "@/components/game-context"
import { Play, Trophy, Edit3, User } from "lucide-react"
import LevelSelector from "@/components/level-selector"

interface MainMenuProps {
  playerName: string
  onStartGame: () => void
  onNameChange: (name: string) => void
}

export default function MainMenu({ playerName, onStartGame, onNameChange }: MainMenuProps) {
  const { currentLevel, score, unlockedLevels } = useGame()
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(playerName)
  const [showLevelSelector, setShowLevelSelector] = useState(false)

  const getTier = (level: number) => {
    if (level <= 20) return { name: "Bronze", color: "text-amber-600", icon: "🥉" }
    if (level <= 40) return { name: "Silver", color: "text-gray-500", icon: "🥈" }
    if (level <= 60) return { name: "Gold", color: "text-yellow-500", icon: "🥇" }
    if (level <= 80) return { name: "Platinum", color: "text-blue-400", icon: "💎" }
    if (level <= 100) return { name: "Diamond", color: "text-purple-500", icon: "💎" }
    return { name: "Legendary", color: "text-red-500", icon: "👑" }
  }

  const currentTier = getTier(currentLevel)

  const handleNameEdit = () => {
    if (isEditingName && newName.trim()) {
      onNameChange(newName.trim())
      localStorage.setItem("playerName", newName.trim())
    }
    setIsEditingName(!isEditingName)
  }

  if (showLevelSelector) {
    return <LevelSelector onBack={() => setShowLevelSelector(false)} onStartLevel={onStartGame} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-32 h-8 text-sm"
                  maxLength={20}
                />
              ) : (
                <span className="font-bold text-lg">{playerName}</span>
              )}
              <Button variant="ghost" size="sm" onClick={handleNameEdit} className="p-1 h-8 w-8">
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{currentTier.icon}</span>
              <span className={`font-bold ${currentTier.color}`}>{currentTier.name}</span>
            </div>
            <p className="text-sm text-gray-600">
              Level {currentLevel} • Score: {score}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={onStartGame}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg py-6"
          >
            <Play className="w-5 h-5 mr-2" />
            Continue Level {currentLevel}
          </Button>

          <Button onClick={() => setShowLevelSelector(true)} variant="outline" className="w-full py-4">
            <Trophy className="w-5 h-5 mr-2" />
            Select Level
          </Button>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium">{unlockedLevels}/120</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(unlockedLevels / 120) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
