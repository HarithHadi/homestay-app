`use client`;

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { roomImages } from "@/lib/roomImage";

export default function RoomCarou({roomId,}: {roomId: number;}){

    const images = roomImages[roomId] ?? [];
    
    return(
        <>
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
                <CarouselPrevious className="hidden sm:flex"/>
                <CarouselNext className="hidden sm:flex"/> 
                </Carousel>
        </div>

        <div className="mt-4">
            <Carousel className="w-full">
            <CarouselContent className="-ml-2">
                {images.map((src, idx) => (
                <CarouselItem key={idx} className="pl-2 basis-1/3">
                    <div className="relative aspect-video rounded-md overflow-hidden border-2 border-gray-200 hover:border-primary transition-all cursor-pointer">
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
            </Carousel>
        </div>
      </>
    )
}