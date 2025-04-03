import axios from "axios";
const HUBSPOT_API_KEY = process.env.HUBSPOT_KEY;
import {
  updateContact,
  createHubSpotContact,
} from "../../../../lib/hubspotContact";

export async function POST(req) {
  try {
    const body = await req.json();

    const myEmail = body?.resource?.invoice_id || "No email provided";
    const myUrl = body?.resource?.custom_id || "No URL Provided";
    const firstName =
      body?.resource?.payer?.name?.given_name || "No first name";
    const lastName = body?.resource?.payer?.name?.surname || "No last name";
    let status = "Unsuccessful";

    if (body?.resource?.status === "COMPLETED") status = "Successful";

    const requestBody = {
      limit: 10,
      after: null,
      properties: [
        "firstname",
        "lastname",
        "email",
        "paypal_payment_status",
        "website",
      ],
      filterGroups: [
        {
          filters: [{ propertyName: "email", value: myEmail, operator: "EQ" }],
        },
      ],
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
    );

    console.log("my response data is >>>>", response.data);

    let message = "";

    if (response.data.results.length > 0) {
      await updateContact(response.data.results[0].id, HUBSPOT_API_KEY);
      message = "Contact Updated";
    } else {
      console.log('my email for hubspot  is >>>>>', myEmail , 'my url is >>', myUrl)
      await createHubSpotContact(
        myEmail,
        firstName,
        lastName,
        status,
        myUrl,
        HUBSPOT_API_KEY
      );
      message = "Contact Created";
    }
    // Prepare full response object
    // const responseData = {
    //   message: "Webhook received successfully",
    //   myEmail,
    //   myUrl,
    // };

    // console.log("Extracted Data:", responseData);

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
