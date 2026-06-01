const { Resend } = require("resend");

function getRecipients(service) {
  const air = "emkimad@gmail.com";
  const sea = "emkimad@gmail.comr";
  const operations = "lydiabess932@gmail;com";

  if (service === "Air Freight") {
    return [air, operations];
  }

  if (service === "Sea Freight") {
    return [sea, operations];
  }

  if (service === "Air Freight & Sea Freight") {
    return [air, sea, operations];
  }

  if (service === "Road Freight") {
    return [air, operations];
  }

  if (service === "Customs Clearance") {
    return [operations];
  }

  if (service === "Warehousing & Storage") {
    return [operations];
  }

  return [operations];
}

exports.handler = async (event) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = JSON.parse(event.body);

    const recipients = getRecipients(data.service);

    await resend.emails.send({
      from: "3C Express <onboarding@resend.dev>",
      to: recipients,
      subject: `New Quote Request | ${data.service} | ${data.request_id}`,
      html: `
        <div style="font-family: Arial, sans-serif; color:#1E293B; line-height:1.6;">
          <h2 style="color:#101664;">New Quote Request</h2>

          <p>
            <strong>Reference:</strong> ${data.request_id}
          </p>

          <hr>

          <h3>Client Information</h3>
          <p>
            <strong>Company:</strong> ${data.company || ""}<br>
            <strong>Contact:</strong> ${data.contact_person || ""}<br>
            <strong>Email:</strong> ${data.email || ""}<br>
            <strong>Phone:</strong> ${data.phone || ""}
          </p>

          <h3>Shipment Details</h3>
          <p>
            <strong>Service:</strong> ${data.service || ""}<br>
            <strong>Operation:</strong> ${data.operation || ""}<br>
            <strong>Origin:</strong> ${data.origin || ""}<br>
            <strong>Destination:</strong> ${data.destination || ""}<br>
            <strong>HS Code & Commodity:</strong> ${data.commodity_hscode || ""}<br>
            <strong>Incoterm:</strong> ${data.incoterm || ""}<br>
            <strong>Cargo Value:</strong> ${data.cargo_value || ""}
          </p>

          <h3>Package 1</h3>
          <p>
            <strong>Type:</strong> ${data.package_1_type || ""}<br>
            <strong>Quantity:</strong> ${data.package_1_quantity || ""}<br>
            <strong>Gross Weight:</strong> ${data.package_1_weight || ""} kg<br>
            <strong>Dimensions:</strong> ${data.package_1_dimensions || ""}
          </p>

          <h3>Additional Information</h3>
          <p>
            ${data.shipment_details || "No additional information provided."}
          </p>
        </div>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};