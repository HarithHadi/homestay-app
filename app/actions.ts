"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


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
    .from("Profiles")
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
    .from("Profiles")
    .update({
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
  .from("Booking")
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
