import { NextRequest, NextResponse } from "next/server";
import { db } from "../../utils/db";

import { eq } from "drizzle-orm";
import crypto from "crypto";
import { Users } from "../../utils/schema";

// Keep the signature validation function unchanged
function validateITNSignature(
  data: Record<string, string | undefined>,
  receivedSignature: string
): boolean {
  const { signature, ...dataWithoutSignature } = data;
  const notifyKeys = [
    "m_payment_id",
    "pf_payment_id",
    "payment_status",
    "item_name",
    "item_description",
    "amount_gross",
    "amount_fee",
    "amount_net",
    "custom_str1",
    "custom_str2",
    "custom_str3",
    "custom_str4",
    "custom_str5",
    "custom_int1",
    "custom_int2",
    "custom_int3",
    "custom_int4",
    "custom_int5",
    "name_first",
    "name_last",
    "email_address",
    "merchant_id",
  ];

  const pfParamString = notifyKeys
    .map((key) => {
      const value = dataWithoutSignature[key];
      if (value !== undefined) {
        return `${key}=${encodeURIComponent(String(value)).replace(
          /%20/g,
          "+"
        )}`;
      }
      return null;
    })
    .filter((item) => item !== null)
    .join("&");

  const passPhrase = process.env.PAYFAST_SALT_PASSPHRASE;
  const finalString = passPhrase
    ? `${pfParamString}&passphrase=${encodeURIComponent(passPhrase)}`
    : pfParamString;

  const calculatedSignature = crypto
    .createHash("md5")
    .update(finalString)
    .digest("hex");

  return calculatedSignature === receivedSignature;
}

export async function POST(req: NextRequest) {
  console.log("🔵 PayFast Webhook Triggered");

  try {
    // Parse the raw body
    const rawBodyStr = await req.text();
    console.log("📥 Raw webhook payload:", rawBodyStr);

    // Parse the form data
    const pfData = Object.fromEntries(new URLSearchParams(rawBodyStr));
    console.log("🔍 Parsed PayFast data:", pfData);

    // Validate the signature
    const isValidSignature = validateITNSignature(pfData, pfData.signature);
    console.log("✅ Signature validation result:", isValidSignature);

    if (!isValidSignature) {
      console.error("❌ Invalid signature received");
      return NextResponse.json({ error: "Invalid signature" });
    }

    // Verify payment status
    console.log("💰 Payment status:", pfData.payment_status);
    if (pfData.payment_status !== "COMPLETE") {
      console.log(`⚠️ Payment not complete: ${pfData.payment_status}`);
      return NextResponse.json({ message: "Payment not complete" });
    }

    // Extract and validate user data
    const userEmail = pfData.custom_str1;
    const creditsToAdd = parseInt(pfData.custom_int1);

    console.log("👤 Processing update for:", {
      userEmail,
      creditsToAdd,
      paymentId: pfData.pf_payment_id,
    });

    if (!userEmail || isNaN(creditsToAdd)) {
      console.error("❌ Invalid data received:", { userEmail, creditsToAdd });
      return NextResponse.json({ error: "Invalid data" });
    }

    // Fetch current user data
    console.log("🔍 Fetching user data for:", userEmail);
    const users = await db
      .select()
      .from(Users)
      .where(eq(Users.email, userEmail));

    if (users.length === 0) {
      console.error("❌ User not found in database:", userEmail);
      return NextResponse.json({ error: "User not found" });
    }

    const user = users[0];
    const currentCredits = user.credits ?? 0;
    const newCreditsAmount = currentCredits + creditsToAdd;

    // Update user credits
    console.log("📝 Updating user credits in database...");
    const updateResult = await db
      .update(Users)
      .set({
        credits: newCreditsAmount,
      })
      .where(eq(Users.email, userEmail))
      .returning({
        updatedId: Users.id,
        newCredits: Users.credits,
      });

    console.log("✅ Database update completed:", updateResult);

    return NextResponse.json({
      message: "Credits updated successfully",
      data: {
        userEmail,
        creditsAdded: creditsToAdd,
        newTotal: newCreditsAmount,
        paymentId: pfData.pf_payment_id,
      },
    });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
