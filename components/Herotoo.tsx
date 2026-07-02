'use client'

import { useRouter } from "next/navigation";
import { Fraunces } from "next/font/google";
import Image from "next/image"
import { Button } from "./ui/button";

const fraunces = Fraunces({
    subsets: ["latin"],
    weight: ["900"],
    display: "swap",
})

export default function Herotoo() {
    const router = useRouter();
    const handleClick = () => {
        router.push("/rooms");
    };

    return(
        <section className="w-full text-foreground min-h-screen flex items-center py-12 sm:py-20 bg-[#FDF4AF]">
            <div className="bg-green-500 rounded-3xl max-w-4xl mx-auto px-6 py-12 flex flex-col lg:flex-row  items-center justify-center lg:justify-between gap-10 relative border border-black">
                <div className="space-y-10">
                    <h1 className={`${fraunces.className} text-4xl md:text-5xl font-extrabold`}>Swit60 Homestay</h1>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat libero excepturi numquam.</p>
                    <Button className="mt-4 px-6 py-3 text-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-lg" onClick={handleClick}>
                        Book Now
                    </Button>
                </div>
                <div className="">
                      {/* sticker star */}
                        <h1 className={`${fraunces.className} text-4xl md:text-5xl font-extrabold`}>Swit60 Homestay</h1>
                </div>
                  {/* sticker star */}
                <Image
                    src="/HeroAssets/star.png"
                    alt= "Star image"
                    width={100}
                    height={100}
                    className="absolute -top-6 -right-6 rotate-12 z-10"
                />
                
            </div>
            
        </section>
    )

}