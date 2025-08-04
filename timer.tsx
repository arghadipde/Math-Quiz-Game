"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { Clock } from "lucide-react"

interface TimerProps {
  duration: number
  onTimeUp: () => void
  isActive: boolean
}

const Timer = forwardRef<any, TimerProps>(({ duration, onTimeUp, isActive }, ref) => {
  const [timeLeft, setTimeLeft] = useState(duration)

  useImperativeHandle(ref, () => ({
    reset: () => setTimeLeft(duration),
  }))

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, onTimeUp])

  const percentage = (timeLeft / duration) * 100
  const isLow = timeLeft <= 5

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Clock className={`w-5 h-5 ${isLow ? "text-red-500" : "text-blue-500"}`} />
        <span className={`text-2xl font-bold ${isLow ? "text-red-500" : "text-blue-500"}`}>{timeLeft}s</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ${isLow ? "bg-red-500" : "bg-blue-500"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
})

Timer.displayName = "Timer"

export default Timer
