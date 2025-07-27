"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, AlertCircle, Calendar, MapPin, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { parseTicketData, type QRTicketData } from "@/lib/qr-utils"
import { Header } from "@/components/layout/header"
import { useVerifyTicket } from "@/api/tickets/tickets.queries"
import { useAuth } from "@/lib/auth-context"
import { formatDate, formatPrice } from "@/lib/dummy-data"
import { toast } from "sonner"
import { Ticket } from "@/types/tickets.type"

interface TicketVerification {
  isValid: boolean
  ticket?: Ticket
  scannedAt?: string
}

export default function VerifyTicketPage() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { mutateAsync: verifyTicket, isPending: isVerifying } = useVerifyTicket()
  const [verification, setVerification] = useState<TicketVerification | null>(null)
  const [ticketData, setTicketData] = useState<QRTicketData | null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const verify = async () => {
      try {
        setError("")
        const dataParam = searchParams.get("data")
        if (!dataParam) {
          setError("Invalid verification link")
          return
        }

        const parsedData = parseTicketData(dataParam)
        if (!parsedData || !parsedData.eventId) {
          setError("Invalid ticket data")
          return
        }

        setTicketData(parsedData)

        const response = await verifyTicket({
          ticketId: parsedData.ticketId,
          code: parsedData.code,
          eventId: parsedData.eventId,
        })

        setVerification({
          isValid: response.isValid,
          ticket: response.ticket,
          scannedAt: new Date().toISOString(),
        })
      } catch (err: any) {
        setError(err?.message || "Verification failed. Please try again.")
      }
    }

    verify()
  }, [searchParams, verifyTicket])

  const ticket = verification?.ticket
  const event = ticket?.event

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Ticket...</h2>
          <p className="text-gray-600">Please wait while we validate your ticket</p>
        </motion.div>
      </div>
    )
  }

  if (error || !ticketData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <Card className="bg-white border-red-200 shadow-lg rounded-xl">
            <CardHeader className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-red-600">Verification Failed</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">{error || "Invalid ticket data"}</p>
              <Button
                variant="outline"
                className="bg-transparent border-gray-300 hover:bg-gray-100 text-gray-900"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Header />
      <div className="container mx-auto max-w-2xl py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className={`bg-white shadow-lg rounded-xl ${verification?.isValid ? "border-green-200" : "border-red-200"}`}>
            <CardHeader className="text-center">
              {verification?.isValid ? (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <CardTitle className="text-green-600">Ticket Valid ✓</CardTitle>
                  <p className="text-gray-600">This ticket has been successfully verified</p>
                </>
              ) : (
                <>
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <CardTitle className="text-red-600">Invalid Ticket ✗</CardTitle>
                  <p className="text-gray-600">This ticket could not be verified</p>
                </>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Verification Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
                  Verification Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Ticket Code:</span>
                    <p className="font-mono text-gray-900">{ticketData.code || ticket?.code || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Event ID:</span>
                    <p className="font-mono text-gray-900">{ticketData.eventId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Scanned At:</span>
                    <p className="text-gray-900">
                      {verification?.scannedAt ? new Date(verification.scannedAt).toLocaleString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={verification?.isValid ? "default" : "destructive"}>
                      {verification?.isValid ? "Valid" : "Invalid"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              {event && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Event Information</h3>
                  <div className="flex items-start space-x-4">
                    <img
                      src={event.bannerUrl || "/placeholder.svg"}
                      alt={event.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-lg text-gray-900">{event.name}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ticket Details */}
              {ticket && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Ticket Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Original Price:</span>
                      <p className="font-semibold text-gray-900">₦{formatPrice(event?.price || 0)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ticket Status:</span>
                      <Badge variant={ticket.isUsed ? "secondary" : ticket.isListed ? "destructive" : "default"}>
                        {ticket.isUsed ? "Used" : ticket.isListed ? "Listed for Resale" : "Active"}
                      </Badge>
                    </div>
                    {ticket.isListed && ticket.resalePrice && (
                      <div>
                        <span className="text-gray-600">Listed for:</span>
                        <p className="font-semibold text-orange-600">₦{formatPrice(ticket.resalePrice)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4 border-t">
                {verification?.isValid && user?.role === "ORGANIZER" ? (
                  <>
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => window.print()}
                    >
                      Print Verification
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent border-gray-300 hover:bg-gray-100 text-gray-900"
                      onClick={() => window.close()}
                    >
                      Close
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-gray-300 hover:bg-gray-100 text-gray-900"
                    onClick={() => window.close()}
                  >
                    Close
                  </Button>
                )}
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Security Notice</p>
                    <p>
                      This verification was performed at {new Date().toLocaleString()}. Each ticket can only be used once for entry.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}