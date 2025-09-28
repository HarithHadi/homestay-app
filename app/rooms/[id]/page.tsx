import { createClient } from '@/utils/supabase/server';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default async function RoomPage({   params,
}: {
  params: { id: string }
}) {
  const { id } = params;
  const supabase = await createClient();

  const { data: room, error } = await supabase
    .from("Rooms")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !room) {
    return <div className="">Room not found</div>;
  }

  const images = [
    "/hones.jpg",
    "/hones.jpg",
    "/hones.jpg",
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="w-full max-w-3xl mx-auto shadow-2xl">
        <Carousel>
          <CarouselContent>
            {images.map((src, idx) => (
              <CarouselItem key={idx} className="flex justify-center">
                <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={src}
                    alt={`Room image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="bg-background text-foreground rounded-lg shadow-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold">{room.room_name}</h1>
        <p className="text-lg text-muted-foreground">{room.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-secondary rounded-lg shadow-sm">
            <p className="text-sm font-semibold">Capacity</p>
            <p className="text-lg">{room.room_capacity} people</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg shadow-sm">
            <p className="text-sm font-semibold">Price</p>
            <p className="text-lg">RM {room.room_price}</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg shadow-sm">
            <p className="text-sm font-semibold">Location</p>
            <p className="text-lg">{room.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
