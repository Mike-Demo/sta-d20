import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

interface HCaptchaSiteverifyResponse {
  success: boolean;
  "error-codes"?: string[];
  hostname?: string;
}

export const verifyCaptcha = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ token: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const secret = process.env["HCAPTCHA_SECRET"];
    if (!secret) {
      // Not configured: report unavailable so the client fails open instead of
      // locking every visitor out of the app.
      return { success: false as const, unavailable: true as const };
    }

    const body = new URLSearchParams({
      secret,
      response: data.token,
    });

    try {
      const res = await fetch("https://api.hcaptcha.com/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!res.ok) {
        return { success: false as const, unavailable: true as const };
      }

      const payload = (await res.json()) as HCaptchaSiteverifyResponse;
      return { success: payload.success === true, unavailable: false as const };
    } catch {
      return { success: false as const, unavailable: true as const };
    }
  });

