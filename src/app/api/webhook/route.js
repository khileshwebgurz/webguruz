import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  
  console.log("🔔 PayPal Webhook Event Received:", body);

  if (body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    console.log("✅ Payment successful! Transaction ID:", body.resource.id);
    // Update your database to mark payment as completed
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
