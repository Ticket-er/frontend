"use client"

import { TicketResale } from "@/types/tickets.type"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, MapPin, Shield } from "lucide-react"
import { formatDate, formatPrice } from "@/lib/dummy-data"

interface BuyResaleModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTicket: TicketResale | null
  onConfirmBuy: (ticketId: string) => void
  isPending: boolean
  isAuthenticated: boolean
}

export function BuyResaleModal({
  isOpen,
  onClose,
  selectedTicket,
  onConfirmBuy,
  isPending,
  isAuthenticated,
}: BuyResaleModalProps) {
  const handleSubmit = () => {
    if (!selectedTicket?.id || !isAuthenticated) return
    onConfirmBuy(selectedTicket.id)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buy Resale Ticket"
      className="max-w-lg bg-white shadow-lg rounded-xl"
    >
      {selectedTicket && (
        <div className="space-y-6">
          {/* Event Details */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{selectedTicket.event.name}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedTicket.event.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{selectedTicket.event.location}</span>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                {selectedTicket.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {selectedTicket.user.name}
              </div>
              <div className="text-xs text-gray-500">Verified seller</div>
            </div>
            <Shield className="w-4 h-4 text-green-600" />
          </div>

          {/* Price Details */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Resale Price:</span>
              <span className="font-semibold text-gray-900">{formatPrice(selectedTicket.resalePrice ?? 0)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Service Fee (5%):</span>
              <span className="text-sm text-gray-900">{formatPrice((selectedTicket.resalePrice ?? 0) * 0.05)}</span>
            </div>
            <div className="flex justify-between items-center mt-2 font-semibold">
              <span className="text-sm text-gray-900">Total:</span>
              <span className="text-gray-900">{formatPrice((selectedTicket.resalePrice ?? 0) * 1.05)}</span>
            </div>
          </div>

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> By purchasing this ticket, you agree to the terms of service. The ticket will be transferred to your account upon successful payment.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent border-gray-300 hover:bg-gray-100 text-gray-900"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleSubmit}
              disabled={!isAuthenticated || isPending || !selectedTicket}
            >
              {isPending ? "Processing..." : isAuthenticated ? "Buy Now" : "Log In to Buy"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}