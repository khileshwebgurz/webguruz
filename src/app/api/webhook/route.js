export async function POST(req) {
  try {
    const body = await req.json();

    const myEmail = body?.resource?.custom_id || "No email provided";
    const myUrl = body?.resource?.invoice_id || "No URL Provided";

    // Prepare full response object
    const responseData = {
      message: "Webhook received successfully",
      myEmail,
      myUrl,
    };

    console.log("Extracted Data:", responseData);

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error(" Webhook Error:", error);
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
