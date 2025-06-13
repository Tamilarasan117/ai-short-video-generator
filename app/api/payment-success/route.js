import { db } from "@/configs/db";
import { Users } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const { plan, email } = await req.json();

  let creditsToAdd = 0;

  if (plan === 'basic') {
    creditsToAdd = 999;
  } else if (plan === 'premium') {
    creditsToAdd = 99999;
  } else {
    return new Response(JSON.stringify({ message: "Invalid plan" }), { status: 400 });
  }

  try {
    await db.update(Users)
      .set({
        credits: db.raw(`credits + ${creditsToAdd}`),
        subscription: true,
      })
      .where(eq(Users.email, email));

    return new Response(JSON.stringify({ message: "User updated successfully" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Something went wrong" }), { status: 500 });
  }
}
