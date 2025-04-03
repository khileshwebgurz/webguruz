// lib/fetchData.js
import axios from "axios";
export async function updateContact(contactId, accessToken) {
  try {
    const properties = { paypal_payment_status: "Successful" };

    const response = await axios.patch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      { properties },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response.data);
  } catch (error) {}
}

export async function createHubSpotContact(
  email,
  firstName,
  lastName,
  paypalStatus,
  website,
  accessToken
) {
  try {
    const requestBody = {
      properties: {
        email: email,
        firstname: firstName || "",
        lastname: lastName || "",
        paypal_payment_status: paypalStatus || "Unsuccessful",
        website: website || "",
      },
    };

    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Contact Created Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error Creating HubSpot Contact:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create contact"
    );
  }
}
