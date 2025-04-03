export async function POST(req) {
  try {
    const body = await req.json();
    console.log("🔔 Full PayPal Webhook Data:", JSON.stringify(body, null, 2));

    // Extract all nested objects properly
    const transactionId = body?.resource?.id || "N/A";
    const amount = body?.resource?.amount?.value || "0.00";
    const currency = body?.resource?.amount?.currency_code || "USD";
    const status = body?.resource?.status || "UNKNOWN";
    const payerEmail = body?.resource?.payer?.email_address || "No payer email";
    const sellerEmail = body?.resource?.payee?.email_address || "No seller email";

    // Extracting custom ID and invoice ID (if sent in create-order API)
    const myEmail = body?.resource?.invoice_id || "No email provided";
    const myUrl = body?.resource?.custom_id || "No URL provided";

    // Extract additional breakdown details
    const sellerProtection = body?.resource?.seller_protection?.status || "UNKNOWN";
    const grossAmount = body?.resource?.seller_receivable_breakdown?.gross_amount?.value || "N/A";
    const paypalFee = body?.resource?.seller_receivable_breakdown?.paypal_fee?.value || "N/A";
    const netAmount = body?.resource?.seller_receivable_breakdown?.net_amount?.value || "N/A";

    // Extract links properly
    const links = body?.resource?.links?.map(link => ({
      rel: link.rel,
      href: link.href,
      method: link.method
    })) || [];

    // Extract supplementary data (related transaction IDs)
    const relatedIds = body?.resource?.supplementary_data?.related_ids || [];

    // Prepare full response object
    const responseData = {
      message: "Webhook received successfully",
      transactionId,
      amount,
      currency,
      status,
      payerEmail,
      sellerEmail,
      myEmail,  
      myUrl,    
      sellerProtection,
      grossAmount,
      paypalFee,
      netAmount,
      relatedIds,
      links,
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
    return new Response(JSON.stringify({ message: "Error processing webhook" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
