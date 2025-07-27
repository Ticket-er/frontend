import type { User, Event, Ticket, AdminStats } from "@/types";

export const demoUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user",
    createdAt: "2024-01-15T10:00:00Z",
    isActive: true,
    totalSpent: 450,
    eventsAttended: 12,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "organizer",
    createdAt: "2024-01-10T09:00:00Z",
    isActive: true,
    totalSpent: 1200,
    eventsAttended: 8,
    eventsOrganized: 15,
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@ticketer.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    createdAt: "2024-01-01T08:00:00Z",
    isActive: true,
    totalSpent: 0,
    eventsAttended: 0,
  },
  {
    id: "4",
    name: "Super Admin",
    email: "superadmin@ticketer.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "superadmin",
    createdAt: "2024-01-01T08:00:00Z",
    isActive: true,
    totalSpent: 0,
    eventsAttended: 0,
  },
];

export const dummyEvents: Event[] = [
  {
    id: "1",
    title: "Summer Music Festival 2024",
    description:
      "Join us for the biggest music festival of the year featuring top artists from around the world.",
    image: "/placeholder.svg?height=300&width=400",
    date: "2024-07-15",
    time: "18:00",
    location: "Central Park, New York",
    venue: "Main Stage",
    price: 89.99,
    category: "Music",
    organizer: "Music Events Co.",
    organizerId: "2",
    capacity: 5000,
    ticketsSold: 3200,
    status: "upcoming",
    tags: ["music", "festival", "outdoor"],
    featured: true,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-25T15:30:00Z",
  },
  {
    id: "2",
    title: "Tech Conference 2024",
    description:
      "Discover the latest trends in technology and network with industry leaders.",
    image: "/placeholder.svg?height=300&width=400",
    date: "2024-08-22",
    time: "09:00",
    location: "Convention Center, San Francisco",
    venue: "Hall A",
    price: 299.99,
    category: "Technology",
    organizer: "Tech Events Inc.",
    organizerId: "2",
    capacity: 1000,
    ticketsSold: 750,
    status: "upcoming",
    tags: ["technology", "conference", "networking"],
    featured: true,
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-02-10T11:20:00Z",
  },
  {
    id: "3",
    title: "Food & Wine Expo",
    description:
      "Taste exquisite dishes and wines from renowned chefs and wineries.",
    image: "/placeholder.svg?height=300&width=400",
    date: "2024-09-10",
    time: "12:00",
    location: "Grand Hotel, Chicago",
    venue: "Ballroom",
    price: 125.0,
    category: "Food & Drink",
    organizer: "Culinary Events LLC",
    organizerId: "2",
    capacity: 300,
    ticketsSold: 180,
    status: "upcoming",
    tags: ["food", "wine", "tasting"],
    featured: false,
    createdAt: "2024-02-15T14:00:00Z",
    updatedAt: "2024-02-20T16:45:00Z",
  },
];

// Export currentUser with walletBalance property
export const currentUser: User & { walletBalance: number } = {
  ...demoUsers[0],
  walletBalance: 25000,
};

export const dummyTickets: Ticket[] = [
  {
    id: "t1",
    eventId: "1",
    userId: "1",
    ticketCode: "SMF2024-001",
    qrCode:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPgogIDxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNmZmYiLz4KICA8dGV4dCB4PSIxMDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiI+U01GMjAyNC0wMDE8L3RleHQ+Cjwvc3ZnPg==",
    purchaseDate: "2024-01-25T14:30:00Z",
    price: 89.99,
    status: "valid",
    ticketType: "general",
  },
  {
    id: "t2",
    eventId: "2",
    userId: "1",
    ticketCode: "TECH2024-001",
    qrCode:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPgogIDxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNmZmYiLz4KICA8dGV4dCB4PSIxMDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiI+VEVDSDIwMjQtMDAxPC90ZXh0Pgo8L3N2Zz4=",
    purchaseDate: "2024-02-05T09:15:00Z",
    price: 299.99,
    status: "valid",
    ticketType: "premium",
  },
];

export const adminStats: AdminStats = {
  totalUsers: 15420,
  totalEvents: 1250,
  totalRevenue: 2450000,
  totalTicketsSold: 45600,
  activeEvents: 180,
  pendingApprovals: 23,
  recentSignups: 156,
  conversionRate: 68.5,
};

