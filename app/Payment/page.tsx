import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/utils/supabase/admin";
import { createBooking, saveReceipt } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fraunces } from "@/lib/font";

type Params = { room_id?: string; check_in?: string; check_out?: string; error?: string };

export default async function PaymentPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { room_id, check_in, check_out, error } = await searchParams;
  const token = (await cookies()).get("booking_token")?.value;
  const db = createAdminClient();

  // The cookie token is the guest's only credential.
  const { data: booking } = token
    ? await db
        .from("booking")
        .select("room_id, in_date, out_date, total_amount, receipt_url, BookingStatus")
        .eq("access_token", token)
        .maybeSingle()
    : { data: null };

  const open = booking && booking.BookingStatus !== "CANCELLED" ? booking : null;

  if (!open && !room_id) redirect("/rooms");

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-6 py-12">
        <Card className="border border-brand-orange rounded-md bg-brand-black text-white">
          <CardHeader>
            <CardTitle className={`${fraunces.className} text-3xl font-bold text-brand-orange text-center`}>
              {open ? "Complete your payment" : "Your details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-red-400">{error}</p>}

            {open ? (
              <PaymentStep booking={open} />
            ) : (
              <form action={createBooking} className="space-y-4">
                <input type="hidden" name="room_id" value={room_id} />
                <div className="grid grid-cols-2 gap-3 text-white">
                  <div>
                    <Label htmlFor="check_in">Check-in</Label>
                    <Input id="check_in" name="check_in" type="date" defaultValue={check_in} required className="text-black" />
                  </div>
                  <div>
                    <Label htmlFor="check_out">Check-out</Label>
                    <Input id="check_out" name="check_out" type="date" defaultValue={check_out} required className="text-black" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="guest_name">Full name</Label>
                  <Input id="guest_name" name="guest_name" required className="text-black" />
                </div>
                <div>
                  <Label htmlFor="guest_phone">Phone number</Label>
                  <Input id="guest_phone" name="guest_phone" type="tel" required className="text-black" />
                </div>
                <div>
                  <Label htmlFor="guest_email">Email</Label>
                  <Input id="guest_email" name="guest_email" type="email" required className="text-black" />
                </div>
                <SubmitButton pendingText="Reserving..." className="w-full bg-orange-500 hover:bg-orange-600 py-6">
                  Continue to payment
                </SubmitButton>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function PaymentStep({
  booking,
}: {
  booking: { in_date: string; out_date: string; total_amount: number; receipt_url: string | null; BookingStatus: string };
}) {
  const summary = (
    <p className="text-center">
      {booking.in_date} to {booking.out_date} &middot;{" "}
      <strong>RM {Number(booking.total_amount).toFixed(2)}</strong>
    </p>
  );

  if (booking.BookingStatus === "CONFIRMED") {
    return (
      <>
        {summary}
        <p className="text-center text-green-400 font-semibold">Payment verified. Your booking is confirmed!</p>
      </>
    );
  }

  if (booking.receipt_url) {
    return (
      <>
        {summary}
        <p className="text-center">
          Receipt received. The owner is verifying your payment, your booking stays <strong>pending</strong> until then.
        </p>
      </>
    );
  }

  return (
    <>
      {summary}
      <div className="flex justify-center bg-white rounded-md p-4">
        <img src="/payment-qr.jpeg" alt="Scan to pay" className="w-64 h-64 object-contain" />
      </div>
      <p className="text-sm text-center text-muted-foreground">
        Scan with your banking app and transfer the exact amount, then upload your receipt below.
      </p>
      <form action={saveReceipt} className="space-y-3">
        <Input name="receipt" type="file" accept="image/*,application/pdf" required className="text-black bg-white" />
        <SubmitButton pendingText="Uploading..." className="w-full bg-orange-500 hover:bg-orange-600 py-6">
          I&apos;ve paid, send receipt
        </SubmitButton>
      </form>
    </>
  );
}
