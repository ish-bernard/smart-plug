import { type NextRequest, NextResponse } from "next/server"

// This route handler will receive battery data and forward it to ThingSpeak
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate the data
    if (typeof data.level !== "number" || typeof data.charging !== "boolean") {
      return NextResponse.json(
        { error: "Invalid data format. Expected { level: number, charging: boolean }" },
        { status: 400 },
      )
    }

    // Replace with your ThingSpeak API key
    const API_KEY = process.env.THINGSPEAK_API_KEY

    if (!API_KEY) {
      return NextResponse.json({ error: "ThingSpeak API key not configured" }, { status: 500 })
    }

    // Construct the ThingSpeak API URL
    const url = `https://api.thingspeak.com/update?api_key=${API_KEY}&field1=${data.level}&field2=${data.charging ? 1 : 0}`

    // Send the data to ThingSpeak
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to send data to ThingSpeak: ${response.statusText}`)
    }

    const result = await response.text()

    return NextResponse.json({ success: true, entry_id: result })
  } catch (error) {
    console.error("Error processing battery data:", error)
    return NextResponse.json({ error: "Failed to process battery data" }, { status: 500 })
  }
}

// This route handler will get the latest battery data from ThingSpeak
export async function GET() {
  try {
    // Replace with your ThingSpeak API key and channel ID
    const API_KEY = process.env.THINGSPEAK_API_KEY
    const CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID

    if (!API_KEY || !CHANNEL_ID) {
      return NextResponse.json({ error: "ThingSpeak API key or channel ID not configured" }, { status: 500 })
    }

    const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${API_KEY}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ThingSpeak: ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      level: Number.parseFloat(data.field1),
      charging: data.field2 === "1",
      timestamp: data.created_at,
    })
  } catch (error) {
    console.error("Error fetching battery data:", error)
    return NextResponse.json({ error: "Failed to fetch battery data" }, { status: 500 })
  }
}
