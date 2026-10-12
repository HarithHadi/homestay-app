import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/utils/supabase/admin";
import PrintButton from "@/components/PrintButton";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BOOKING_COOKIE, parseTokens } from "@/lib/bookingCookie";
import { receiptRef } from "@/lib/receiptRef";
import { displayFont } from "@/lib/font";

export default async function ReceiptPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  // The token in the URL is not enough: it must also be in this browser's cookie.
  const owned = parseTokens((await cookies()).get(BOOKING_COOKIE)?.value).includes(token);
  if (!owned) redirect("/bookings");

  const db = createAdminClient();
  const { data: b } = await db.from("booking").select("*").eq("access_token", token).maybeSingle();
  if (!b) redirect("/bookings");

  // A receipt for a payment nobody has verified would be misleading.
  if (b.BookingStatus !== "CONFIRMED") {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-xl mx-auto px-6 py-12 space-y-4 text-center">
          <p>Your receipt is available once the owner has verified your payment.</p>
          <Link href="/bookings" className={buttonVariants()}>
            Back to my bookings
          </Link>
        </div>
      </main>
    );
  }

  const { data: room } = await db.from("rooms").select("room_name").eq("room_id", b.room_id).maybeSingle();
  const nights = Math.round((Date.parse(b.out_date) - Date.parse(b.in_date)) / 86_400_000);

  const rows: [string, string][] = [["Reference", receiptRef(token)]];
  // created_at only exists if the table has it; skip the row otherwise
  if (b.created_at) {
    rows.push(["Booked on", new Date(b.created_at).toLocaleDateString("en-MY", { dateStyle: "long" })]);
  }
  rows.push(
    ["Guest", b.guest_name],
    ["Phone", b.guest_phone],
    ["Email", b.guest_email],
    ["Room", room?.room_name ?? `Room ${b.room_id}`],
    ["Check-in", b.in_date],
    ["Check-out", b.out_date],
    ["Nights", String(nights)]
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-6 py-12 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className={`${displayFont.className} text-4xl text-center squiggle`}>
              Payment receipt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <dl className="space-y-2">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-dashed pb-1">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex justify-between text-2xl pt-2">
              <span>Total paid</span>
              <strong>RM {Number(b.total_amount).toFixed(2)}</strong>
            </div>
            <p className="text-center text-green-700 font-semibold">Payment verified. Thank you!</p>
          </CardContent>
        </Card>

        <PrintButton />
        <Link href="/bookings" className={`${buttonVariants({ variant: "secondary" })} w-full py-6 print:hidden`}>
          My bookings
        </Link>
      </div>
    </main>
  );
}
