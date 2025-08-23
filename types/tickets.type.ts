import { Ticket } from "lucide-react";
import { Event } from "./events.type";
import { User } from "./user.type";
import { TicketCategory } from "@/app/events/[id]/page";

export interface Ticket {
  id: string;
  code: string;
  eventId: string;
  userId: string;
  seatNumber?: string;
  status: "ACTIVE" | "RESOLD" | "USED";
  resale?: boolean;
  resalePrice?: number;
  createdAt: string;
  updatedAt: string;
  event: Event;
  isListed: boolean;
  isUsed: boolean;
  listedAt: Date;
  resaleCommission: 225;
  resaleCount: 1;
  soldTo: string;
  user: User;
}

export interface TicketResponse {
  success: boolean;
  message: string;
  checkoutUrl: string;
}

export interface BuyTicketPayload {
  eventId?: string;
  quantity: number;
  ticketCategoryId?: string; // make optional
  resaleTicketId?: string;
}


export interface ListResalePayload {
  ticketId: string;
  resalePrice: number;
  bankCode: string;
  accountNumber: string;
}

export interface TicketResale {
  id: string;
  code: string;
  eventId: string;
  userId: string;
  seatNumber?: string;
  status: "ACTIVE" | "RESOLD" | "USED";
  resale?: boolean;
  resalePrice?: number;
  createdAt: string;
  updatedAt: string;
  event: Event;
  isListed: boolean;
  isUsed: boolean;
  listedAt: Date;
  resaleCommission: 225;
  resaleCount: 1;
  soldTo: string;
  user: User;

}
