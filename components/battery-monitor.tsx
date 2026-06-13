"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { sendBatteryData } from "@/lib/thingspeak"
import { useBattery } from "@/hooks/use-battery"

export function BatteryMonitor() {
  const battery = useBattery()
  const [lastSent, setLastSent] = useState<Date | null>(null)
  const [autoSend, setAutoSend] = useState(false)
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  // Auto-send data every 30 sec if enabled
  useEffect(() => {
    if (!autoSend) return

    const interval = setInterval(
      async () => {
        if (battery) {
          await handleSendData()
        }
      },
      30 * 1000,
    ) // 30 sec

    return () => clearInterval(interval)
  }, [autoSend, battery])

  const handleSendData = async () => {
    if (!battery) return

    try {
      setSendStatus("sending")
      await sendBatteryData({
        level: Math.round(battery.level * 100),
        charging: battery.charging,
      })
      setLastSent(new Date())
      setSendStatus("success")

      // Reset status after 3 seconds
      setTimeout(() => setSendStatus("idle"), 3000)
    } catch (error) {
      console.error("Failed to send data:", error)
      setSendStatus("error")

      // Reset status after 3 seconds
      setTimeout(() => setSendStatus("idle"), 3000)
    }
  }

  const getBatteryIcon = () => {
    if (!battery) return <Battery className="h-12 w-12 text-gray-400" />

    if (battery.charging) {
      return <BatteryCharging className="h-12 w-12 text-green-500" />
    }

    const level = battery.level * 100
    if (level >= 90) return <BatteryFull className="h-12 w-12 text-green-500" />
    if (level >= 50) return <BatteryMedium className="h-12 w-12 text-green-500" />
    if (level >= 20) return <BatteryLow className="h-12 w-12 text-yellow-500" />
    return <BatteryWarning className="h-12 w-12 text-red-500" />
  }

  const getStatusText = () => {
    if (!battery) return "Battery information unavailable"

    const level = Math.round(battery.level * 100)
    const status = battery.charging ? "Charging" : "Discharging"

    if (battery.charging) {
      return `${status} - ${level}% (Estimated time until full: ${battery.chargingTime !== Number.POSITIVE_INFINITY ? formatTime(battery.chargingTime) : "Unknown"})`
    } else {
      return `${status} - ${level}% (Estimated time remaining: ${battery.dischargingTime !== Number.POSITIVE_INFINITY ? formatTime(battery.dischargingTime) : "Unknown"})`
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds === Number.POSITIVE_INFINITY) return "Unknown"

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    return `${hours}h ${minutes}m`
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">Battery Monitor</CardTitle>
        <CardDescription>Real-time battery information for your device</CardDescription>
      </CardHeader>
      <CardContent>
        {!battery ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Battery className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Battery API Not Available</h3>
            <p className="text-gray-500">
              Your browser doesn't support the Battery Status API or permission was denied.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center mb-6">
              <div className="flex flex-col items-center">
                {getBatteryIcon()}
                <span className="text-2xl font-bold mt-2">{Math.round(battery.level * 100)}%</span>
                <span className={`text-sm font-medium ${battery.charging ? "text-green-500" : "text-gray-500"}`}>
                  {battery.charging ? "Charging" : "Discharging"}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">0%</span>
                <span className="text-sm font-medium">100%</span>
              </div>
              <Progress
                value={battery.level * 100}
                className={`h-4 ${
                  battery.level * 100 > 20
                    ? battery.charging
                      ? "bg-green-500"
                      : "bg-green-600"
                    : "bg-red-500"
                }`}
              />
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm">{getStatusText()}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleSendData} disabled={sendStatus === "sending"} className="flex-1">
                  {sendStatus === "sending"
                    ? "Sending..."
                    : sendStatus === "success"
                      ? "Data Sent!"
                      : sendStatus === "error"
                        ? "Error Sending"
                        : "Send to ThingSpeak"}
                </Button>
                <Button
                  variant={autoSend ? "destructive" : "outline"}
                  onClick={() => setAutoSend(!autoSend)}
                  className="flex-1"
                >
                  {autoSend ? "Disable Auto-Send" : "Enable Auto-Send"}
                </Button>
              </div>

              {lastSent && (
                <p className="text-xs text-gray-500 text-center">Last sent: {lastSent.toLocaleTimeString()}</p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
