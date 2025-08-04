"use client"

import { useEffect, useRef } from "react"

interface AudioManagerProps {
  isMuted: boolean
}

export default function AudioManager({ isMuted }: AudioManagerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Create a simple background music using Web Audio API
    const createBackgroundMusic = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      const playTone = (frequency: number, duration: number, delay = 0) => {
        setTimeout(() => {
          if (isMuted) return

          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
          oscillator.type = "sine"

          gainNode.gain.setValueAtTime(0, audioContext.currentTime)
          gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1)
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)

          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + duration)
        }, delay)
      }

      // Simple melody loop
      const playMelody = () => {
        if (isMuted) return

        const notes = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25]
        const melody = [0, 2, 4, 2, 0, 2, 4, 2, 4, 5, 6, 4, 5, 6]

        melody.forEach((noteIndex, i) => {
          playTone(notes[noteIndex], 0.5, i * 600)
        })

        setTimeout(playMelody, melody.length * 600 + 2000)
      }

      if (!isMuted) {
        setTimeout(playMelody, 1000)
      }
    }

    createBackgroundMusic()
  }, [isMuted])

  return null
}
