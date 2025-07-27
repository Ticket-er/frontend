"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ResaleModal } from "@/components/resale-modal";
import { useMyTickets, useListResale } from "@/api/tickets/tickets.queries";
import { Ticket } from "@/types/tickets.type";
import { formatDate, formatPrice } from "@/lib/dummy-data";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export interface ListResalePayload {
  ticketId: string;
  resalePrice: number;
  bankCode: string;
  accountNumber: string;
}

export default function MyTicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isResaleModalOpen, setIsResaleModalOpen] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const { data: userTickets } = useMyTickets();
  const { mutateAsync: listResale, isPending: isResalePending } =
    useListResale();
  const { isLoading, user: currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser && !isLoading) {
      router.push(
        `/login?returnUrl=${encodeURIComponent(window.location.href)}`
      );
      return;
    }
    if (
      currentUser &&
      !["ORGANIZER", "ADMIN", "SUPERADMIN"].includes(currentUser.role)
    ) {
      router.push("/explore");
      return;
    }
  }, [currentUser, router]);
  // Group tickets by event ID
  const groupedTickets = userTickets?.reduce(
    (acc, ticket) => {
      const eventId = ticket.event.id;
      if (!acc[eventId]) {
        acc[eventId] = {
          event: ticket.event,
          tickets: [],
          ticketCount: 0,
          statusSummary: { active: 0, listed: 0, used: 0 },
        };
      }
      acc[eventId].tickets.push(ticket);
      acc[eventId].ticketCount += 1;
      if (ticket.isUsed) acc[eventId].statusSummary.used += 1;
      else if (ticket.isListed) acc[eventId].statusSummary.listed += 1;
      else acc[eventId].statusSummary.active += 1;
      return acc;
    },
    {} as Record<
      string,
      {
        event: Ticket["event"];
        tickets: Ticket[];
        ticketCount: number;
        statusSummary: { active: number; listed: number; used: number };
      }
    >
  );

  const handleListForResale = (ticket: Ticket, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTicket(ticket);
    setIsResaleModalOpen(true);
  };

  const handleConfirmResale = async (payload: {
    resalePrice: string;
    bankCode: string;
    accountNumber: string;
  }) => {
    if (!selectedTicket) {
      toast.error("No ticket selected");
      return;
    }

    const resalePayload: ListResalePayload = {
      ticketId: selectedTicket.id,
      resalePrice: Number.parseFloat(payload.resalePrice),
      bankCode: payload.bankCode,
      accountNumber: payload.accountNumber,
    };

    await listResale(resalePayload, {
      onSuccess: () => {
        setIsResaleModalOpen(false);
        setSelectedTicket(null);
      },
    });
  };

  const getStatusColor = (ticket: { isUsed: boolean; isListed: boolean }) => {
    if (ticket.isUsed) return "secondary";
    if (ticket.isListed) return "destructive";
    return "success";
  };

  const getStatusText = (ticket: { isUsed: boolean; isListed: boolean }) => {
    if (ticket.isUsed) return "Used";
    if (ticket.isListed) return "Listed for Resale";
    return "Active";
  };

  const toggleEventExpansion = (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 bg-gray-50 bg-opacity-90 flex items-center justify-center z-50"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Authentication...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your session
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Animated BG Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Tickets</h1>
              <p className="text-gray-600 mt-1">Manage your event tickets</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">
                {userTickets?.length || 0}
              </p>
            </div>
          </div>

          {groupedTickets && Object.keys(groupedTickets).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(groupedTickets).map(
                (
                  [eventId, { event, tickets, ticketCount, statusSummary }],
                  index
                ) => (
                  <motion.div
                    key={eventId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl border border-gray-100/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/events/${eventId}`}>
                              <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-purple-600 transition-colors">
                                {event.name}
                              </CardTitle>
                            </Link>
                            <div className="flex space-x-2 mt-2">
                              <Badge variant="success">
                                {statusSummary.active} Active
                              </Badge>
                              {statusSummary.listed > 0 && (
                                <Badge variant="destructive">
                                  {statusSummary.listed} Listed
                                </Badge>
                              )}
                              {statusSummary.used > 0 && (
                                <Badge variant="secondary">
                                  {statusSummary.used} Used
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-2">
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="line-clamp-1">
                              {event.location}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">
                              Tickets: {ticketCount}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              Original Price:
                            </span>
                            <span className="font-semibold">
                              {formatPrice(event.price)}
                            </span>
                          </div>
                        </div>

                        <Button
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={(e) => toggleEventExpansion(eventId, e)}
                        >
                          {expandedEvent === eventId ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-2" /> Hide
                              Tickets
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-2" /> View
                              Tickets
                            </>
                          )}
                        </Button>

                        {expandedEvent === eventId && (
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-600">
                                {ticketCount} Ticket{ticketCount > 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="max-h-[200px] overflow-y-auto border border-gray-100 rounded-lg">
                              {tickets.map((ticket) => (
                                <div
                                  key={ticket.id}
                                  className="flex justify-between items-center p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                                >
                                  <div>
                                    <Link href={`/ticket/${ticket.id}`}>
                                      <p className="text-sm font-medium text-gray-900 hover:underline">
                                        Ticket #{ticket.code}
                                      </p>
                                    </Link>
                                    <Badge
                                      variant={getStatusColor(ticket)}
                                      className="mt-1"
                                    >
                                      {getStatusText(ticket)}
                                    </Badge>
                                  </div>
                                  {!ticket.isListed && !ticket.isUsed && (
                                    <Button
                                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                                      onClick={(e) =>
                                        handleListForResale(ticket, e)
                                      }
                                    >
                                      List for Resale
                                    </Button>
                                  )}
                                  {ticket.isListed && (
                                    <Button
                                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                                      disabled
                                    >
                                      Listed for ₦
                                      {ticket.resalePrice?.toLocaleString()}
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tickets yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't purchased any tickets yet. Start exploring events!
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/explore">Explore Events</Link>
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      <ResaleModal
        isOpen={isResaleModalOpen}
        onClose={() => setIsResaleModalOpen(false)}
        selectedTicket={selectedTicket}
        onConfirmResale={handleConfirmResale}
        isPending={isResalePending}
      />
    </div>
  );
}

