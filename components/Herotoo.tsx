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
    return (
        <section className="relative h-full w-full text-foreground flex items-center bg-[#FDF4AF] overflow-hidden py-12 lg:py-0">
        <div 
        className="absolute inset-0 z-0"
        style={{
            backgroundImage: "repeating-linear-gradient(45deg, #00000010 0px, #00000010 1px, transparent 1px, transparent 12px)",
        }}
        />
        <div 
        className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none"
        style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        />
        <Image
            src="/HeroAssets/Patrick.svg"
            alt="Patrick"
            width={90}
            height={90}
            className="lg:hidden absolute top-4 right-4 -rotate-12 z-20"
        />

            <div className="w-full h-full px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
                {/* Left: text content */}
                <div className="space-y-8 z-10 p-14 rounded-3xl">
                    <h1 className={`${fraunces.className} text-5xl md:text-9xl font-extrabold leading-tight text-orange-500`}>
                        Swit60 Homestay
                    </h1>
                    <p className="text-lg max-w-md font-bold">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat libero excepturi numquam.
                    </p>
                    <Button
                        className="px-6 py-3 text-lg transition-all duration-300 hover:scale-105 bg-orange-500 hover:bg-orange-400"
                        onClick={handleClick}
                    >
                        Book Now
                    </Button>
                </div>
                {/* Right Column: Natural Flow */}
                <div className="hidden lg:flex h-full w-full items-center justify-center">
                    <Image
                        src="/HeroAssets/patrick.svg"
                        alt="Patrick"
                        width={320}
                        height={320}
                        className="w-auto h-auto" 
                    />
                </div>
                
            </div>
        </section>
    )
}