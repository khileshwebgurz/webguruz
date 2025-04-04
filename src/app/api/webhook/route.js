import axios from "axios";
const HUBSPOT_API_KEY = process.env.HUBSPOT_KEY;
const PAYPAL_ACCESS_TOKEN = process.env.PAYPAL_ACCESS_TOKEN;
import { getPayPalAccessToken } from "../../../../lib/paypal";
import {
  updateContact,
  createHubSpotContact,
} from "../../../../lib/hubspotContact";

export async function POST(req) {
  
  try {

    const body = await req.json();
    const customData = body?.resource?.custom_id || "{}"; 
    // console.log('my custom data is >>>',customData);

    const { email: myEmail, url: url } = JSON.parse(customData); // Parse JSON
    // console.log('my email and url is >>>' ,myEmail, url)

    // const firstName = body?.resource?.payer?.name?.given_name || "No first name";
    // const lastName = body?.resource?.payer?.name?.surname || "No last name";

    let status = "Unsuccessful";
    if (body?.resource?.status === "COMPLETED") status = "Successful";


    // Extract PayPal capture ID
    const captureId = body?.resource?.id;

    // Step 1: Fetch payer details using PayPal API
    let firstName = "No first name";
    let lastName = "No last name";

    const accessToken = await getPayPalAccessToken();
    console.log('my payer>>>>' ,  body)
    console.log('fname', firstName, lastName);
    console.log('resoruce dara is >>>',body?.resource);
    console.log('my capture id is >>>',captureId);

     try {
          const payerResponse = await axios.get(
            `https://api-m.sandbox.paypal.com/v2/payments/captures/${captureId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
    
          const payerInfo = payerResponse?.data?.payer?.name;
          console.log('pyaerrespnse>>>>',payerResponse);
          console.log('more data >>>',payerResponse?.data);
          console.log('another more>>>',payerResponse?.data?.payer)
          if (payerInfo) {
            firstName = payerInfo.given_name || "No first name";
            lastName = payerInfo.surname || "No last name";
          }
    
          console.log("Fetched Payer Details:", firstName, lastName);
        } catch (payerError) {
          console.error("Error fetching payer details:", payerError.response?.data);
        }


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

    // const response = await axios.post(
    //   "https://api.hubapi.com/crm/v3/objects/contacts/search",
    //   requestBody,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // console.log("my response data is >>>>", response.data);

    let message = "";

    // if (response.data.results.length > 0) {
    //   await updateContact(response.data.results[0].id, HUBSPOT_API_KEY);
    //   message = "Contact Updated";
    // } else {
    //   console.log('my email for hubspot  is >>>>>', myEmail , 'my url is >>', url)
    //   await createHubSpotContact(
    //     myEmail,
    //     firstName,
    //     lastName,
    //     status,
    //     url,
    //     HUBSPOT_API_KEY
    //   );
    //   message = "Contact Created";
    // }
    // Prepare full response object
    // const responseData = {
    //   message: "Webhook received successfully",
    //   myEmail,
    //   url,
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
