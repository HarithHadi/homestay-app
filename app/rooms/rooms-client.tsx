// /rooms/rooms-client.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { checkAvailability } from "../actions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Room {
  id: number;
  created_at: string;
  room_price: number;
  room_name: string;
  room_capacity: string;
}

const RoomsPageClient = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const searchParams = useSearchParams();

  const occupied = (searchParams.get("occupied")?.split(",") || []).map(Number);
  const check_in = searchParams.get("check_in")?.toString();
  const check_out = searchParams.get("check_out")?.toString();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("Rooms")
          .select("*");

        if (fetchError) {
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        if (data) {
          if (occupied.length > 0) {
            setRooms(data.filter((room) => !occupied.includes(room.id)));
          } else {
            setRooms(data);
          }
        } else {
          setRooms([]);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching rooms.");
        setLoading(false);
      }
    };

    fetchRooms();
  }, [occupied, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading rooms data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="container border rounded-xl shadow-md p-4">
        <form>
          <div className="flex flex-col sm:flex-row gap-y-3 sm:gap-x-3">
            <div className="flex-1">
              <label className="text-sm font-medium">Check in</label>
              <Input
                name="check_in"
                required
                type="date"
                className="w-full"
                defaultValue={check_in || ""}
              />
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium">Check Out</label>
              <Input
                name="check_out"
                required
                type="date"
                className="w-full"
                defaultValue={check_out || ""}
              />
            </div>
          </div>
          <div className="flex flex-col justify-end sm:flex-1">
            <label className="opacity-0">Search 🔍</label>
            <SubmitButton
              type="submit"
              formAction={checkAvailability}
              className="bg-green-500 hover:bg-green-700"
            >
              Search 🔍
            </SubmitButton>
          </div>
        </form>
      </div>

      <div className="container mx-auto p-4">
        {occupied.length > 0 ? (
          <h1 className="text-3xl font-bold mb-6 text-center">
            Available Rooms
          </h1>
        ) : (
          <h1 className="text-3xl font-bold mb-6 text-center">All Rooms</h1>
        )}
        <div className="space-y-6">
          {rooms.map((room) => (
            <Link  key={room.id} href={`/rooms/${room.id}`} className="block">
                <Card
                key={room.id}
                className="bg-background text-foreground flex flex-col sm:flex-row overflow-hidden transform transition duration-300 ease-in-out hover:shadow-lg"
                >
                <div className="sm:w-1/3">
                    <img
                    src="/hones.jpg"
                    alt="Room"
                    className="w-full h-full object-cover"
                    />
                </div>

                <div className="sm:w-2/3 flex flex-col justify-between">
                    <CardHeader>
                    <CardTitle className="text-xl font-semibold text-center">
                        {room.room_name}
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p>
                        <strong>Room ID:</strong> {room.id}
                    </p>
                    <p>
                        <strong>Created At:</strong>{" "}
                        {new Date(room.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        })}
                    </p>
                    <p>
                        <strong>Capacity:</strong> {room.room_capacity}
                    </p>
                    <p>
                        <strong>Price:</strong> RM{room.room_price.toFixed(2)}
                    </p>
                    </CardContent>
                </div>
                </Card>
            </Link>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center text-gray-500 mt-4">No rooms found.</div>
        )}
      </div>
    </>
  );
};

export default RoomsPageClient;
