"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGame } from "@/components/game-context"
import { ArrowLeft, Lock } from "lucide-react"

interface LevelSelectorProps {
  onBack: () => void
  onStartLevel: () => void
}

export default function LevelSelector({ onBack, onStartLevel }: LevelSelectorProps) {
  const { currentLevel, unlockedLevels, setCurrentLevel } = useGame()

  const getTier = (level: number) => {
    if (level <= 20) return { name: "Bronze", color: "bg-amber-100 border-amber-300", icon: "🥉" }
    if (level <= 40) return { name: "Silver", color: "bg-gray-100 border-gray-300", icon: "🥈" }
    if (level <= 60) return { name: "Gold", color: "bg-yellow-100 border-yellow-300", icon: "🥇" }
    if (level <= 80) return { name: "Platinum", color: "bg-blue-100 border-blue-300", icon: "💎" }
    if (level <= 100) return { name: "Diamond", color: "bg-purple-100 border-purple-300", icon: "💎" }
    return { name: "Legendary", color: "bg-red-100 border-red-300", icon: "👑" }
  }

  const tiers = [
    { name: "Bronze", range: [1, 20], icon: "🥉" },
    { name: "Silver", range: [21, 40], icon: "🥈" },
    { name: "Gold", range: [41, 60], icon: "🥇" },
    { name: "Platinum", range: [61, 80], icon: "💎" },
    { name: "Diamond", range: [81, 100], icon: "💎" },
    { name: "Legendary", range: [101, 120], icon: "👑" },
  ]

  const handleLevelSelect = (level: number) => {
    setCurrentLevel(level)
    onStartLevel()
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">Select Level</h1>
        </div>

        <div className="space-y-6">
          {tiers.map((tier) => (
            <Card key={tier.name} className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{tier.icon}</span>
                  {tier.name} Tier
                  <span className="text-sm font-normal text-gray-600">
                    (Levels {tier.range[0]}-{tier.range[1]})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {Array.from({ length: tier.range[1] - tier.range[0] + 1 }, (_, i) => {
                    const level = tier.range[0] + i
                    const isUnlocked = level <= unlockedLevels
                    const isCurrent = level === currentLevel
                    const tierInfo = getTier(level)

                    return (
                      <Button
                        key={level}
                        onClick={() => isUnlocked && handleLevelSelect(level)}
                        disabled={!isUnlocked}
                        variant={isCurrent ? "default" : "outline"}
                        className={`
                          aspect-square p-0 text-sm font-bold
                          ${isCurrent ? "bg-blue-500 text-white" : ""}
                          ${!isUnlocked ? "opacity-50" : ""}
                          ${tierInfo.color}
                        `}
                      >
                        {isUnlocked ? level : <Lock className="w-3 h-3" />}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
