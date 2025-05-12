"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BudgetSelectorProps {
  onChange: (budget: { total: number; perPerson: number }) => void
}

export function BudgetSelector({ onChange }: BudgetSelectorProps) {
  const [totalBudget, setTotalBudget] = useState(1000)
  const [perPersonBudget, setPerPersonBudget] = useState(250)
  const [participants, setParticipants] = useState(4)
  const isInitialMount = useRef(true)

  // Only trigger onChange after initial mount to prevent infinite loops
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    // Use a timeout to debounce rapid changes
    const timeoutId = setTimeout(() => {
      onChange({ total: totalBudget, perPerson: perPersonBudget })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [totalBudget, perPersonBudget, onChange])

  const handleTotalBudgetChange = (value: number[]) => {
    const newTotal = value[0]
    setTotalBudget(newTotal)
    setPerPersonBudget(Math.round(newTotal / participants))
  }

  const handlePerPersonBudgetChange = (value: number[]) => {
    const newPerPerson = value[0]
    setPerPersonBudget(newPerPerson)
    setTotalBudget(newPerPerson * participants)
  }

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setParticipants(value)
      setTotalBudget(perPersonBudget * value)
    }
  }

  const handleTotalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 0) {
      setTotalBudget(value)
      setPerPersonBudget(Math.round(value / participants))
    }
  }

  const handlePerPersonInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 0) {
      setPerPersonBudget(value)
      setTotalBudget(value * participants)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Estimated Participants</Label>
          <span className="text-sm text-muted-foreground">{participants} people</span>
        </div>
        <Input type="number" min="1" value={participants} onChange={handleParticipantsChange} className="w-full" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Total Budget</Label>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">$</span>
            <Input type="number" min="0" value={totalBudget} onChange={handleTotalInputChange} className="w-24" />
          </div>
        </div>
        <Slider value={[totalBudget]} min={0} max={10000} step={100} onValueChange={handleTotalBudgetChange} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>$5,000</span>
          <span>$10,000</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Budget Per Person</Label>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">$</span>
            <Input
              type="number"
              min="0"
              value={perPersonBudget}
              onChange={handlePerPersonInputChange}
              className="w-24"
            />
          </div>
        </div>
        <Slider value={[perPersonBudget]} min={0} max={2500} step={50} onValueChange={handlePerPersonBudgetChange} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>$1,250</span>
          <span>$2,500</span>
        </div>
      </div>

      <div className="rounded-md bg-muted p-4">
        <h4 className="font-medium mb-2">Budget Summary</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Total Budget:</span>
            <span>${totalBudget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Per Person:</span>
            <span>${perPersonBudget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Participants:</span>
            <span>{participants}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
