"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Calendar, Users, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { currentUser, dummyEvents, formatPrice } from "@/lib/dummy-data";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useOrganizerEvents } from "@/api/events/events.queries";
import { useEffect } from "react";
import { Event } from "@/types/events.type";

export default function OrganizerDashboard() {
  const { isLoading, user: currentUser } = useAuth();

  const router = useRouter();
  const { data: organizerEventList } = useOrganizerEvents();

  useEffect(() => {
    if (!currentUser && !isLoading) {
      router.push(
        `/login?returnUrl=${encodeURIComponent(window.location.href)}`
      );
      return;
    }
    if (
      currentUser &&
      !["ORGANIZER"].includes(currentUser.role)
    ) {
      router.push("/explore");
      return;
    }
  }, [currentUser, router]);

  console.log(organizerEventList);

  const organizerEvents = organizerEventList?.filter(
    (event: Event) => currentUser && event.organizerId === currentUser.id
  );

  // Calculate stats
  const totalEvents = organizerEvents?.length;
  interface OrganizerStats {
    totalTicketsSold: number;
  }

  const totalTicketsSold: OrganizerStats["totalTicketsSold"] =
    organizerEvents?.reduce(
      (sum: number, event: Event) => sum + event.minted,
      0
    );
  interface RevenueAccumulator {
    sum: number;
  }

  interface OrganizerEvent extends Event {
    minted: number;
    price: number;
  }

  const totalRevenue: RevenueAccumulator["sum"] = organizerEvents?.reduce(
    (sum: number, event: OrganizerEvent) => sum + event.minted * event.price,
    0
  );
  const avgTicketsSold =
    totalEvents > 0 ? Math.round(totalTicketsSold / totalEvents) : 0;

  // Filter events created by current user (in real app, this would be fetched from API)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {currentUser && currentUser.name}!
              </p>
            </div>
            <Button
              asChild
              className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/organizer/create-event">
                <Plus className="h-4 w-4 mr-2" />
                Create New Event
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Events
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {organizerEvents?.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Active events</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tickets Sold
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTicketsSold}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all events
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Net Earnings
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPrice(Math.round(totalRevenue))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Events List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Events</CardTitle>
              </CardHeader>
              <CardContent>
                {organizerEvents?.length > 0 ? (
                  <div className="space-y-4">
                    {organizerEvents?.map((event: Event, index: number) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <img
                          src={event.bannerUrl || "/placeholder.svg"}
                          alt={event.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{event.name}</h3>
                            {/* {event.isVerified && <Badge variant="default">Verified</Badge>} */}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(event.date).toLocaleDateString()} •{" "}
                            {event.location}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-muted-foreground">
                              {event.minted}/{event.maxTickets} sold
                            </span>
                            <span className="text-green-600 font-medium">
                              ₦{(event.minted * event.price).toLocaleString()}{" "}
                              revenue
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="w-full bg-muted rounded-full h-2 mb-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  (event.minted / event.maxTickets) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {Math.round(
                              (event.minted / event.maxTickets) * 100
                            )}
                            % sold
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No events yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first event to start selling tickets and
                      managing attendees.
                    </p>
                    <Button asChild>
                      <Link href="/organizer/create-event">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Event
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

