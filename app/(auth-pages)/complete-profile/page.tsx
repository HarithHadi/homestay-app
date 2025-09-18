import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage, Message } from "@/components/form-message";
import Link from "next/link";
import { completeProfile } from "@/app/actions";

export default async function Complete({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}){

    const { phone } = await searchParams;
    return (
    <>
      <form className="flex flex-col min-w-64 max-w-70 mx-auto">
        <h1 className="text-2xl font-medium">Complete Your Profile !</h1>
        <p className="text-sm text text-foreground">
          These details are important for us to serve you ! 
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
              {phone ? 
                (<Input name="phone_number" required type="tel" className="border border-gray-300 p-2 rounded-md focus:outline-none read-only:bg-gray-100 read-only:text-gray-700" placeholder={phone} value={phone} readOnly/>) 
              : (<Input name="phone_number" required type="tel" className="w-full" placeholder="6012356789"/>)
              }
              
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
            <SubmitButton formAction={completeProfile} pendingText="Confirming" className="w-full" variant={"outline"}>
              Confirm
            </SubmitButton>
          </div>
          
        </div>
          
      </form>
          
          
      
    </>
  );
}