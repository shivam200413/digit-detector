"use client"

import { useEffect, useState } from "react"
import { DrawingBoard } from "@/components/drawing-board"
import { PredictionDisplay } from "@/components/prediction-display"
import { FeedbackBar } from "@/components/feedback-bar"
import { Button } from "@/components/ui/button"
import { usePrediction } from "@/hooks/use-prediction"
import { useFeedback } from "@/hooks/use-feedback"

export default function Home() {
  const [drawingData, setDrawingData] = useState<number[][]>(
    Array(28)
      .fill(null)
      .map(() => Array(28).fill(0)),
  )
  const [showFeedback, setShowFeedback] = useState(false)

  const { prediction, isLoading, predict, error } = usePrediction()
  const { submitFeedback, isSubmitting } = useFeedback()

  const handlePredict = async () => {
    const success = await predict(drawingData)
    if (success) {
      setShowFeedback(true)
    }
  }

  const handleFeedback = async (isCorrect: boolean) => {
    if (prediction !== null) {
      await submitFeedback({
        drawingData,
        predictedValue: prediction,
        isCorrect,
      })
      setShowFeedback(false)
    }
  }

  const handleClear = () => {
    setDrawingData(
      Array(28)
        .fill(null)
        .map(() => Array(28).fill(0)),
    )
    setShowFeedback(false)
  }

  const hasDrawing = drawingData.some((row) => row.some((cell) => cell > 0))

  useEffect(()=>{
    async function sendData() {
    const response = await fetch('https://digits-predictor.onrender.com/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'hi' }),
    });

    const result = await response.json();
    console.log('Server Response:', result);
  }
  try{
    sendData();
  }
  catch (error){
    console.log('Error sending message:', error);
  }
  },[]);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Digit Recognition Drawing Board</h1>
          <p className="text-muted-foreground mt-2">
            Draw a digit (0-9) on the grid below and click predict to see the AI&apos;s guess
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Drawing Board</h2>
            <DrawingBoard data={drawingData} onChange={setDrawingData} disabled={isLoading} />
            <div className="flex gap-2">
              <Button onClick={handlePredict} disabled={!hasDrawing || isLoading} className="flex-1">
                {isLoading ? "Predicting..." : "Predict"}
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                Clear
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Prediction</h2>
            <PredictionDisplay prediction={prediction} isLoading={isLoading} />

            {showFeedback && prediction !== null && (
              <FeedbackBar onFeedback={handleFeedback} isSubmitting={isSubmitting} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
