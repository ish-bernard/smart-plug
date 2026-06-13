"use client"

import { useEffect, useState } from "react"

interface BatteryInfo {
  level: number
  charging: boolean
  chargingTime: number
  dischargingTime: number
}

export function useBattery() {
  const [battery, setBattery] = useState<BatteryInfo | null>(null)

  useEffect(() => {
    // Check if Battery API is supported
    if (!("getBattery" in navigator)) {
      console.warn("Battery API is not supported in this browser")
      return
    }

    const updateBatteryInfo = (batteryObj: any) => {
      const updateInfo = () => {
        setBattery({
          level: batteryObj.level,
          charging: batteryObj.charging,
          chargingTime: batteryObj.chargingTime,
          dischargingTime: batteryObj.dischargingTime,
        })
      }

      // Update initially
      updateInfo()

      // Add event listeners for changes
      batteryObj.addEventListener("levelchange", updateInfo)
      batteryObj.addEventListener("chargingchange", updateInfo)
      batteryObj.addEventListener("chargingtimechange", updateInfo)
      batteryObj.addEventListener("dischargingtimechange", updateInfo)

      // Cleanup function
      return () => {
        batteryObj.removeEventListener("levelchange", updateInfo)
        batteryObj.removeEventListener("chargingchange", updateInfo)
        batteryObj.removeEventListener("chargingtimechange", updateInfo)
        batteryObj.removeEventListener("dischargingtimechange", updateInfo)
      }
    }

    // Get the battery info
    ;(navigator as any)
      .getBattery()
      .then(updateBatteryInfo)
      .catch((error: any) => {
        console.error("Error getting battery info:", error)
      })
  }, [])

  return battery
}
