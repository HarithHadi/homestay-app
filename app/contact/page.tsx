import { MapPin, MessageCircle, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { displayFont } from "@/lib/font";
import { cn } from "@/lib/utils";

export const metadata = { title: "Contact | Swit60 Homestay" };

const PHONE = "60193770032"; // international digits, no + or spaces, e.g. "60123456789"
const ADDRESS = "Jalan Peket 60, Sungai Haji Dorani, Sungai Besar, Sabak Bernam, Malaysia, 45300";
const WA_TEXT = "Hi, I'm interested in staying at Swit60 Homestay";

const map = encodeURIComponent(ADDRESS);

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-4">
        <h1 className={`${displayFont.className} text-4xl text-center squiggle`}>Contact us</h1>

        <Card>
          <CardContent className="pt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={`https://wa.me/${PHONE}?text=${encodeURIComponent(WA_TEXT)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants(), "gap-2")}
            >
              <MessageCircle size={18} /> WhatsApp us
            </a>
            <a href={`tel:+${PHONE}`} className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>
              <Phone size={18} /> Call +{PHONE}
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-3">
            <p className="flex gap-2">
              <MapPin size={18} className="shrink-0 mt-1" /> {ADDRESS}
            </p>
            <iframe
              src={`https://www.google.com/maps?q=${map}&output=embed`}
              title="Map to Swit60 Homestay"
              loading="lazy"
              className="w-full h-72 rounded-md border-0"
            />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${map}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }), "w-full gap-2")}
            >
              <MapPin size={18} /> Get directions
            </a>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
