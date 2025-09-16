import { signUpAction, signInWithGoogle } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { Button } from "@/components/ui/button"; // shadcn/ui button
import GoogleAuthButton from "@/components/ui/GoogleAuthButton";
import OtpButton from "@/components/ui/OtpButton";




export default async function Signup(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>

        <div className="flex flex-col gap-3 [&>input]:mb-3 mt-8">

          <div className="flex gap-3">
            <div className="">
              <Label htmlFor="first_name">First Name</Label>
              <Input name="first_name" placeholder="Peter" required />
            </div>

            <div className="">
              <Label htmlFor="surname">Surame</Label>
              <Input name="surname" placeholder="Parker" required />
            </div>
          </div>

          <div className="">
              <Label htmlFor="dob">Date Of Birth</Label>
              <Input name="dob" required type="date" className="w-full"/>
          </div>

          <div className="">
              <label className="text-sm font-medium">Phone Number</label>
              <Input name="phone_number" required type="tel" className="w-full" placeholder="6012356789"/>
          </div>

          <div className="">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
          </div>

          <div className="">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
            />
          </div>

          {/* <div className="">
            <Label htmlFor="password">Confirm Password</Label>
            <Input
              type="password"
              name="confirm_password"
              placeholder="Your password"
              minLength={6}
              required
            />
          </div> */}

          <div className="w-full pt-3">
            <SubmitButton formAction={signUpAction} pendingText="Signing up..." className="w-full" variant={"outline"}>
              Sign up
            </SubmitButton>
          </div>
          
        </div>
          <div className="pt-4">
            <FormMessage message={searchParams}  />
          </div>
      </form>
          
          <div className="flex flex-col min-w-64 max-w-64 mx-auto">
            {/* 🔹 Divider */}
            <div className="flex items-center gap-2 my-4">
              <hr className="flex-1 border-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <hr className="flex-1 border-border" />
            </div>

            {/* 🔹 Google Sign Up */}
            
            <div className="pb-3">
                <GoogleAuthButton></GoogleAuthButton>
            </div>
            
            <OtpButton></OtpButton>
          </div>
      <SmtpMessage />
    </>
  );
}
