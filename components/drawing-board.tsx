"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface DrawingBoardProps {
  data: number[][]
  onChange: (data: number[][]) => void
  disabled?: boolean
}

export function DrawingBoard({ data, onChange, disabled }: DrawingBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPos, setLastPos] = useState<{ row: number; col: number } | null>(null)

  const GRID_SIZE = 28
  const CELL_SIZE = 12
  const CANVAS_SIZE = GRID_SIZE * CELL_SIZE

  useEffect(() => {
    redrawCanvas()
  }, [data])

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw grid
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE)
      ctx.stroke()
    }

    // Draw filled cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const value = data[row][col]
        if (value > 0) {
          const alpha = Math.min(value, 1)
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
          ctx.fillRect(col * CELL_SIZE + 1, row * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2)
        }
      }
    }
  }

  const getGridPosition = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    const col = Math.floor(x / CELL_SIZE)
    const row = Math.floor(y / CELL_SIZE)

    if (col >= 0 && col < GRID_SIZE && row >= 0 && row < GRID_SIZE) {
      return { row, col }
    }
    return null
  }

  const drawLine = (from: { row: number; col: number }, to: { row: number; col: number }) => {
    const newData = [...data]

    // Helper function to fill a 2x2 area centered on the given position
    const fillBrushArea = (centerRow: number, centerCol: number) => {
      // Define 2x2 brush area (top-left offset)
      const brushOffsets = [
        { dr: 0, dc: 0 },
        { dr: 0, dc: 1 },
        { dr: 1, dc: 0 },
        { dr: 1, dc: 1 },
      ]

      brushOffsets.forEach(({ dr, dc }) => {
        const row = centerRow + dr
        const col = centerCol + dc
        if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
          newData[row][col] = Math.min(newData[row][col] + 0.8, 1)
        }
      })
    }

    // Bresenham's line algorithm for smooth drawing with 2x2 brush
    const dx = Math.abs(to.col - from.col)
    const dy = Math.abs(to.row - from.row)
    const sx = from.col < to.col ? 1 : -1
    const sy = from.row < to.row ? 1 : -1
    let err = dx - dy

    let currentCol = from.col
    let currentRow = from.row

    while (true) {
      // Fill 2x2 brush area at current position
      fillBrushArea(currentRow, currentCol)

      if (currentCol === to.col && currentRow === to.row) break

      const e2 = 2 * err
      if (e2 > -dy) {
        err -= dy
        currentCol += sx
      }
      if (e2 < dx) {
        err += dx
        currentRow += sy
      }
    }

    onChange(newData)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return

    const pos = getGridPosition(e.clientX, e.clientY)
    if (pos) {
      setIsDrawing(true)
      setLastPos(pos)

      const newData = [...data]

      // Fill 2x2 brush area
      const brushOffsets = [
        { dr: 0, dc: 0 },
        { dr: 0, dc: 1 },
        { dr: 1, dc: 0 },
        { dr: 1, dc: 1 },
      ]

      brushOffsets.forEach(({ dr, dc }) => {
        const row = pos.row + dr
        const col = pos.col + dc
        if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
          newData[row][col] = Math.min(newData[row][col] + 0.8, 1)
        }
      })

      onChange(newData)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || disabled || !lastPos) return

    const pos = getGridPosition(e.clientX, e.clientY)
    if (pos && (pos.row !== lastPos.row || pos.col !== lastPos.col)) {
      drawLine(lastPos, pos)
      setLastPos(pos)
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
    setLastPos(null)
  }

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className={cn("border border-border rounded-lg cursor-crosshair", disabled && "cursor-not-allowed opacity-50")}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  )
}
