"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-[#1E88E5]">
              Your gateway to unforgettable experiences. Discover and book
              amazing events worldwide.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-[#1E88E5] hover:text-primary"
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#1E88E5]">Quick Links</h3>
            <div className="space-y-2">
              {[
                { href: "/explore", label: "Explore Events" },
                { href: "/organizer", label: "Create Event" },
                { href: "/my-tickets", label: "My Tickets" },
                { href: "/wallet", label: "Wallet" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-muted-[#1E88E5] hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#1E88E5]">Support</h3>
            <div className="space-y-2">
              {[
                { href: "/help", label: "Help Center" },
                { href: "/contact", label: "Contact Us" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-muted-[#1E88E5] hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#1E88E5]">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-muted-[#1E88E5]">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@ticketer.africa</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-[#1E88E5]">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-[#1E88E5]">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">New York, NY</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-[#1E88E5] text-sm">
            © {new Date().getFullYear()} Ticketer. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-muted-[#1E88E5]">Stay updated:</span>
            <div className="flex space-x-2">
              <Input placeholder="Enter email" className="w-40" />
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-[#1E88E5]"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

