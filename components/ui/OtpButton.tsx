"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function OtpButton() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-w-64 max-w-64 mx-auto">
      <Button
        onClick={() => router.push("/otp-login")}
        variant="outline"
      >
        Continue with Phone 📞
      </Button>
    </div>
  );
}
