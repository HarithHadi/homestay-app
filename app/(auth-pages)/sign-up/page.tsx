import { signUpAction, signInWithGoogle } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { Button } from "@/components/ui/button"; // shadcn/ui button

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

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />

          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />

          
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
            <form action={signInWithGoogle}>
              <Button variant="outline" type="submit" className="w-full">
                Continue with Google
              </Button>
            </form>
          </div>
      <SmtpMessage />
    </>
  );
}
