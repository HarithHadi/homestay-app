import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import RoomCarou from "@/components/RoomCarou";
import { Bath, BedDouble, BedSingle, Calendar, Users } from "lucide-react";
import { AMENITIES, Fact } from "@/components/RoomFacts";
import { displayFont } from "@/lib/font";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// rating is Agoda's 0–10 score (numeric from Postgres, may arrive as a string)
function ratingLabel(rating: number | string | null): string {
  if(rating === null) return "-";
  const score = Number(rating);
  if(score >= 9) return "★★★★★"
  return `${rating ?? "-"}/10`;
}

function PriceTag({ price }: { price: number }) {
  return (
    <p className="leading-tight text-brand-black">
      <span className="text-2xl font-bold">RM {price}</span>
      <span className="block text-xs text-muted-foreground">per night</span>
    </p>
  );
}

function BookButton({ href, className }: { href: string; className: string }) {
  return (
    <Link
      href={href}
      className={`bg-orange-500 text-brand-black border-2 border-brand-black shadow-[3px_3px_0_0_#323130] rounded-md hover:bg-orange-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-colors group flex items-center justify-center gap-2 ${className}`}
    >
      <Calendar className="h-5 w-5 group-hover:rotate-12 transition-transform" />
      Book Now
    </Link>
  );
}

export default async function RoomPage(props: any) {
  // Cast params to the shape we expect
  const { id } = (await props.params) as { id: string };
  // dates carried over from the rooms search, forwarded to /Payment
  const { check_in, check_out } = (await props.searchParams) as { check_in?: string; check_out?: string };
  const dates: Record<string, string> = {};
  if (check_in) dates.check_in = check_in;
  if (check_out) dates.check_out = check_out;

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

  // reviews for this unit plus ones with no room_id (shown on every unit)
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .or(`room_id.eq.${id},room_id.is.null`)
    .order("review_date", { ascending: false });

  const bookHref = `/Payment?${new URLSearchParams({ room_id: id, ...dates })}`;

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground">Room not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* pb-28 on mobile keeps the last content clear of the sticky book bar */}
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-28 sm:px-6 sm:py-12 space-y-5">
        <div>
          <RoomCarou roomId={room.room_id} />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${displayFont.className} text-3xl sm:text-4xl text-brand-black squiggle justify-center`}>
              {room.room_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* the glance row: who fits and how it sleeps */}
            <ul className="flex flex-wrap gap-2 text-brand-black">
              <Fact icon={Users}>{room.room_capacity} Adults</Fact>
              {room.queen_beds > 0 && <Fact icon={BedDouble}>{room.queen_beds} Queen</Fact>}
              {room.single_bed > 0 && <Fact icon={BedSingle}>{room.single_bed} Single</Fact>}
              {room.toilets > 0 && <Fact icon={Bath}>{room.toilets} Toilets</Fact>}
            </ul>

            {/* only what the unit has; a row of ❌ reads as a list of negatives */}
            <ul className="flex flex-wrap gap-2 text-sm text-brand-black">
              {AMENITIES.filter((a) => room.facilities?.[a.key]).map((a) => (
                <li key={a.key} className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-black/20">
                  <a.icon className="h-4 w-4" /> {a.label}
                </li>
              ))}
            </ul>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {room.room_description}
            </p>

            {/* desktop booking row; phones get the sticky bar below instead */}
            <div className="hidden sm:flex items-center gap-4 pt-2">
              <PriceTag price={room.room_price} />
              <BookButton href={bookHref} className="flex-1 py-4 text-xl" />
            </div>
          </CardContent>
        </Card>

        <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 px-4 py-3 bg-background border-t-2 border-brand-black">
          <PriceTag price={room.room_price} />
          <BookButton href={bookHref} className="flex-1 py-3 text-lg" />
        </div>
        <Card>
          <CardHeader>
              <CardTitle className={`${displayFont.className} text-4xl text-brand-black squiggle justify-center`}>
                Reviews
              </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!reviews?.length && <p className="text-muted-foreground text-center">No reviews yet</p>}
            {!!reviews?.length && (
              // sm:mx-12 leaves room for the arrows, which sit just outside the track
              <Carousel opts={{ align: "start" }} className="sm:mx-12">
                <CarouselContent>
                  {reviews.map((r) => (
                    <CarouselItem key={r.id} className="md:basis-1/2">
                      <div className="h-full p-4 bg-brand-green/70 border-2 border-dashed rounded-lg text-brand-black">
                        <div className="flex justify-between items-baseline gap-2">
                          <p className="font-semibold">{r.author}</p>
                          <p className="font-bold text-yellow-600">{ratingLabel(r.rating)}</p>
                        </div>
                        <p className="mt-2">{r.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {r.review_date} · via {r.source === "agoda" ? "Agoda" : r.source}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            )}
            {room.agoda_url && (
              <a
                href={room.agoda_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center font-semibold text-brand-orange hover:text-brand-orange-hover underline"
              >
                See all reviews on Agoda
              </a>
            )}
          </CardContent>
          
        </Card>

        
      </div>
    </div>
  );
}