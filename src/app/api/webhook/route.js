export async function POST(req) {
  try {

    const body = await req.json();
    console.log("PayPal Webhook Received:", body);

    return new Response(JSON.stringify({ message: "Webhook received" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response(JSON.stringify({ message: "Error processing webhook" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
