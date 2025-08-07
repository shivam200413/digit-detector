export interface DrawingData {
  grid: number[][]
  timestamp: Date
}

export interface PredictionResponse {
  prediction: number
  confidence?: number
  processing_time?: number
}

export interface FeedbackRequest {
  image: number[]
  predicted_value: number
  is_correct: boolean
  timestamp: string
}

export interface ApiError {
  message: string
  status?: number
}
