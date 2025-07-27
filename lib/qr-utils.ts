import QRCode from "qrcode"

export interface QRTicketData {
  ticketId: string
  eventId: string
  userId: string
  code: string
  verificationCode: string
  timestamp: number
}

export const generateTicketQR = async (ticketData: QRTicketData): Promise<string> => {
  try {
    // Create the verification URL that the QR code will point to
    const verificationUrl = `${window.location.origin}/verify-ticket?data=${encodeURIComponent(
      JSON.stringify(ticketData),
    )}`

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })

    return qrCodeDataUrl
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw new Error("Failed to generate QR code")
  }
}

export const parseTicketData = (dataString: string): QRTicketData | null => {
  try {
    const data = JSON.parse(decodeURIComponent(dataString))

    // Validate required fields
    if (!data.ticketId || !data.eventId || !data.userId || !data.verificationCode) {
      return null
    }

    return data as QRTicketData
  } catch (error) {
    console.error("Error parsing ticket data:", error)
    return null
  }
}

export const generateVerificationCode = (code: string, eventId: string, userId: string): string => {
  const combined = `${code}-${eventId}-${userId}-${Date.now()}`
  return btoa(combined)
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 12)
    .toUpperCase()
}
