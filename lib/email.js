// lib/email.js → FREE EMAIL SENDING WITH RESEND

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(to, token) {
  try {
    await resend.emails.send({
      from: "Food Empire <no-reply@yourdomain.com>",
      to,
      subject: "Reset Your Password - Food Empire",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
          <h2>Reset Your Password</h2>
          <p>Click the button below to reset your password:</p>
          <a href="$$ {process.env.NEXTAUTH_URL}/auth/new-password?token= $${token}"
             style="background: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: bold;">
            Reset Password
          </a>
          <p>Link expires in 1 hour.</p>
          <p>If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Failed to send email");
  }
}