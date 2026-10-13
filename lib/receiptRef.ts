// The reference printed on the customer's receipt and shown to the owner in

import { createHash } from "crypto";

// /admin/bookings, so a customer can quote it and the owner can find the booking.
export function receiptRef(accessToken: string): string {
  // TODO(human): choose the reference format customers will see and quote.
  // Default below: "SW-" + first 8 chars of the token, e.g. SW-1A2B3C4D.
  const hash = createHash("sha256").update(accessToken).digest("hex");
  return `SW-${hash.slice(0, 8).toUpperCase()}`;
}
