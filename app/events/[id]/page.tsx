"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Shield,
  ArrowLeft,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEventById } from "@/api/events/events.queries";
import { useMyTickets, useResaleListings } from "@/api/tickets/tickets.queries";
import { useAuth } from "@/lib/auth-context";
import { TicketPurchaseModal } from "@/components/ticket-purchase-modal";
import { formatDate, formatPrice } from "@/lib/dummy-data";
import { TicketResale } from "@/types/tickets.type";

export default function EventPage({ params }: { params: { id: string } }) {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedResaleTicket, setSelectedResaleTicket] =
    useState<TicketResale | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { user } = useAuth();
  const { data: event, isLoading, error } = useEventById(params.id);
  const { data: myTickets = [] } = useMyTickets();
  const { data: resaleTickets = [] } = useResaleListings(params.id);

  const eventTickets = myTickets.filter(
    (ticket) => ticket.eventId === params.id
  );

  const handleBuyTicket = (ticket: TicketResale) => {
    if (!user) {
      window.location.href = `/login?returnUrl=${encodeURIComponent(
        window.location.href
      )}`;
      return;
    }
    setSelectedResaleTicket(ticket);
    setIsPurchaseModalOpen(true);
  };

  const totalPrice = event ? Math.round(event.price * quantity * 1.05) : 0;
  const ticketsAvailable = event ? event.maxTickets - event.minted : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-t-transparent border-blue-600 rounded-full animate-spin" />
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event || error) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎭</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Event not found
          </h1>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist.
          </p>
          <Link href="/events">
            <Button className="bg-[#1E88E5] hover:bg-blue-500 text-white rounded-full">
              Browse Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <div className="py-4">
        <Button variant="ghost" asChild>
          <Link href="/explore">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>
      </div>

      {/* Event Header */}
      <section className="relative">
        <div className="h-64 md:h-96 overflow-hidden">
          <img
            src={event.bannerUrl || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="flex items-center space-x-2 mb-2">
              {event.isVerified && (
                <Badge variant="success" className="bg-green-500">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge variant="secondary">{event.category}</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>About This Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Organizer Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <img
                        src={event.organizer.profileImage || "/placeholder.svg"}
                        alt={event.organizer.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">
                            {event.organizer.name}
                          </h3>
                          {event.isVerified && (
                            <Shield className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Event Organizer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Resale Tickets */}
              {resaleTickets.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Tickets for Resale</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {resaleTickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={
                                  ticket.user.profileImage || "/placeholder.svg"
                                }
                                alt={ticket.user.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="font-medium">
                                  {ticket.user.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Original: {formatPrice(ticket.event.price)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">
                                {ticket.resalePrice &&
                                  formatPrice(ticket?.resalePrice)}
                              </p>
                              <Button
                                size="sm"
                                onClick={() => handleBuyTicket(ticket)}
                              >
                                Buy
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ticket Purchase */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Get Tickets</span>
                      <span className="text-2xl font-bold">
                        {formatPrice(event.price)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Available:</span>
                      <span className="font-medium">
                        {ticketsAvailable} tickets
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sold:</span>
                      <span className="font-medium">
                        {event.minted}/{event.maxTickets}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-pink-600 h-2 rounded-full"
                        style={{
                          width: `${(event.minted / event.maxTickets) * 100}%`,
                        }}
                      />
                    </div>
                    <Button
                      className="w-full bg-[#1E88E5] hover:bg-blue-500 text-white rounded-full"
                      size="lg"
                      disabled={ticketsAvailable === 0}
                      onClick={() => {
                        if (!user) {
                          window.location.href = `/login?returnUrl=${encodeURIComponent(
                            window.location.href
                          )}`;
                          return;
                        }
                        setSelectedResaleTicket(null);
                        setIsPurchaseModalOpen(true);
                      }}
                    >
                      {ticketsAvailable > 0 ? "Buy Tickets" : "Sold Out"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Event Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Event Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-600" />
                        <span className="text-sm">Attendees</span>
                      </div>
                      <span className="font-medium">{event.minted}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Modal */}
      <TicketPurchaseModal
        event={event}
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setSelectedResaleTicket(null);
        }}
      />
    </div>
  );
}

