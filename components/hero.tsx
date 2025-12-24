'use client'

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { redirect, useRouter } from "next/navigation";



export default function Hero() {
  const router = useRouter();
  const handleClick = () =>{
    router.push("/rooms");
  };

  return (
    <section className="bg-background text-foreground sm:py-20">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Text content */}
        <div className="max-w-xl space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold">
            Find Your Perfect Getaway 🏠
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover cozy homestays and unique stays tailored for your next trip. Feel at home, anywhere.
          </p>
          <Button className="mt-4 px-6 py-3 text-lg" onClick={handleClick}>
            Book Now
          </Button>
        </div>

        {/* Image or illustration */}
        <div className="w-full max-w-md">
          <Image
            src="/hometay.jpeg"
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