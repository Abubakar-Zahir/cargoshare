import type { StatusLineTurn } from "@/components/domain/status-line";
import type { TurnItem } from "@/components/domain/your-turn";
import { shipmentStatus, tripStatus, type StatusStyle } from "@/lib/status";

export interface DemoRequest {
  id: string;
  sender: string;
  item: string;
  weightKg: number;
  ratePerKg: number;
  total: number;
}

export interface DemoShipment {
  id: string;
  origin: string;
  destination: string;
  item: string;
  weightKg: number;
  date: string;
  status: StatusStyle;
  turn: StatusLineTurn;
  next: string;
}

const incomingRequests: DemoRequest[] = [
  {
    id: "r1",
    sender: "Bilal",
    item: "Box of Sindhri mangoes",
    weightKg: 5,
    ratePerKg: 800,
    total: 4000,
  },
  {
    id: "r2",
    sender: "Hira",
    item: "Wedding sweets",
    weightKg: 2.5,
    ratePerKg: 800,
    total: 2000,
  },
  {
    id: "r3",
    sender: "Usman",
    item: "Laptop charger",
    weightKg: 0.5,
    ratePerKg: 800,
    total: 400,
  },
];

export const carrying: DemoShipment[] = [
  {
    id: "c1",
    origin: "Lahore",
    destination: "Karachi",
    item: "Spice box",
    weightKg: 2,
    date: "2026-10-19",
    status: shipmentStatus.accepted,
    turn: "them",
    next: "Waiting for Kamran to pay Rs 1,600",
  },
  {
    id: "c2",
    origin: "Lahore",
    destination: "Karachi",
    item: "Documents folder",
    weightKg: 0.5,
    date: "2026-10-19",
    status: shipmentStatus.accepted,
    turn: "you",
    next: "confirm handoff when Ayesha gives you the folder",
  },
];

export const sending: DemoShipment[] = [
  {
    id: "s1",
    origin: "Islamabad",
    destination: "Peshawar",
    item: "Gift hamper",
    weightKg: 3,
    date: "2026-10-15",
    status: shipmentStatus.in_transit,
    turn: "them",
    next: "Waiting for Imran to confirm delivery",
  },
  {
    id: "s2",
    origin: "Multan",
    destination: "Lahore",
    item: "Handmade pottery",
    weightKg: 4.25,
    date: "2026-10-10",
    status: shipmentStatus.delivered,
    turn: "you",
    next: "rate how it went with Zara",
  },
];

export interface DemoTripRequests {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  requests: DemoRequest[];
}

export const requestsByTrip: DemoTripRequests[] = [
  {
    id: "t1",
    origin: "Lahore",
    destination: "Karachi",
    departureDate: "2026-10-19",
    requests: incomingRequests,
  },
  {
    id: "t2",
    origin: "Lahore",
    destination: "Islamabad",
    departureDate: "2026-10-24",
    requests: [
      {
        id: "r4",
        sender: "Fatima",
        item: "Book parcel",
        weightKg: 1.5,
        ratePerKg: 500,
        total: 750,
      },
    ],
  },
];

export const turnItems: TurnItem[] = [
  {
    id: "pay",
    title: "Pay Rs 1,950 for a parcel of shawls",
    detail: "Hamza accepted your request. Pay to keep your space.",
    href: "/shipments/s3",
  },
  {
    id: "requests",
    title: "3 requests on your Karachi trip",
    detail: "The oldest is from Bilal, 2 days ago.",
    href: "/requests",
  },
  {
    id: "handoff",
    title: "Confirm handoff: Documents folder",
    detail: "Ayesha is giving it to you before your trip.",
    href: "/shipments/c2",
  },
];

export const nextTrip = {
  origin: "Lahore",
  destination: "Karachi",
  departureDate: "2026-10-19",
  carrierName: "You",
  carrierVerified: false,
  remainingKg: "12.5",
  totalKg: 20,
  ratePerKg: 800,
  status: tripStatus.active,
};

export const myTrips = [
  nextTrip,
  {
    origin: "Lahore",
    destination: "Islamabad",
    departureDate: "2026-10-24",
    carrierName: "You",
    carrierVerified: false,
    remainingKg: 0,
    totalKg: 8,
    ratePerKg: 500,
    status: tripStatus.full,
  },
  {
    origin: "Karachi",
    destination: "Hyderabad",
    departureDate: "2026-09-02",
    carrierName: "You",
    carrierVerified: false,
    remainingKg: 3,
    totalKg: 10,
    ratePerKg: 300,
    status: tripStatus.completed,
  },
];
