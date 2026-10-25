// The guest's browser remembers its bookings as a comma-separated list of
// access tokens, newest first. A booking is only visible to whoever holds its token.
export const BOOKING_COOKIE = "booking_token";
const MAX_TOKENS = 20;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Cookies are user-controlled: drop anything that isn't a uuid before it reaches a query.
export const parseTokens = (value?: string): string[] =>
  (value ?? "").split(",").filter((t) => UUID.test(t));

export const addToken = (value: string | undefined, token: string): string =>
  [token, ...parseTokens(value).filter((t) => t !== token)].slice(0, MAX_TOKENS).join(",");
