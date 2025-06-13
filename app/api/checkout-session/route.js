// app/api/checkout-session/route.js
import { NextResponse } from "next/server";

let razorpay = null;

if (process.env.NODE_ENV !== "production") {
  const { default: Razorpay } = await import("razorpay");

  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
}

export async function POST(req) {
  if (!razorpay) {
    return NextResponse.json(
      { error: "Razorpay not available in production" },
      { status: 500 }
    );
  }

  try {
    const amount = 499 * 100;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: "receipt#1",
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay error:", error);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}
