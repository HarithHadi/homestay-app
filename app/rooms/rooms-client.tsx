"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface Room {
  room_id: number;
  created_at: string;
  room_price: number;
  room_name: string;
  room_capacity: string;
  room_type: string;
}

const RoomsPageClient = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search bar state
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [filteredRooms, setFilteredRooms] = useState<Room[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const supabase = createClient();

  {/* Fetch rooms from supabase */}
  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error: fetchError } = await supabase
        .from("rooms")
        .select("*")
        .order("room_id", { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setRooms(data || []);
      }
      setLoading(false);
    };

    fetchRooms();
  }, [supabase]);

  {/* Search rooms by availability for the given date range */}
  const handleSearch = async () => {
    setSearchError(null);

    if (!checkIn || !checkOut) {
      setSearchError("Please select both check-in and check-out dates.");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setSearchError("Check-out date must be after check-in date.");
      return;
    }

    setSearching(true);

    // Find bookings that overlap the requested date range.
    // Overlap condition: existing.in_date < requested.out_date AND existing.out_date > requested.in_date
    const { data: overlappingBookings, error: bookingError } = await supabase
      .from("booking")
      .select("room_id, BookingStatus")
      .lt("in_date", checkOut)
      .gt("out_date", checkIn)
      .neq("BookingStatus", "CANCELLED"); // ignore cancelled bookings when checking availability

    if (bookingError) {
      setSearchError(bookingError.message);
      setSearching(false);
      return;
    }

    const bookedRoomIds = new Set(
      (overlappingBookings || []).map((b: { room_id: number }) => b.room_id)
    );

    const available = rooms.filter((room) => !bookedRoomIds.has(room.room_id));
    setFilteredRooms(available);
    setSearching(false);
  };

  const handleClear = () => {
    setCheckIn("");
    setCheckOut("");
    setFilteredRooms(null);
    setSearchError(null);
  };

  {/* Images */}
  const attachImages = (roomList: Room[]) =>
    roomList.map((room) => {
      const cleanName = room.room_name.replace(/\s/g, "");
      let imageUrl = null;
      let isVertical = false;

      if ([1, 2].includes(room.room_id)) {
        imageUrl = `/HomestayPic/${cleanName}/${cleanName}Out.jpeg`;
      } else if ([3, 4, 6].includes(room.room_id)) {
        imageUrl = `/HomestayPic/Home1/Home1Out.jpeg`;
        isVertical = true;
      }

      return { ...room, image_url: imageUrl, isVertical };
    });

  const roomsWithImages = attachImages(filteredRooms ?? rooms);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }



  return (

    
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
          All Rooms
        </h1>

        {/* Search bar */}
        <Card className="mb-8 bg-brand-black ">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <div className="flex-1 text-white">
                <Label htmlFor="check-in" className="mb-1 block font-semibold">
                  Check-In Date
                </Label>
                <Input
                  id="check-in"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="border border-black text-black"
                />
              </div>
              <div className="flex-1 text-white">
                <Label htmlFor="check-out" className="mb-1 block font-semibold">
                  Check-Out Date
                </Label>
                <Input
                  id="check-out"
                  type="date"
                  value={checkOut}
                  min={checkIn || undefined}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="border border-black text-black"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch} disabled={searching} className="bg-orange-500">
                  <Search className="h-4 w-4 mr-2" />
                  {searching ? "Searching..." : "Search"}
                </Button>
                {filteredRooms !== null && (
                  <Button variant="outline" onClick={handleClear}>
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {searchError && (
              <p className="text-sm text-destructive mt-3">{searchError}</p>
            )}

            {filteredRooms !== null && !searchError && (
              <p className="text-sm text-muted-foreground mt-3">
                Showing {filteredRooms.length} room
                {filteredRooms.length === 1 ? "" : "s"} available from{" "}
                {checkIn} to {checkOut}.
              </p>
            )}
          </CardContent>
        </Card>

        {roomsWithImages.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {filteredRooms !== null
              ? "No rooms available for the selected dates."
              : "No rooms found."}
          </p>
        ) : (

          // -------------------------------------------Rooms-------------------------------------------
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomsWithImages.map((room) => (
              <Link key={room.room_id} href={`/rooms/${room.room_id}`} className="block">
                <Card className="flex flex-col h-full border border-brand-orange overflow-hidden transition-shadow duration-300 hover:border-4 rounded-md bg-brand-black text-white">
                  <div className="w-full h-56 bg-muted flex items-center justify-center overflow-hidden">
                    {room.image_url ? (
                      <img
                        src={room.image_url}
                        alt={room.room_name}
                        className={
                          room.isVertical
                            ? "w-40 h-full object-scale-down"
                            : "w-full h-full object-cover"
                        }
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">No Image</span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-4">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-lg font-semibold">
                        {room.room_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-1 text-sm">
                      <p><strong>Type:</strong> {room.room_type}</p>
                      <p><strong>Capacity:</strong> {room.room_capacity}</p>
                      <p><strong>Price:</strong> RM{room.room_price.toFixed(2)}</p>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsPageClient;