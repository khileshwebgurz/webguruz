export async function POST(req) {
  try {
    const body = await req.json();

    const myUrl = body?.resource?.custom || "No URL provided";

    // Prepare full response object
    const responseData = {
      message: "Webhook received successfully",

      myUrl,
    };

    console.log("📝 Extracted Data:", JSON.stringify(responseData, null, 2));

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return new Response(
      JSON.stringify({ message: "Error processing webhook" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
