import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface PredictionDisplayProps {
  prediction: number | null
  isLoading: boolean
}

export function PredictionDisplay({ prediction, isLoading }: PredictionDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Predicted Digit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-32">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : prediction !== null ? (
            <div className="text-6xl font-bold text-primary">{prediction}</div>
          ) : (
            <div className="text-muted-foreground text-center">
              <div className="text-4xl mb-2">?</div>
              <p>Draw a digit and click predict</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
