import axios from "axios";
const HUBSPOT_API_KEY = process.env.HUBSPOT_KEY;
import { updateContact, createHubSpotContact } from "../../../../lib/hubspotContact";

export async function POST(req, res) {
  try {
    let data = await req.json();
    let email = data.payer.email;
    let firstName = data.payer.firstname;
    let lastName = data.payer.lastName || "";
    let website = data.payer.website || "";
    let status = "Unsuccessful";

    if (data.status === "COMPLETED") status = "Successful";

    const requestBody = {
      limit: 10,
      after: null,
      properties: ["firstname", "lastname", "email", "paypal_payment_status", "website"],
      filterGroups: [{ filters: [{ propertyName: "email", value: email, operator: "EQ" }] }]
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

    console.log(response.data);
    let message = "";

    if (response.data.results.length > 0) {
      await updateContact(response.data.results[0].id, HUBSPOT_API_KEY);
      message = "Contact Updated";
    } else {
      await createHubSpotContact(email, firstName, lastName, status, website, HUBSPOT_API_KEY);
      message = "Contact Created";
    }

    return new Response(JSON.stringify({ message: message }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response(
      JSON.stringify({ message: "Error processing webhook", error: error.message }),
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
