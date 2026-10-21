"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient, isAdmin } from "@/utils/supabase/admin";
import { validateReceipt } from "@/lib/validateReceipt";
import { BOOKING_COOKIE, addToken, parseTokens } from "@/lib/bookingCookie";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const phone_number = formData.get("phone_number")?.toString();
  const first_name = formData.get("first_name")?.toString();
  const surname = formData.get("surname")?.toString();
  const dob = formData.get("dob")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data :{
        first_name,
        surname,
        dob,
        phone_number
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export async function signUpwithPhone(formData : FormData){
  const supabase = await createClient();
  const phone_number = formData.get("phone_number") as string;

  const {error} = await supabase.auth.signInWithOtp({
    phone : phone_number
  })

  if(error) {
    console.log(error);
  } else {
    console.log("OTP sent successfully !")
    redirect(`/otp-page?phone=${encodeURIComponent(phone_number)}`);
    
  }
}

export async function verifyOTP(formData: FormData) {
  const supabase = await createClient();

  
  const phone = formData.get("phone") as string;
  const token = formData.get("token") as string;

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms", 
  });

  if (error) {
     console.error("Invalid OTP:", error.message);
     throw new Error("Invalid OTP"); // server action will handle this
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, date_of_birth") // select only what you care about
    .eq("id", user.id)
    .single();

    if (!profile || !profile.first_name || !profile.date_of_birth) {
      return redirect(`/complete-profile?phone=${encodeURIComponent(phone)}`);
    }
  }

  console.log("Login success!", data.session);
  redirect("/");
}


export async function signInWithGoogle(){
  const supabase = createClient();

  const {data, error} = await (await supabase).auth.signInWithOAuth({
    provider : "google",
    options : {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if(error){
    throw new Error(error.message);
  }
  if (data.url) {
    // 🔹 force redirect to Google
    redirect(data.url);
  }
  
}

export const completeProfile = async (formData: FormData) => {
  const supabase = await createClient(); // no await

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("No authenticated user");
  }

  const first_name = formData.get("first_name")?.toString();
  const surname = formData.get("surname")?.toString();
  const dob = formData.get("dob")?.toString();
  const phone_number = formData.get("phone_number")?.toString();

// console.log("user.id:", user.id);
// const { data: profiles } = await supabase.from("Profiles").select("id");
// console.log("all profile ids:", profiles);

  console.log("Updating user:", user.id);
  console.log("Update data:", { first_name, surname, dob, phone_number });

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      first_name,
      surname,
      date_of_birth: dob ? new Date(dob).toISOString() : null,
      phone_number,
    })
    .eq("id", user.id);

  if (error) {
    console.log(error);
    throw error;
  }

  redirect("/")
};


export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};


export async function checkAvailability(formData: FormData){
  const CheckIn = formData.get("check_in")?.toString()
  const CheckOut = formData.get("check_out")?.toString()
  const supabase = await createClient();

  const {data, error} = await supabase
  .from("booking")
  .select(`room_id`)
  .lt('in_date',CheckOut)
  .gt('out_date',CheckIn);

  const occupied = data
  if(error){
    console.error(error.message)
    return redirect("/rooms?error=availability");
  }
  if(!data || data.length === 0){
    console.log(`all rooms are unoccupied at ${CheckIn} and ${CheckOut}`);
  }else{
    console.log(`these rooms are occupied: ${data.map(r => r.room_id).join(",")}`);
  }

  const roomIds = data.map((row)=> row.room_id).join(",")
  return redirect(`/rooms?occupied=${roomIds}&check_in=${CheckIn}&check_out=${CheckOut}`)
  
}


