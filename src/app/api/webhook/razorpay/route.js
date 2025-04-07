

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('my razorpay webhook data is >>>>', body);
    let message = 'Webhook of razorpay sent data.'
  
    return new Response(JSON.stringify({ message: message }), {
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
