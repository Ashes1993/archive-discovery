"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData) {
  const passcode = formData.get("passcode");
  const correctPasscode = process.env.ADMIN_PASSCODE;

  if (!correctPasscode) {
    return { error: "Server error: Passcode not configured." };
  }

  if (passcode === correctPasscode) {
    // Await the cookies instance for Next.js 15+ compatibility
    const cookieStore = await cookies();

    // Set a secure, HTTP-only cookie that lasts for 7 days
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
  } else {
    return { error: "Access Denied. Incorrect Passcode." };
  }

  // Redirect must happen outside the try/catch or conditional block in server actions
  redirect("/admin");
}
