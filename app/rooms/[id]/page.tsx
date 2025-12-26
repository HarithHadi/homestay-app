import { createClient } from "@/utils/supabase/server";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { redirect } from "next/navigation";
import { roomImages } from "@/lib/roomImage";
import RoomCarou from "@/components/RoomCarou";

export default async function RoomPage(props: any) {
  // Cast params to the shape we expect
  const { id } = (await props.params) as { id: string };

  const supabase = await createClient();

  // 🔒 Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();



  const { data: room, error } = await supabase
    .from("Rooms")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !room) {
    return <div className="">Room not found</div>;
  }

  

  return (
    <div className="mx-auto p-6 space-y-8  sm:w-full">
      <div className=" sm:p-4">
        <RoomCarou roomId ={room.id}/>
      </div>
      

      <div className="bg-background text-foreground rounded-lg shadow-lg p-6 space-y-4  ">
        <h1 className="text-3xl font-bold">{room.room_name}</h1>
        <p className="text-lg text-muted-foreground">{room.room_description}</p>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-secondary rounded-lg shadow-sm">
            <p className="text-sm font-semibold">Capacity</p>
            <p className="text-lg">{room.room_capacity} people</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg shadow-sm">
            <p className="text-sm font-semibold">Price</p>
            <p className="text-lg">RM {room.room_price}</p>
          </div>
        </div>
        <div className="p-4 bg-secondary rounded-lg shadow-sm">
            <p className="text-sm font-semibold">Room Amentities</p>
            <ul>
              <li className="text-lg">Wifi : {room.facilities.wifi ? '✅' : '❌'}</li>
              <li className="text-lg">CarPark: {room.facilities.parking ? '✅' : '❌'}</li>
              <li className="text-lg">BBQ Area: {room.facilities.bbq_area ? '✅' : '❌'}</li>
            </ul>
            
        </div>
      </div>
      <div className="">
        <button className="bg-green-400 p-4 rounded-md text-white">Book Now</button>
      </div>
    </div>
  );
}