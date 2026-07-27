import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoomCarou from "@/components/RoomCarou";
import { Calendar } from "lucide-react";
import { fraunces } from "@/lib/font";

export default async function RoomPage(props: any) {
  // Cast params to the shape we expect
  const { id } = (await props.params) as { id: string };

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

        <Card className="border border-brand-orange rounded-md bg-brand-black text-white">
          <CardHeader>
            <CardTitle className={`${fraunces.className} text-3xl font-bold text-brand-orange justify-center`}>
              {room.room_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {room.room_description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-brand-black">
              <div className="p-4 bg-secondary rounded-lg shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Capacity
                </p>
                <p className="text-2xl font-bold mt-1">{room.room_capacity} people</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Price
                </p>
                <p className="text-2xl font-bold mt-1">RM {room.room_price}</p>
              </div>
            </div>

            <div className="p-4 bg-secondary rounded-lg shadow-sm text-brand-black">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Room Amenities
              </p>
              <ul className="space-y-1.5">
                <li className="text-base">Wifi: {room.facilities.wifi ? "✅" : "❌"}</li>
                <li className="text-base">CarPark: {room.facilities.parking ? "✅" : "❌"}</li>
                <li className="text-base">BBQ Area: {room.facilities.bbq_area ? "✅" : "❌"}</li>
              </ul>
            </div>

            <Button className="bg-orange-500 w-full py-6 text-lg font-semibold rounded-md hover:bg-orange-600 transition-colors group flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Book Now
            </Button>
          </CardContent>

            

        </Card>

        
      </div>
    </div>
  );
}