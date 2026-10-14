"use client";

import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { FlipNumber } from "@/components/domain/flip-number";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FlipDemo() {
  const [kg, setKg] = useState(5);
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-2xl font-semibold">
        <FlipNumber value={kg * 800} kind="money" />
      </p>
      <p className="text-base text-ink-muted">
        <FlipNumber value={kg} kind="weight" /> × Rs 800/kg
      </p>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          setKg((value) => (value >= 9 ? 1 : value + 1));
        }}
      >
        Add 1 kg
      </Button>
    </div>
  );
}

export function StatesDemo() {
  const [attempts, setAttempts] = useState(0);
  return (
    <div className="grid gap-8 @lg:grid-cols-2">
      <EmptyState
        title="No trips yet"
        description="Post the trip you are already taking and people on your route can ask you to carry something."
        action={
          <Button variant="secondary" size="sm">
            Post a trip
          </Button>
        }
      />
      <ErrorState
        title={
          attempts === 0
            ? "We could not load your trips"
            : "Still could not load your trips"
        }
        fix="This is usually your connection. Check you are online, then try again."
        onRetry={() => {
          setAttempts((value) => value + 1);
        }}
      />
    </div>
  );
}

export function ControlsDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button>Accept</Button>
        <Button variant="secondary">Edit trip</Button>
        <Button variant="text">Decline</Button>
        <Button variant="danger">Decline request</Button>
        <Button size="sm" variant="secondary">
          Small
        </Button>
        <Button size="lg">Large</Button>
        <Button disabled>Disabled</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bench-origin" className="text-base font-medium">
            From
          </label>
          <Input id="bench-origin" placeholder="Lahore" autoComplete="off" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bench-weight" className="text-base font-medium">
            Weight
          </label>
          <Input
            id="bench-weight"
            aria-invalid
            aria-describedby="bench-weight-error"
            defaultValue="60"
          />
          <p id="bench-weight-error" className="text-base text-danger">
            Weight must be 50 kg or less.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <span id="bench-reason-label" className="text-base font-medium">
            Dispute reason
          </span>
          <Select>
            <SelectTrigger aria-labelledby="bench-reason-label">
              <SelectValue placeholder="Choose a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_received">Not received</SelectItem>
              <SelectItem value="damaged">Damaged</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="sender">
        <TabsList aria-label="Shipments">
          <TabsTrigger value="sender">Sending</TabsTrigger>
          <TabsTrigger value="traveler">Carrying</TabsTrigger>
        </TabsList>
        <TabsContent value="sender" className="text-base text-ink-muted">
          Shipments you send.
        </TabsContent>
        <TabsContent value="traveler" className="text-base text-ink-muted">
          Shipments you carry.
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Cancel trip…</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel this trip?</DialogTitle>
              <DialogDescription>
                Everyone waiting for a reply is told, and their requests are
                declined.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Keep trip</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="danger">Cancel trip</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>Narrow down trips.</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Open sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Quick links.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" aria-label="More actions">
              <MoreHorizontalIcon aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Trip</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="danger">Cancel trip</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary">What is verified?</Button>
          </TooltipTrigger>
          <TooltipContent>
            An admin checked this person&apos;s ID
          </TooltipContent>
        </Tooltip>

        <Button
          variant="secondary"
          onClick={() => {
            toast("Request sent", {
              description:
                "Sana will reply here. You pay only after she accepts.",
            });
          }}
        >
          Show toast
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Avatar>
          <AvatarFallback>AZ</AvatarFallback>
        </Avatar>
        <Badge>Carries things</Badge>
        <Badge variant="outline">Sends things</Badge>
      </div>
    </div>
  );
}
