"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGame } from "@/components/game-context"
import { ArrowLeft, Volume2, VolumeX } from "lucide-react"
import QuestionGenerator from "@/components/question-generator"
import Timer from "@/components/timer"
import AudioManager from "@/components/audio-manager"
import Confetti from "@/components/confetti"

interface GameBoardProps {
  playerName: string
  onBackToMenu: () => void
}

export default function GameBoard({ playerName, onBackToMenu }: GameBoardProps) {
  const { currentLevel, completeLevel } = useGame()
  const [question, setQuestion] = useState<any>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [showTierComplete, setShowTierComplete] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const timerRef = useRef<any>(null)

  const getTier = (level: number) => {
    if (level <= 20) return { name: "Bronze", color: "text-amber-600", icon: "🥉", time: 20 }
    if (level <= 40) return { name: "Silver", color: "text-gray-500", icon: "🥈", time: 18 }
    if (level <= 60) return { name: "Gold", color: "text-yellow-500", icon: "🥇", time: 15 }
    if (level <= 80) return { name: "Platinum", color: "text-blue-400", icon: "💎", time: 12 }
    if (level <= 100) return { name: "Diamond", color: "text-purple-500", icon: "💎", time: 10 }
    return { name: "Legendary", color: "text-red-500", icon: "👑", time: 8 }
  }

  const currentTier = getTier(currentLevel)

  useEffect(() => {
    generateNewQuestion()
  }, [currentLevel])

  const generateNewQuestion = () => {
    const newQuestion = QuestionGenerator.generateQuestion(currentLevel)
    setQuestion(newQuestion)
    setUserAnswer("")
    setShowResult(false)
    setTimeUp(false)
    if (timerRef.current) {
      timerRef.current.reset()
    }
  }

  const handleSubmit = () => {
    if (timeUp) return

    const correct = question.answer.toString() === userAnswer.trim()
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setTimeout(() => {
        completeLevel()
        setShowLevelComplete(true)

        // Check if tier is complete
        const nextLevel = currentLevel + 1
        if (
          nextLevel > currentLevel &&
          (nextLevel === 21 ||
            nextLevel === 41 ||
            nextLevel === 61 ||
            nextLevel === 81 ||
            nextLevel === 101 ||
            nextLevel === 121)
        ) {
          setShowTierComplete(true)
        }
      }, 1500)
    }
  }

  const handleTimeUp = () => {
    setTimeUp(true)
    setShowResult(true)
    setIsCorrect(false)
  }

  const nextLevel = () => {
    setShowLevelComplete(false)
    setShowTierComplete(false)
    generateNewQuestion()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !showResult && !timeUp) {
      handleSubmit()
    }
  }

  if (showTierComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Confetti />
        <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-2xl text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tier Complete!
            </CardTitle>
            <p className="text-lg">Congratulations! You've completed the {currentTier.name} tier!</p>
          </CardHeader>
          <CardContent>
            <Button onClick={nextLevel} className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
              Continue to Next Tier
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showLevelComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-2xl text-center">
          <CardHeader>
            <div className="text-4xl mb-4">⭐</div>
            <CardTitle className="text-xl font-bold text-green-600">Level Complete!</CardTitle>
            <p>Great job! Ready for the next challenge?</p>
          </CardHeader>
          <CardContent>
            <Button onClick={nextLevel} className="w-full bg-green-500 hover:bg-green-600">
              Next Level
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <AudioManager isMuted={isMuted} />

      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBackToMenu} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentTier.icon}</span>
            <span className="text-white font-bold">Level {currentLevel}</span>
          </div>
          <Button onClick={() => setIsMuted(!isMuted)} variant="outline" size="sm">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <Timer ref={timerRef} duration={currentTier.time} onTimeUp={handleTimeUp} isActive={!showResult} />
        </div>

        {/* Question Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-center text-lg">
              {question?.type === "arithmetic" && "Solve this problem:"}
              {question?.type === "missing" && "Find the missing number:"}
              {question?.type === "comparison" && "Which is bigger?"}
              {question?.type === "logic" && "Find the pattern:"}
              {question?.type === "truefalse" && "True or False?"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-bold mb-6 p-4 bg-gray-50 rounded-lg">{question?.question}</div>

            {question?.type === "comparison" || question?.type === "truefalse" ? (
              <div className="space-y-3">
                {question.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    onClick={() => setUserAnswer(option)}
                    variant={userAnswer === option ? "default" : "outline"}
                    className="w-full"
                    disabled={showResult || timeUp}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Your answer"
                  className="w-full p-3 text-center text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  disabled={showResult || timeUp}
                />
              </div>
            )}

            {!showResult && !timeUp && (
              <Button
                onClick={handleSubmit}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
                disabled={!userAnswer.trim()}
              >
                Submit Answer
              </Button>
            )}

            {showResult && (
              <div
                className={`mt-4 p-4 rounded-lg ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                <div className="text-2xl mb-2">{isCorrect ? "🎉 Correct!" : "❌ Wrong!"}</div>
                <div className="text-lg">The answer was: {question.answer}</div>
                {!isCorrect && (
                  <Button onClick={generateNewQuestion} className="mt-3 bg-blue-500 hover:bg-blue-600">
                    Try Again
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
