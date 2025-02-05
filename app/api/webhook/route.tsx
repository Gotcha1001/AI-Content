import { NextRequest, NextResponse } from "next/server";
import { db } from "../../utils/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { Users } from "../../utils/schema";

class PayFastWebhook {
  // Signature validation method
  private static validateITNSignature(
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

  // Main webhook processing method
  static async processWebhook(req: NextRequest) {
    try {
      // Log webhook received timestamp
      process.stdout.write(
        `[${new Date().toISOString()}] PayFast Webhook Received\n`
      );

      // Capture and log request headers
      const headers = Object.fromEntries(req.headers);
      process.stdout.write(`Headers: ${JSON.stringify(headers)}\n`);

      // Parse the raw body
      const rawBodyStr = await req.text();
      process.stdout.write(`Raw Payload: ${rawBodyStr}\n`);

      // Parse the form data
      const pfData = Object.fromEntries(new URLSearchParams(rawBodyStr));
      process.stdout.write(`Parsed Data: ${JSON.stringify(pfData)}\n`);

      // Validate the signature
      const isValidSignature = this.validateITNSignature(
        pfData,
        pfData.signature
      );
      process.stdout.write(`Signature Valid: ${isValidSignature}\n`);

      // Check signature validity
      if (!isValidSignature) {
        process.stdout.write("Invalid signature received\n");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 }
        );
      }

      // Verify payment status
      if (pfData.payment_status !== "COMPLETE") {
        process.stdout.write(
          `Payment not complete: ${pfData.payment_status}\n`
        );
        return NextResponse.json(
          { message: "Payment not complete" },
          { status: 400 }
        );
      }

      // Extract and validate user data
      const userEmail = pfData.custom_str1;
      const creditsToAdd = parseInt(pfData.custom_int1);

      // Validate user email and credits
      if (!userEmail || isNaN(creditsToAdd)) {
        process.stdout.write(
          `Invalid data received: ${JSON.stringify({
            userEmail,
            creditsToAdd,
          })}\n`
        );
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
      }

      // Fetch user from database
      const users = await db
        .select()
        .from(Users)
        .where(eq(Users.email, userEmail));

      // Check if user exists
      if (users.length === 0) {
        process.stdout.write(`User not found: ${userEmail}\n`);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Calculate new credits
      const user = users[0];
      const currentCredits = user.credits ?? 0;
      const newCreditsAmount = currentCredits + creditsToAdd;

      // Update user credits
      const updateResult = await db
        .update(Users)
        .set({ credits: newCreditsAmount })
        .where(eq(Users.email, userEmail))
        .returning({
          updatedId: Users.id,
          newCredits: Users.credits,
        });

      // Log update result
      process.stdout.write(
        `Credits Updated: ${JSON.stringify(updateResult)}\n`
      );

      // Return success response
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
      // Log any errors that occur
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      process.stdout.write(`Webhook Error: ${errorMessage}\n`);

      // Return internal server error
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

// Export the POST method
export async function POST(req: NextRequest) {
  return PayFastWebhook.processWebhook(req);
}
