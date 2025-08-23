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
import { useBuyTicket } from "@/services/tickets/tickets.queries";
import { toast } from "sonner";
import { TicketCategory } from "@/app/events/[id]/page";
import { TicketResale } from "@/types/tickets.type";

interface Event {
  id: string;
  name: string;
  price: number;
  date: Date;
  location?: string;
}
interface TicketPurchaseModalProps {
  event: Event;
  ticketCategory?: TicketCategory | null;
  resaleTicket?: TicketResale | null;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketPurchaseModal({
  event,
  ticketCategory,
  resaleTicket,
  quantity,
  setQuantity,
  isOpen,
  onClose,
}: TicketPurchaseModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<"quantity" | "auth" | "payment" | "success">("quantity");
  const { mutateAsync: buyTicket, isPending: isBuying } = useBuyTicket();

  // Determine price dynamically
  const price = resaleTicket?.resalePrice ?? ticketCategory?.price ?? event.price ?? 0;
  const subtotal = price * quantity;
  const total = subtotal; // Add tax/fees if needed

  const handleContinue = () => {
    if (!user) setStep("auth");
    else setStep("payment");
  };

  const handlePurchase = async () => {
    try {
      const data = await buyTicket({
        eventId: event.id,
        quantity,
        ticketCategoryId: ticketCategory?.id, // Pass category ID if applicable
        resaleTicketId: resaleTicket?.id,     // Pass resale ticket ID if applicable
      });
      if (data?.checkoutUrl) window.open(data.checkoutUrl);
      setStep("success");
    } catch (err) {
      toast.error("Error processing purchase");
    }
  };

  const resetModal = () => {
    setStep("quantity");
    setQuantity(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetModal}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
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
              <button onClick={resetModal} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {step === "quantity" && (
                <div className="space-y-6">
                  {/* Event Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{event.name}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(event.date)} • {event.location}
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                    <div className="text-2xl font-bold">{quantity}</div>
                    <Button onClick={() => setQuantity(Math.min(8, quantity + 1))}>+</Button>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{quantity} × {formatPrice(price)}</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button onClick={handleContinue} className="w-full">
                    Continue to Checkout
                  </Button>
                </div>
              )}

              {step === "auth" && (
                <div className="text-center space-y-6">
                  <p>Please sign in to complete your purchase.</p>
                  <Button onClick={() => (window.location.href = "/login")}>Sign In</Button>
                </div>
              )}

              {step === "payment" && (
                <div className="space-y-6">
                  <div>Total: {formatPrice(total)}</div>
                  <Button onClick={handlePurchase} disabled={isBuying}>
                    {isBuying ? "Processing..." : "Complete Purchase"}
                  </Button>
                </div>
              )}

              {step === "success" && (
                <div className="text-center space-y-6">
                  <p>🎉 Tickets purchased successfully!</p>
                  <Button onClick={resetModal}>Continue</Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
