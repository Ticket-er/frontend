"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Search,
  SlidersHorizontal,
  Loader2,
  Ticket,
} from "lucide-react";
import { formatPrice, formatDate, formatTime } from "@/lib/dummy-data";
import { useAllEvents } from "@/services/events/events.queries";
import { Event, TicketCategory } from "@/types/events.type";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: events, isLoading: eventsLoading } = useAllEvents();

  if (eventsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-16">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#1E88E5] mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  const locations: any[] = [
    ...new Set(
      events
        ?.map((event: Event) => event?.location?.split(",")[1]?.trim())
        .filter(Boolean)
    ),
  ];

  const priceRanges = [
    { label: "Under N5000", value: "0-5000" },
    { label: "N5000 - N10000", value: "5000-10000" },
    { label: "N10000 - N20000", value: "10000-20000" },
    { label: "Over N20000", value: "20000" },
  ];

  const categories = [
    "Music",
    "Concert",
    "Conference",
    "Workshop",
    "Sports",
    "Comedy",
    "Theatre",
    "Festival",
    "Exhibition",
    "Religion",
    "Networking",
    "Tech",
    "Fashion",
    "Party",
  ];

  const filteredEvents = events?.filter((event: Event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      !selectedLocation || event.location.includes(selectedLocation);
    const matchesCategory =
      !selectedCategory ||
      event.category.toLowerCase() === selectedCategory.toLowerCase();

    let matchesPrice = true;
    if (priceRange && event.ticketCategories?.length) {
      const minPrice = Math.min(
        ...event.ticketCategories.map((t: TicketCategory) => t.price)
      );
      const maxPrice = Math.max(
        ...event.ticketCategories.map((t: TicketCategory) => t.price)
      );

      switch (priceRange) {
        case "0-5000":
          matchesPrice = maxPrice < 5000;
          break;
        case "5000-10000":
          matchesPrice = minPrice >= 5000 && maxPrice <= 10000;
          break;
        case "10000-20000":
          matchesPrice = minPrice >= 10000 && maxPrice <= 20000;
          break;
        case "20000":
          matchesPrice = minPrice > 20000;
          break;
      }
    }

    return matchesSearch && matchesLocation && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find and book tickets for the best events happening near you
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 border-gray-200 hover:bg-gray-50 rounded-xl bg-transparent"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {(selectedLocation || priceRange || selectedCategory) && (
                  <Badge variant="secondary" className="ml-2">
                    {
                      [selectedLocation, priceRange, selectedCategory].filter(
                        Boolean
                      ).length
                    }
                  </Badge>
                )}
              </Button>
              <p className="text-sm text-gray-600">
                {filteredEvents?.length} events found
              </p>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All prices</option>
                    {priceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents?.map((event: Event, idx: number) => {
            const ticketCategories = event.ticketCategories || [];
            const maxTickets = ticketCategories.reduce(
              (sum, t) => sum + t.maxTickets,
              0
            );
            const mintedTickets = ticketCategories.reduce(
              (sum, t) => sum + t.minted,
              0
            );
            const ticketsAvailable = maxTickets - mintedTickets;

            const minPrice = ticketCategories.length
              ? Math.min(...ticketCategories.map((t) => t.price))
              : 0;
            const maxPrice = ticketCategories.length
              ? Math.max(...ticketCategories.map((t) => t.price))
              : 0;
            const priceRangeDisplay = ticketCategories.length
              ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
              : "Free";

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group"
              >
                <Link href={`/events/${event.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative">
                      <Image
                        src={event.bannerUrl || "/placeholder.svg"}
                        alt={event.name}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Category badge */}
                      <div className="absolute top-4 left-4 capitalize bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-blue-600">
                        {event.category}
                      </div>
                      {/* Almost sold out badge */}
                      {ticketsAvailable > 0 &&
                        mintedTickets / maxTickets > 0.8 && (
                          <div className="absolute top-12 left-4">
                            <Badge variant="destructive" className="bg-red-500">
                              Almost Sold Out
                            </Badge>
                          </div>
                        )}
                    </div>

                    {/* Price badge moved below image */}
                    <div className="flex justify-end px-4 -mt-8 mb-2">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-blue-600 shadow-sm">
                        {priceRangeDisplay}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Event title */}
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {event.name}
                      </h3>

                      {/* Date & Location */}
                      <div className="space-y-1 text-gray-600 text-sm">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>
                            {formatDate(event.date)} at {formatTime(event.date)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      {/* Tickets */}
                      <div className="text-gray-600">
                        <div className="flex items-center mb-1">
                          <Ticket className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium">
                            Ticket Options
                          </span>
                        </div>
                        <div className="">
                          {ticketCategories.map((ticket) => (
                            <div
                              key={ticket.id}
                              className="flex justify-between items-center text-sm space-y-2"
                            >
                              <span>
                                {ticket.name} ({formatPrice(ticket.price)})
                              </span>
                              <span
                                className={
                                  ticket.maxTickets - ticket.minted < 5
                                    ? "text-red-500 font-medium"
                                    : "text-gray-600"
                                }
                              >
                                {ticket.maxTickets - ticket.minted} of{" "}
                                {ticket.maxTickets} available
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* View details button */}
                      <Button
                        size="lg"
                        className="w-full bg-[#1E88E5] hover:bg-blue-500 text-white rounded-full font-semibold"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filteredEvents?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedLocation("");
                setPriceRange("");
                setSelectedCategory("");
              }}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full bg-transparent"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