export const recentActivities = [
  {
    id: "1",
    type: "user_registration",
    message: "New user registered: john.smith@email.com",
    timestamp: "2024-01-25T10:30:00Z",
  },
  {
    id: "2",
    type: "event_created",
    message: "New event created: 'Spring Concert 2024'",
    timestamp: "2024-01-25T09:15:00Z",
  },
  {
    id: "3",
    type: "ticket_purchase",
    message: "100 tickets sold for 'Tech Summit 2024'",
    timestamp: "2024-01-25T08:45:00Z",
  },
  {
    id: "4",
    type: "payment_dispute",
    message: "Payment dispute reported for order #12345",
    timestamp: "2024-01-24T16:20:00Z",
  },
  {
    id: "5",
    type: "event_approval",
    message: "Event 'Music Festival' approved",
    timestamp: "2024-01-24T14:10:00Z",
  },
];

export const topEvents = [
  {
    id: "1",
    name: "Summer Music Festival",
    ticketsSold: 3200,
    revenue: 287800,
    status: "active",
  },
  {
    id: "2",
    name: "Tech Conference 2024",
    ticketsSold: 750,
    revenue: 224925,
    status: "active",
  },
  {
    id: "3",
    name: "Food & Wine Expo",
    ticketsSold: 180,
    revenue: 22500,
    status: "active",
  },
];

// Resale marketplace tickets
export const resaleTickets = [
  {
    id: "resale1",
    ticketId: "ticket2",
    eventId: "2",
    eventTitle: "Tech Conference 2024",
    eventDate: "2024-08-22",
    eventTime: "09:00",
    eventLocation: "Convention Center, San Francisco",
    eventImage: "/placeholder.svg?height=200&width=300&text=Tech+Conference",
    originalPrice: 299.99,
    resalePrice: 350.0,
    sellerId: "1",
    sellerName: "John Doe",
    sellerRating: 4.8,
    listedDate: "2024-03-20T10:00:00Z",
    category: "Technology",
    ticketType: "general",
    verified: true,
    description:
      "Can't make it to the conference anymore. Selling at a fair price!",
  },
  {
    id: "resale2",
    ticketId: "ticket4",
    eventId: "1",
    eventTitle: "Summer Music Festival 2024",
    eventDate: "2024-07-15",
    eventTime: "18:00",
    eventLocation: "Central Park, New York",
    eventImage: "/placeholder.svg?height=200&width=300&text=Music+Festival",
    originalPrice: 89.99,
    resalePrice: 120.0,
    sellerId: "3",
    sellerName: "Sarah Wilson",
    sellerRating: 4.9,
    listedDate: "2024-03-18T14:30:00Z",
    category: "Music",
    ticketType: "vip",
    verified: true,
    description: "VIP ticket with backstage access included. Great value!",
  },
  {
    id: "resale3",
    ticketId: "ticket5",
    eventId: "3",
    eventTitle: "Food & Wine Expo",
    eventDate: "2024-09-10",
    eventTime: "12:00",
    eventLocation: "Grand Hotel, Chicago",
    eventImage: "/placeholder.svg?height=200&width=300&text=Food+Wine+Expo",
    originalPrice: 125.0,
    resalePrice: 100.0,
    sellerId: "4",
    sellerName: "Mike Johnson",
    sellerRating: 4.6,
    listedDate: "2024-03-22T09:15:00Z",
    category: "Food & Drink",
    ticketType: "general",
    verified: true,
    description: "Selling below original price. Quick sale needed!",
  },
];

export const userTickets = [
  {
    id: "t1",
    eventId: "1",
    eventTitle: "Summer Music Festival 2024",
    eventDate: "2024-07-15",
    eventLocation: "Central Park, New York",
    originalPrice: 89.99,
    status: "active",
    verificationCode: "SMF001",
  },
  {
    id: "t2",
    eventId: "2",
    eventTitle: "Tech Conference 2024",
    eventDate: "2024-08-22",
    eventLocation: "Convention Center, San Francisco",
    originalPrice: 299.99,
    status: "active",
    verificationCode: "TECH001",
  },
];

export const transactions = [
  {
    id: "tx1",
    type: "purchase",
    amount: -89.99,
    status: "completed",
    eventTitle: "Summer Music Festival 2024",
    date: "2024-01-25",
  },
  {
    id: "tx2",
    type: "purchase",
    amount: -299.99,
    status: "completed",
    eventTitle: "Tech Conference 2024",
    date: "2024-02-05",
  },
  {
    id: "tx3",
    type: "resale",
    amount: 75.0,
    status: "completed",
    eventTitle: "Comedy Night",
    date: "2024-01-20",
  },
];

type FormatPriceOptions = {
  locale?: string; // e.g. 'en-NG', 'en-US', 'fr-FR'
  currency?: string; // e.g. 'NGN', 'USD', 'EUR'
};

export const formatPrice = (
  amount: number,
  { locale = "en-NG", currency = "NGN" }: FormatPriceOptions = {}
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

