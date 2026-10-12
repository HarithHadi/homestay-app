import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import RoomCarou from "@/components/RoomCarou";
import { Calendar } from "lucide-react";
import { displayFont } from "@/lib/font";

export default async function RoomPage(props: any) {
  // Cast params to the shape we expect
  const { id } = (await props.params) as { id: string };
  // dates carried over from the rooms search, forwarded to /Payment
  const { check_in, check_out } = (await props.searchParams) as { check_in?: string; check_out?: string };
  const dates: Record<string, string> = {};
  if (check_in) dates.check_in = check_in;
  if (check_out) dates.check_out = check_out;

  const supabase = await createClient();

  // 🔒 Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("room_id", id)
    .single();

  if (error || !room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Room not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-5">
        <div>
          <RoomCarou roomId={room.room_id} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className={`${displayFont.className} text-4xl text-brand-black squiggle justify-center`}>
              {room.room_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {room.room_description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-brand-black">
              <div className="p-4 bg-brand-yellow/60 border-2 border-dashed rounded-lg">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Capacity
                </p>
                <p className="text-2xl font-bold mt-1">{room.room_capacity} people</p>
              </div>
              <div className="p-4 bg-brand-yellow/60 border-2 border-dashed rounded-lg">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Price
                </p>
                <p className="text-2xl font-bold mt-1">RM {room.room_price}</p>
              </div>
            </div>

            <div className="p-4 bg-brand-yellow/60 border-2 border-dashed rounded-lg text-brand-black">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Room Amenities
              </p>
              <ul className="space-y-1.5">
                <li className="text-base">Wifi: {room.facilities.wifi ? "✅" : "❌"}</li>
                <li className="text-base">CarPark: {room.facilities.parking ? "✅" : "❌"}</li>
                <li className="text-base">BBQ Area: {room.facilities.bbq_area ? "✅" : "❌"}</li>
              </ul>
            </div>

            <Link
              href={`/Payment?${new URLSearchParams({ room_id: id, ...dates })}`}
              className="bg-orange-500 w-full py-4 text-xl text-brand-black border-2 border-brand-black shadow-[3px_3px_0_0_#323130] rounded-md hover:bg-orange-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-colors group flex items-center justify-center gap-2"
            >
              <Calendar className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Book Now
            </Link>
          </CardContent>

            

        </Card>

        
      </div>
    </div>
  );
}