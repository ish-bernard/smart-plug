interface BatteryData {
  level: number
  charging: boolean
}

// Replace with your ThingSpeak API key and channel ID
const API_KEY = "VUV9WKCBGB9PABLB" // You'll need to replace this with your actual API key
const CHANNEL_ID = "2969501" // You'll need to replace this with your actual channel ID

export async function sendBatteryData(data: BatteryData): Promise<void> {
  try {
    // Construct the ThingSpeak API URL
    const url = `https://api.thingspeak.com/update?api_key=${API_KEY}&field1=${data.level}&field2=${data.charging ? 1 : 0}`

    // Send the data
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to send data: ${response.statusText}`)
    }

    console.log("Battery data sent successfully to ThingSpeak")
  } catch (error) {
    console.error("Error sending data to ThingSpeak:", error)
    throw error
  }
}

// Function to fetch the last battery data from ThingSpeak
export async function getLastBatteryData(): Promise<BatteryData | null> {
  try {
    const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${API_KEY}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      level: Number.parseFloat(data.field1),
      charging: data.field2 === "1",
    }
  } catch (error) {
    console.error("Error fetching data from ThingSpeak:", error)
    return null
  }
}
