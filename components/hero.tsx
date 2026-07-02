'use client'

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/rooms");
  };

  return (
    <section className="bg-background text-foreground min-h-[80vh] flex items-center py-12 sm:py-20">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10">
        
        <div className="max-w-xl space-y-6 text-center lg:text-left order-2 lg:order-1">
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome to Swit60 Homestay 🏠
          </h1>
          <Button className="mt-4 px-6 py-3 text-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-lg" onClick={handleClick}>
            Book Now
          </Button>
        </div>

        <div className="w-full max-w-md order-1 lg:order-2">
          <Image
            src="/HomestayPic/Home2/Home2Out.jpeg"
            alt="Cozy homestay"
            width={500}
            height={400}
            className="rounded-xl shadow-lg object-cover w-full"
          />
        </div>
      </div>
    </section>
  )
}