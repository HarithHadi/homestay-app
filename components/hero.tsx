'use client'

import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="bg-background text-foreground py-20">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Text content */}
        <div className="max-w-xl space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold">
            Find Your Perfect Getaway
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover cozy homestays and unique stays tailored for your next trip. Feel at home, anywhere.
          </p>
          <Button className="mt-4 px-6 py-3 text-lg">
            Book Now
          </Button>
        </div>

        {/* Image or illustration */}
        <div className="w-full max-w-md">
          <Image
            src="/hero-homestay.jpg" // replace with your actual image
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