import Link from "next/link";
import { cookies } from "next/headers";
import { createAdminClient } from "@/utils/supabase/admin";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BOOKING_COOKIE, parseTokens } from "@/lib/bookingCookie";
import { receiptRef } from "@/lib/receiptRef";
import { displayFont } from "@/lib/font";

const badge: Record<string, string> = {
  PENDING: "bg-brand-yellow",
  CONFIRMED: "bg-brand-green",
  CANCELLED: "bg-red-200",
};

export default async function BookingsPage() {
  // History is whatever this browser's cookie remembers; no account involved.
  const tokens = parseTokens((await cookies()).get(BOOKING_COOKIE)?.value);
  const db = createAdminClient();

  const { data: bookings } = tokens.length
    ? await db
        .from("booking")
        .select("access_token, room_id, in_date, out_date, total_amount, receipt_url, BookingStatus")
        .in("access_token", tokens)
        .order("in_date", { ascending: false })
    : { data: [] };

  const roomIds = Array.from(new Set((bookings ?? []).map((b) => b.room_id)));
  const { data: rooms } = roomIds.length
    ? await db.from("rooms").select("room_id, room_name").in("room_id", roomIds)
    : { data: [] };
  const roomName = new Map((rooms ?? []).map((r) => [r.room_id, r.room_name]));

  return (
    <main className="min-h-screen ">
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-4">
        <h1 className={`${displayFont.className} text-4xl text-center squiggle`}>My bookings</h1>

        {!bookings?.length && (
          <div className="text-center space-y-4 pt-4">
            <p className="text-muted-foreground">No bookings on this device yet.</p>
            <Link href="/rooms" className={buttonVariants()}>
              Browse rooms
            </Link>
          </div>
        )}

        {bookings?.map((b) => {
          const status = b.BookingStatus as string;
          const label =
            status === "PENDING"
              ? b.receipt_url
                ? "Awaiting verification"
                : "Awaiting payment"
              : status === "CONFIRMED"
                ? "Confirmed"
                : "Cancelled";

          return (
            <Card key={b.access_token}>
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xl font-semibold">{roomName.get(b.room_id) ?? `Room ${b.room_id}`}</p>
                    <p className="text-sm">
                      {b.in_date} to {b.out_date}
                    </p>
                    <p className="text-xs text-muted-foreground">Ref {receiptRef(b.access_token)}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span
                      className={`inline-block border-2 border-brand-black rounded-full px-3 text-sm ${badge[status] ?? ""}`}
                    >
                      {label}
                    </span>
                    <p className="font-semibold">RM {Number(b.total_amount).toFixed(2)}</p>
                  </div>
                </div>

                {status === "CONFIRMED" && (
                  <Link href={`/bookings/${b.access_token}`} className={`${buttonVariants()} w-full`}>
                    View receipt
                  </Link>
                )}
                {status === "PENDING" && (
                  <Link
                    href={`/Payment?booking=${b.access_token}`}
                    className={`${buttonVariants({ variant: "secondary" })} w-full`}
                  >
                    {b.receipt_url ? "View status" : "Continue payment"}
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
