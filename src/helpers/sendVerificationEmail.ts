import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, otp: string): Promise<ApiResponse> {
  try {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Mystery message | Verification Code',
        react: VerificationEmail({username, otp}),
      });
    return { success: true, message: "Verification email sent" };
  } catch (error) {
    return { success: false, message: "Failed to send verification email" };
  }

}


