import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage, Message } from "@/components/form-message";
import Link from "next/link";
import { signUpwithPhone } from "@/app/actions";

export default async function OtpLogin (){

    return(
        <>
        <form className="flex flex-col min-w-64 max-w-70 mx-auto">
        <h1 className="text-2xl font-medium">OTP Sign in</h1>
        <p className="text-sm text text-foreground">
          Please enter your Phone number below
        </p>
        

        <div className="flex flex-col gap-3 [&>input]:mb-3 mt-8">

          <div className="">
              <label className="text-sm font-medium">Phone Number</label>
              <Input name="phone_number" required type="tel" className="w-full" placeholder="+6012356789"/>
          </div>

          <div className="w-full pt-3">
            <SubmitButton formAction={signUpwithPhone} pendingText="Confirming" className="w-full" variant={"outline"}>
              Confirm
            </SubmitButton>
          </div>
          
        </div>
          
      </form>
        </>
    )
}