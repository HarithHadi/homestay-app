import { redirect } from "next/navigation";
import { createAdminClient, isAdmin } from "@/utils/supabase/admin";
import { setBookingStatus } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { displayFont } from "@/lib/font";
import { receiptRef } from "@/lib/receiptRef";

type Booking = {
  access_token: string;
  room_id: number | string;
  in_date: string;
  out_date: string;
  total_amount: number;
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  receipt_url: string | null;
  BookingStatus: string;
};

// Inline preview so the owner doesn't have to open a new tab per booking.
// Extension comes from saveReceipt(): `${token}.${jpeg|png|pdf}`.
function ReceiptPreview({ path, url }: { path: string; url?: string }) {
  if (!url) return <p className="text-sm text-muted-foreground">Receipt link unavailable.</p>;
  const isPdf = path.toLowerCase().endsWith(".pdf");
  return (
    <div className="space-y-1">
      {isPdf ? (
        <iframe src={url} title="Receipt" className="w-full h-96 rounded border" />
      ) : (
        <a href={url} target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL, next/image can't cache it */}
          <img src={url} alt="Payment receipt" className="max-h-96 rounded border object-contain" />
        </a>
      )}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-brand-black font-bold underline decoration-wavy decoration-brand-orange text-sm"
      >
        Open full size
      </a>
    </div>
  );
}

function BookingCard({ b, url }: { b: Booking; url?: string }) {
  const pending = b.BookingStatus === "PENDING";
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-wrap justify-between gap-2">
          <div>
            <p className="font-semibold">{b.guest_name}</p>
            <p className="text-xs text-muted-foreground">Ref {receiptRef(b.access_token)}</p>
            <p className="text-sm">{b.guest_phone} &middot; {b.guest_email}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">RM {Number(b.total_amount).toFixed(2)}</p>
            <p className="text-sm">Room {b.room_id} &middot; {b.in_date} to {b.out_date}</p>            
          </div>
        </div>

        {b.receipt_url ? (
          pending ? ( <ReceiptPreview path={b.receipt_url} url={url} /> ) 
          : (
            // Approved history: collapsed so a long list stays scannable.
            <details>
              <summary className="cursor-pointer text-sm font-bold">Show receipt</summary>
              <div className="pt-2">
                <ReceiptPreview path={b.receipt_url} url={url} />
              </div>
            </details>
          )
        ) : (
          <p className="text-sm text-muted-foreground">No receipt uploaded yet.</p>
        )}

        {pending && (
          <div className="flex gap-2">
            {(["CONFIRMED", "CANCELLED"] as const).map((status) => (
              <form key={status} action={setBookingStatus}>
                <input type="hidden" name="token" value={b.access_token} />
                <input type="hidden" name="status" value={status} />
                <Button
                  type="submit"
                  disabled={status === "CONFIRMED" && !b.receipt_url}
                  className={status === "CONFIRMED" ? "bg-brand-green-dark hover:bg-brand-green-dark/90" : "bg-red-600 hover:bg-red-700"}
                >
                  {status === "CONFIRMED" ? "Confirm" : "Reject"}
                </Button>
              </form>
            ))}
          </div>
        )}

        {b.BookingStatus === "CANCELLED" && (
          <form action={setBookingStatus}>
            <input type="hidden" name="token" value={b.access_token} />
            <input type="hidden" name="status" value="PENDING" />
            <Button type="submit" variant="outline">Restore to pending</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default async function AdminBookingsPage() {
  if (!(await isAdmin())) redirect("/");

  const db = createAdminClient();
  const { data } = await db
    .from("booking")
    .select(
      "access_token, room_id, in_date, out_date, total_amount, guest_name, guest_phone, guest_email, receipt_url, BookingStatus"
    )
    .in("BookingStatus", ["PENDING", "CONFIRMED", "CANCELLED"])
    .order("in_date", { ascending: false });

  const all = (data ?? []) as Booking[];
  const pending = all.filter((b) => b.BookingStatus === "PENDING").reverse(); // soonest check-in first
  const approved = all.filter((b) => b.BookingStatus === "CONFIRMED");
  const rejected = all.filter((b) => b.BookingStatus === "CANCELLED");

  // Receipts live in a private bucket; hand the owner short-lived links.
  const paths = all.flatMap((b) => (b.receipt_url ? [b.receipt_url] : []));
  const { data: signed } = paths.length
    ? await db.storage.from("receipts").createSignedUrls(paths, 3600)
    : { data: [] };
  const receiptLink = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-4">
        <h1 className={`${displayFont.className} text-4xl text-center squiggle`}>Pending bookings</h1>

        {!pending.length && <p className="text-center text-muted-foreground">Nothing to verify.</p>}
        {pending.map((b) => (
          <BookingCard key={b.access_token} b={b} url={b.receipt_url ? receiptLink.get(b.receipt_url) : undefined} />
        ))}

        {[
          { title: "Approved", list: approved, empty: "No approved bookings yet." },
          { title: "Rejected", list: rejected, empty: "No rejected bookings." },
        ].map(({ title, list, empty }) => (
          <details key={title} className="pt-8 space-y-4">
            <summary className={`${displayFont.className} text-2xl cursor-pointer`}>
              {title} ({list.length})
            </summary>
            <div className="space-y-4 pt-4">
              {!list.length && <p className="text-muted-foreground">{empty}</p>}
              {list.map((b) => (
                <BookingCard key={b.access_token} b={b} url={b.receipt_url ? receiptLink.get(b.receipt_url) : undefined} />
              ))}
            </div>
          </details>
        ))}
      </div>
    </main>
  );
}
