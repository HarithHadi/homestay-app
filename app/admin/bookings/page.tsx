import { redirect } from "next/navigation";
import { createAdminClient, isAdmin } from "@/utils/supabase/admin";
import { setBookingStatus } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fraunces } from "@/lib/font";

export default async function AdminBookingsPage() {
  if (!(await isAdmin())) redirect("/");

  const db = createAdminClient();
  const { data: bookings } = await db
    .from("booking")
    .select("access_token, room_id, in_date, out_date, total_amount, guest_name, guest_phone, guest_email, receipt_url")
    .eq("BookingStatus", "PENDING")
    .order("in_date");

  // Receipts live in a private bucket; hand the owner short-lived links.
  const paths = (bookings ?? []).flatMap((b) => (b.receipt_url ? [b.receipt_url] : []));
  const { data: signed } = paths.length
    ? await db.storage.from("receipts").createSignedUrls(paths, 3600)
    : { data: [] };
  const receiptLink = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-4">
        <h1 className={`${fraunces.className} text-3xl font-bold text-center`}>Pending bookings</h1>

        {!bookings?.length && <p className="text-center text-muted-foreground">Nothing to verify.</p>}

        {bookings?.map((b) => (
          <Card key={b.access_token} className="border border-brand-orange bg-brand-black text-white">
            <CardContent className="p-4 space-y-3">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-semibold">{b.guest_name}</p>
                  <p className="text-sm">{b.guest_phone} &middot; {b.guest_email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">RM {Number(b.total_amount).toFixed(2)}</p>
                  <p className="text-sm">Room {b.room_id} &middot; {b.in_date} to {b.out_date}</p>
                </div>
              </div>

              {b.receipt_url ? (
                <a
                  href={receiptLink.get(b.receipt_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-orange underline text-sm"
                >
                  View receipt
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">No receipt uploaded yet.</p>
              )}

              <div className="flex gap-2">
                {(["CONFIRMED", "CANCELLED"] as const).map((status) => (
                  <form key={status} action={setBookingStatus}>
                    <input type="hidden" name="token" value={b.access_token} />
                    <input type="hidden" name="status" value={status} />
                    <Button
                      type="submit"
                      disabled={status === "CONFIRMED" && !b.receipt_url}
                      className={status === "CONFIRMED" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                    >
                      {status === "CONFIRMED" ? "Confirm" : "Reject"}
                    </Button>
                  </form>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
