"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

interface FeedbackBarProps {
  onFeedback: (isCorrect: boolean) => void
  isSubmitting: boolean
}

export function FeedbackBar({ onFeedback, isSubmitting }: FeedbackBarProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <p className="font-medium">Was the prediction correct?</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => onFeedback(true)}
              disabled={isSubmitting}
              variant="outline"
              className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
            >
              <CheckCircle className="h-4 w-4" />
              Correct
            </Button>
            <Button
              onClick={() => onFeedback(false)}
              disabled={isSubmitting}
              variant="outline"
              className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4" />
              Wrong
            </Button>
          </div>
          {isSubmitting && <p className="text-sm text-muted-foreground">Submitting feedback...</p>}
        </div>
      </CardContent>
    </Card>
  )
}
