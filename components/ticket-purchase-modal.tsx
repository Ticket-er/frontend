"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Minus, CreditCard, Lock } from "lucide-react";
import { formatDate, formatPrice, formatTime } from "@/lib/dummy-data";
import { useAuth } from "@/lib/auth-context";
import { useBuyTicket } from "@/api/tickets/tickets.queries";
import { toast } from "sonner";

interface Event {
  id: string;
  name: string;
  price: number;
  date: Date;
  location?: string;
}

interface TicketPurchaseModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketPurchaseModal({
  event,
  isOpen,
  onClose,
}: TicketPurchaseModalProps) {
  const { user } = useAuth();
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [step, setStep] = useState<"quantity" | "auth" | "payment" | "success">(
    "quantity"
  );
  const [isLoggedIn] = useState(false); // Simulate auth state
  const { mutateAsync: buyTicket, isPending: isBuying } = useBuyTicket();

  const subtotal = event.price * ticketQuantity;
  const total = subtotal;

  const handleContinue = () => {
    if (!user) {
      setStep("auth");
    } else {
      setStep("payment");
    }
  };

  const handlePurchase = async () => {
    try {
      const data = await buyTicket({
        eventId: event.id,
        quantity: ticketQuantity,
      });

      if (data?.checkoutUrl) {
        window.open(data.checkoutUrl); // opens in new tab
      } else {
        console.error("No checkout URL returned from buyTicket.");
      }
    } catch (err) {
      // Handle error (e.g., show notification)
    }
  };

  const resetModal = () => {
    setStep("quantity");
    setTicketQuantity(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {step === "quantity" && "Select Tickets"}
                {step === "auth" && "Sign In Required"}
                {step === "payment" && "Payment Details"}
                {step === "success" && "Purchase Complete!"}
              </h2>
              <button
                onClick={resetModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Step 1: Quantity Selection */}
              {step === "quantity" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Event Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(event.date)} • {formatTime(event.date)} •{" "}
                      {event.location}
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Number of tickets
                    </Label>
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setTicketQuantity(Math.max(1, ticketQuantity - 1))
                        }
                        disabled={ticketQuantity <= 1}
                        className="w-10 h-10 rounded-full border-gray-200 bg-transparent"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>

                      <div className="text-2xl font-bold text-gray-900 w-12 text-center">
                        {ticketQuantity}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setTicketQuantity(Math.min(8, ticketQuantity + 1))
                        }
                        disabled={ticketQuantity >= 8}
                        className="w-10 h-10 rounded-full border-gray-200 bg-transparent"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Maximum 8 tickets per order
                    </p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {ticketQuantity} × {formatPrice(event.price)}
                      </span>
                      <span className="text-gray-900">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleContinue}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl"
                  >
                    Continue to Checkout
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Auth Required */}
              {step === "auth" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-center"
                >
                  <div className="text-6xl mb-4">🎫</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Sign in to complete your purchase
                    </h3>
                    <p className="text-gray-600">
                      You need to be signed in to buy tickets and access your
                      digital tickets.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => (window.location.href = "/login")}
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => (window.location.href = "/register")}
                      variant="outline"
                      className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-xl bg-transparent"
                    >
                      Create Account
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500">
                    Your ticket selection will be saved
                  </p>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === "payment" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">
                        {event.name}
                      </span>
                      <Badge variant="secondary">
                        {ticketQuantity} tickets
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {formatDate(event.date)} • {event.location}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      Total: {formatPrice(total)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span>
                      Your payment information is secure and encrypted
                    </span>
                  </div>

                  <Button
                    onClick={handlePurchase}
                    disabled={isBuying}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl"
                  >
                    {isBuying ? "Processing..." : "Complete Purchase"}
                  </Button>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Tickets purchased successfully!
                    </h3>
                    <p className="text-gray-600">
                      Your tickets have been sent to your email and are
                      available in your account.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="text-sm font-medium text-green-800 mb-1">
                      Order Confirmation
                    </div>
                    <div className="text-xs text-green-600">
                      #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => (window.location.href = "/my-tickets")}
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl"
                    >
                      View My Tickets
                    </Button>
                    <Button
                      onClick={resetModal}
                      variant="outline"
                      className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-xl bg-transparent"
                    >
                      Continue Browsing
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

