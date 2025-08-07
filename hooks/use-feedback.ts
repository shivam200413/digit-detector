"use client"

import { useState } from "react";

interface FeedbackData {
  drawingData: number[][]
  predictedValue: number
  isCorrect: boolean
}

export function useFeedback() {
  const URL = "https://digit-detector.onrender.com/"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitFeedback = async (feedbackData: FeedbackData): Promise<boolean> => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`${URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: feedbackData.drawingData.flat(),
          predicted_value: feedbackData.predictedValue,
          is_correct: feedbackData.isCorrect,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Feedback submission failed: ${response.statusText}`)
      }

      console.log("Feedback submitted successfully")
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit feedback"
      setError(errorMessage)
      console.error("Feedback error:", err)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    error,
    submitFeedback,
  }
}
