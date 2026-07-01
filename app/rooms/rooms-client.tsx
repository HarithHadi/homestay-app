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
  room_type: string;
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
          .from("rooms")
          .select("*")
          .order('room_id', { ascending: true })

        if (fetchError) {
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        if (data) {
          if (occupied.length > 0) {
            setRooms(data.filter((room) => !occupied.includes(room.room_id)));
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

  const BASE_IMAGE_URL = "/HomestayPic";

  const roomsImg = rooms.map((room) => {
    let imageUrl = null;
    let isVertical = false; 

    const cleanName = room.room_name.replace(/\s/g, '');

    if([1, 2].includes(room.room_id)){
      imageUrl = `/HomestayPic/${cleanName}/${cleanName}Out.jpeg`;
    }
    else if([3, 4, 6].includes(room.room_id)){
      imageUrl = `/HomestayPic/IndividualHome/IndiOutHome1.jpeg`;
      isVertical = true;
    }

    return{
      ...room, image_url : imageUrl, isVertical
    };

  })

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
          {roomsImg.map((room) => (
            <Link  key={room.room_id} href={`/rooms/${room.room_id}`} className='block'>
                <Card
                key={room.room_id}
                className="bg-background text-foreground flex flex-col sm:flex-row overflow-hidden transform transition duration-300 ease-in-out hover:shadow-lg"
                >
                <div className="sm:w-2/5 bg-gray-100 flex items-center justify-center overflow-hidden min-h-[200px] sm:min-h-[250px]">
                  {/* If the image URL exists, try to load it. Otherwise, you can rely on the gray background! */}
                  {room.image_url ? (
                      <img
                          src={"/HomestayPic/Home1/Home1Out.jpeg"} // <-- Now using your dynamic URL!
                          alt={room.room_name} // <-- Better accessibility than just "Room"
                          className={`${ 
                              room.isVertical 
                              ? "w-40 h-full object-scale-down" 
                              : "w-full h-full object-cover"       
                          }`}
                          // Optional: If the image path is broken, hide the broken image icon so it just shows the neat gray box
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                  ) : (
                      // Optional fallback text or icon if there is no image assigned
                      <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
                <div className="sm:w-3/5 flex flex-col justify-between sm:p-4">
                    <CardHeader>
                    <CardTitle className="text-xl font-semibold text-center">
                        {room.room_name}
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p>
                        <strong>House Type:</strong> {room.room_type}
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
