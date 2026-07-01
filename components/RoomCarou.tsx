"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"; 
import Image from "next/image";
import { roomImages } from "@/lib/roomImage";
import { useEffect, useState } from "react";
import { Maximize2 } from "lucide-react"; 

export default function RoomCarou({ roomId }: { roomId: number }) {
  const images = roomImages[roomId] ?? [];
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!mainApi) return;
    mainApi.on("select", () => {
      setCurrent(mainApi.selectedScrollSnap());
    });
  }, [mainApi]);

  const onThumbClick = (index: number) => {
    if (!mainApi) return;
    mainApi.scrollTo(index);
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto shadow-2xl">
        <Carousel setApi={setMainApi}>
          <CarouselContent>
            {images.map((src, idx) => (
              <CarouselItem key={idx} className="flex justify-center">
                {/* Wrap image in Dialog for Full Size view */}
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-md cursor-zoom-in group">
                      <Image
                        src={src}
                        alt={`Room image ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Overlay hint icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                         <Maximize2 className="text-white w-8 h-8" />
                      </div>
                    </div>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent">
                    <div className="relative w-full h-[80vh]">
                      <Image
                        src={images[current]} 
                        alt="Full size view"
                        fill
                        className="object-contain" 
                        priority
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>

      
      <div className="mt-4">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2">
            {images.map((src, idx) => (
              <CarouselItem
                key={idx}
                className="pl-2 basis-1/3"
                onClick={() => onThumbClick(idx)}
              >
                <div
                  className={`relative aspect-video rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                    current === idx ? "border-primary ring-2 ring-primary/20" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${idx + 1}`}
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
  );
}