// ---------- Guest QR payment (cookie-identified, no account) ----------
export async function createBooking(formData: FormData) {
  const roomId = Number(formData.get("room_id"));
  const checkIn = formData.get("check_in")?.toString() ?? "";
  const checkOut = formData.get("check_out")?.toString() ?? "";
  const guest_name = formData.get("guest_name")?.toString().trim() ?? "";
  const guest_phone = formData.get("guest_phone")?.toString().trim() ?? "";
  const guest_email = formData.get("guest_email")?.toString().trim() ?? "";

  const back = (error: string): never =>
    redirect(
      `/Payment?${new URLSearchParams({ room_id: String(roomId), check_in: checkIn, check_out: checkOut, error })}`
    );

  if (!roomId || !guest_name || !guest_phone || !guest_email) {
    return back("Please fill in all fields.");
  }
  const nights = Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000);
  if (!(nights > 0)) return back("Check-out must be after check-in.");
  if (checkIn < new Date().toISOString().slice(0, 10)) return back("Check-in can't be in the past.");

  const db = createAdminClient();
  const jar = await cookies();
  const myTokens = parseTokens(jar.get(BOOKING_COOKIE)?.value);

  if(myTokens.length) {
    const {data: mine} = await db
      .from("booking")
      .select('access_token')
      .in("access_token", myTokens)
      .eq("room_id", roomId)
      .eq("in_date", checkIn)
      .eq("out_date", checkOut)
      .neq("BookingStatus", "CANCELLED")
      .limit(1)
      .maybeSingle();
    if(mine) redirect(`/Payment?booking=${mine.access_token}`);
  }

  // Price comes from the DB, never from the client.
  const { data: room } = await db.from("rooms").select("room_price").eq("room_id", roomId).single();
  if (!room) return back("Room not found.");

  const { data: clash } = await db
    .from("booking")
    .select("room_id")
    .eq("room_id", roomId)
    .lt("in_date", checkOut)
    .gt("out_date", checkIn)
    .neq("BookingStatus", "CANCELLED")
    .limit(1);
  if (clash?.length) return back("Sorry, that room was just booked for those dates.");

  const { data: booking, error } = await db
    .from("booking")
    .insert({
      room_id: roomId,
      in_date: checkIn,
      out_date: checkOut,
      BookingStatus: "PENDING",
      guest_name,
      guest_phone,
      guest_email,
      total_amount: nights * room.room_price,
    })
    .select("access_token")
    .single();
  if (error || !booking) {
    console.error(error?.message);
    return back("Could not create your booking. Please try again.");
  }

  
  jar.set(BOOKING_COOKIE, addToken(jar.get(BOOKING_COOKIE)?.value, booking.access_token), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/Payment");
}

export async function saveReceipt(formData: FormData) {
  // Only a booking whose token is in this browser's cookie can receive a receipt.
  const token = formData.get("token")?.toString() ?? "";
  const owned = parseTokens((await cookies()).get(BOOKING_COOKIE)?.value).includes(token);
  if (!owned) return redirect("/bookings");

  const back = (error: string): never =>
    redirect(`/Payment?${new URLSearchParams({ booking: token, error })}`);

  const file = formData.get("receipt");
  if (!(file instanceof File) || file.size === 0) return back("Please choose your receipt file.");

  const invalid = validateReceipt(file);
  if (invalid) return back(invalid);

  const db = createAdminClient();
  const path = `${token}.${file.type.split("/")[1]}`; // extension from the validated MIME type, not the filename
  const { error } = await db.storage
    .from("receipts")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) {
    console.error(error.message);
    return back("Upload failed. Please try again.");
  }

  await db
    .from("booking")
    .update({ receipt_url: path })
    .eq("access_token", token)
    .eq("BookingStatus", "PENDING");
  redirect(`/Payment?booking=${token}`);
}

export async function setBookingStatus(formData: FormData) {
  if (!(await isAdmin())) return redirect("/");

  const token = formData.get("token")?.toString();
  const status = formData.get("status")?.toString();
  if (!token || (status !== "CONFIRMED" && status !== "CANCELLED" && status !== "PENDING")) return;

  const db = createAdminClient();
  if (status === "PENDING") {
    // A rejected booking released its dates; someone may have taken them since.
    // No self-exclusion needed: this booking is still CANCELLED during the check.
    const { data: booking } = await db
      .from("booking")
      .select("room_id, in_date, out_date")
      .eq("access_token", token)
      .single();
    if (!booking) return;

    const { data: clash } = await db
      .from("booking")
      .select("room_id")
      .eq("room_id", booking.room_id) // same room
      .lt("in_date", booking.out_date) // existing booking starts before this one ends
      .gt("out_date", booking.in_date) // existing booking ends after this one starts
      .neq("BookingStatus", "CANCELLED")
      .limit(1);
    if (clash?.length) {
      return encodedRedirect("error", "/admin/bookings", "The Room was already booked");
    }
  }

  await db.from("booking").update({ BookingStatus: status }).eq("access_token", token);
  revalidatePath("/admin/bookings");
  redirect("/admin/bookings"); // drops any stale ?error= from the URL
}
