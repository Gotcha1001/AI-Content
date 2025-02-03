import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../utils/db";
import { Users } from "../../utils/schema";

export async function POST(req) {
  try {
    console.log("POST request received");

    const requestBody = await req.json();
    console.log("Raw request body:", requestBody);

    const { user } = requestBody;
    if (!user) {
      console.error("No user object received in request");
      return NextResponse.json(
        { error: "User data is missing" },
        { status: 400 }
      );
    }

    console.log("Extracted user object:", user);

    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      console.error("User email is missing");
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    console.log("Checking if user already exists with email:", userEmail);
    const userInfo = await db
      .select()
      .from(Users)
      .where(eq(Users.email, userEmail));
    console.log("Existing user query result:", userInfo);

    if (userInfo.length === 0) {
      console.log("User not found. Inserting new user into database.");
      const SaveResult = await db
        .insert(Users)
        .values({
          name: user?.fullName || "Unknown User",
          email: userEmail,
          imageUrl: user?.imageUrl || "/default-avatar.png",
          credits: 10,
        })
        .returning();

      console.log("New user created successfully:", SaveResult);
      return NextResponse.json({ result: SaveResult[0] });
    }

    console.log("User already exists, returning existing user data.");
    return NextResponse.json({ result: userInfo[0] });
  } catch (error) {
    console.error("Full user creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : JSON.stringify(error) },
      { status: 500 }
    );
  }
}
