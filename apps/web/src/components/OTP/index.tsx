import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function OTP() {
  const [value, setValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();

  const handleVerify = async (code: string) => {
    if (code.length !== 8 || isVerifying) return;
    setIsVerifying(true);
    try {
      const response = await verifyOtp(code);
      if (response) navigate({ to: "/dashboard" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
        toast.error("Error verifying OTP: " + error.message);
      } else {
        console.error(String(error));
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    void handleVerify(nextValue);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Enter OTP</CardTitle>
        <CardDescription>Please enter the OTP code sent to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <InputOTP maxLength={8} value={value} onChange={(e: any) => handleChange(e)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
            <InputOTPSlot index={6} />
            <InputOTPSlot index={7} />
          </InputOTPGroup>
        </InputOTP>
      </CardContent>
      <CardFooter className="bg-background">
        <Button onClick={() => handleVerify(value)} disabled={value.length !== 8 || isVerifying}>
          {isVerifying && <Spinner className="mr-2" aria-hidden="true" />}
          {isVerifying ? "Verifying" : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  );
}
