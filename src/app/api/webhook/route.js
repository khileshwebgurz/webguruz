export async function POST(req) {
  try {
    const body = await req.json();

    const myEmail = body?.resource?.custom_id || "No email provided";
    const myUrl = body?.resource?.invoice_id || "No URL Provided";
    const firstName = body?.resource?.payer?.name?.given_name || "No first name";
    const lastName = body?.resource?.payer?.name?.surname || "No last name";
    let status = "Unsuccessful";

    if(body?.resource?.status === "COMPLETED") status = "Successful";

    // Prepare full response object
    const responseData = {
      message: "Webhook received successfully",
      myEmail,
      myUrl,
    };
    console.log("my extracted data is >>>", body);
    console.log('firstname and lastname is >>>>',firstName , lastName)
    console.log('my some data is >>>',body?.resource?.payer);
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
