
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { verifyOTP } from "@/app/actions";

export default async function OtpPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone } = await searchParams;

  return (
    <form className="flex flex-col min-w-64 max-w-70 mx-auto">
      <h1 className="text-2xl font-medium">OTP Sign in</h1>
      <p className="text-sm text-foreground">
        Please enter the OTP sent to <b>{phone}</b>
      </p>

      <div className="flex flex-col gap-3 mt-8">
        <div>
          <label className="text-sm font-medium">OTP</label>
          {/* ✅ name must be "token" for Supabase */}
          <Input
            name="token"
            required
            type="tel"
            className="w-full"
            placeholder="Enter OTP"
          />
          {/* ✅ pass phone along with form */}
          <input type="hidden" name="phone" value={phone} />
        </div>

        <div className="w-full pt-3">
          <SubmitButton
            formAction={verifyOTP}
            pendingText="Confirming..."
            className="w-full"
            variant="outline"
          >
            Confirm
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
