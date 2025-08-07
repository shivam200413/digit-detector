"use client"

import { useState } from "react"

export function usePrediction() {
  const URL = "https://digit-detector.onrender.com/"
  const [prediction, setPrediction] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predict = async (drawingData: number[][]): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: drawingData.flat(), // Flatten 28x28 to 784 array
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Prediction failed: ${response.statusText}`)
      }

      const data = await response.json()
      setPrediction(data.prediction)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get prediction"
      setError(errorMessage)
      console.error("Prediction error:", err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setPrediction(null)
    setError(null)
  }

  return {
    prediction,
    isLoading,
    error,
    predict,
    reset,
  }
}
