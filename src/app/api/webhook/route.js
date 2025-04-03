import axios from "axios";
import { createHubSpotContact, updateContact } from "../../../../lib/hubspotContact";
const HUBSPOT_API_KEY = process.env.HUBSPOT_KEY;
export async function POST(req) {
  try {
    const body = await req.json();

    console.log("🔔 Full PayPal Webhook Data:", JSON.stringify(body, null, 2));

    const myEmail = body?.resource?.custom_id || "No email provided";
    const myUrl = body?.resource?.invoice_id || "No URL Provided";
    const firstName = body?.resource?.seller_protection?.firstName;
    const lastName = body?.resource?.seller_protection?.lastName;
    let status = "Unsuccessful";

    const sellerProtection = body?.resource?.seller_protection?.status || "UNKNOWN";
    const grossAmount = body?.resource?.seller_receivable_breakdown?.gross_amount?.value || "N/A";
    const paypalFee = body?.resource?.seller_receivable_breakdown?.paypal_fee?.value || "N/A";
    const netAmount = body?.resource?.seller_receivable_breakdown?.net_amount?.value || "N/A";


    const relatedIds = body?.resource?.supplementary_data?.related_ids || [];


    if(body?.resource?.status === "COMPLETED") status = "Successful";

    // Prepare full response object
    const responseData = {
      message: "Webhook received successfully",
      myEmail,
      myUrl,
      sellerProtection,
      grossAmount,
      paypalFee,
      netAmount,
      relatedIds
    };

    console.log("Extracted Data:", responseData);


    const requestBody = {
      limit: 10,
      after: null,
      properties: ["firstname", "lastname", "email", "paypal_payment_status", "website"],
      filterGroups: [{ filters: [{ propertyName: "email", value: myEmail, operator: "EQ" }] }]
    };

    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts/search",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    let message = "";
    if(response.data.results.length > 0){
      await updateContact(response.data.results[0].id, HUBSPOT_API_KEY);
      message= "Contact Updated";
    }
    else{
      await createHubSpotContact(myEmail,firstName, lastName,status,myUrl, HUBSPOT_API_KEY);
      message = "Contact Created";
    }


    return new Response(JSON.stringify({message: message}), {
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
