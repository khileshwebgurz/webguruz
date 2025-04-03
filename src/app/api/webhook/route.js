import axios from "axios";
import { createHubSpotContact, updateContact } from "../../../../lib/hubspotContact";
const HUBSPOT_API_KEY = process.env.HUBSPOT_KEY;
export async function POST(req) {
  try {
    const body = await req.json();

    const myEmail = body?.resource?.custom_id || "No email provided";
    const myUrl = body?.resource?.invoice_id || "No URL Provided";
    const firstName = body?.resource?.seller_protection?.firstName;
    const lastName = body?.resource?.seller_protection?.lastName;
    const status = "Unsuccessful";

    if(body?.resource?.status === "COMPLETED") status = "Successful";

    // Prepare full response object
    const responseData = {
      message: "Webhook received successfully",
      myEmail,
      myUrl,
    };
    console.log("my extracted data is >>>", body);
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
