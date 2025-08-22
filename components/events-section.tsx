"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAllEvents } from "@/services/events/events.queries";
import { Event } from "@/types/events.type";
import { formatDate, formatPrice } from "@/lib/dummy-data";

export function EventsSection() {
  const router = useRouter();
  const { data: events } = useAllEvents();
  console.log(events);
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing events happening near you and around the world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events?.map((event: Event, index: number) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <Image
                    src={event.bannerUrl || "/placeholder.svg"}
                    alt={event.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-blue-600">
                    {formatPrice(event.price)}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {event.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.minted} attending</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push("/events")}
                    className="w-full bg-[#1E88E5] hover:bg-blue-500 text-white rounded-full font-semibold transition-all duration-300"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/explore")}
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 bg-transparent"
          >
            View All Events
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
