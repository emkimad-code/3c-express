const { Resend } = require("resend");

function getRecipients(service) {
  const air = "emkimad@gmail.com";
  const sea = "emkimad@gmail.com";
  const operations = "emkimad@gmail.com";

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
    const resend = new Resend(process.env.resend_api_key);
    const data = JSON.parse(event.body);

    const recipients = getRecipients(data.service);

   const result = await resend.emails.send({
      from: "3C Express <onboarding@resend.dev>",
      to: recipients,
      subject: `New Quote Request | ${data.service} | ${data.request_id}`,
      html: `
<div style="font-family:Arial,sans-serif;background:#f5f7fa;padding:30px;color:#1E293B;">
  <div style="max-width:760px;margin:auto;background:white;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">

    <div style="background:#101664;padding:24px;text-align:center;">
      <img src="https://tranquil-semifreddo-7b47fa.netlify.app/logo.png" width="90" style="margin-bottom:12px;">
      <h1 style="color:white;margin:0;font-size:24px;">New Quote Request</h1>
      <p style="color:#C68A2D;margin:8px 0 0;font-weight:bold;">
        ${data.request_id}
      </p>
    </div>

    <div style="padding:28px;">
      <h2 style="color:#101664;font-size:18px;">Client Information</h2>
      <p>
        <strong>Company:</strong> ${data.company || ""}<br>
        <strong>Contact:</strong> ${data.contact_person || ""}<br>
        <strong>Email:</strong> ${data.email || ""}<br>
        <strong>Phone:</strong> ${data.phone || ""}
      </p>

      <h2 style="color:#101664;font-size:18px;">Shipment Details</h2>
      <p>
        <strong>Service:</strong> ${data.service || ""}<br>
        <strong>Operation:</strong> ${data.operation || ""}<br>
        <strong>Origin:</strong> ${data.origin || ""}<br>
        <strong>Destination:</strong> ${data.destination || ""}<br>
<strong>Pickup Address:</strong> ${data.pickup_address || ""}<br>
<strong>Delivery Address:</strong> ${data.delivery_address || ""}<br>
        <strong>HS Code & Commodity:</strong> ${data.commodity_hscode || ""}<br>
        <strong>Incoterm:</strong> ${data.incoterm || ""}<br>
        <strong>Cargo Value:</strong> ${data.cargo_value || ""}
      </p>

      <h2 style="color:#101664;font-size:18px;">Package 1</h2>
      <p>
        <strong>Type:</strong> ${data.package_1_type || ""}<br>
        <strong>Quantity:</strong> ${data.package_1_quantity || ""}<br>
        <strong>Gross Weight:</strong> ${data.package_1_weight || ""} kg<br>
        <strong>Dimensions:</strong> ${data.package_1_dimensions || ""}
      </p>

      <h2 style="color:#101664;font-size:18px;">Additional Information</h2>
      <p>${data.shipment_details || "No additional information provided."}</p>
    </div>

    <div style="background:#101664;padding:18px;text-align:center;color:white;font-size:13px;">
      3C Express — Air, Sea, Road Freight & Customs Clearance
    </div>

  </div>
</div>
      `
    });

if (data.email) {
  await resend.emails.send({
    from: "3C Express <onboarding@resend.dev>",
    to: [data.email],
    subject: `3C Express - Request Received | ${data.request_id}`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f5f7fa;padding:30px;color:#1E293B;">
        <div style="max-width:680px;margin:auto;background:white;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">

          <div style="background:#101664;padding:24px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:24px;">
              Request Received
            </h1>

            <p style="color:#C68A2D;margin:8px 0 0;font-weight:bold;">
              ${data.request_id}
            </p>
          </div>

          <div style="padding:28px;">
            <p>Dear ${data.contact_person || "Customer"},</p>

            <p>
              Thank you for contacting 3C Express. Your quote request has been successfully received.
            </p>

            <p>
              Please keep the following reference number for any future communication:
            </p>

            <p style="font-size:22px;font-weight:bold;color:#101664;">
              ${data.request_id}
            </p>

            <p>
              Our team will review your request and get back to you shortly.
            </p>

            <p>
              Best regards,<br>
              3C Express Team
            </p>
          </div>

          <div style="background:#101664;padding:18px;text-align:center;color:white;font-size:13px;">
            3C Express — Air, Sea, Road Freight & Customs Clearance
          </div>

        </div>
      </div>
    `
  });
}

console.log("RESEND RESULT:", result);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

} catch (error) {
  console.error("SEND QUOTE ERROR:", error);

  return {
    statusCode: 500,
    body: JSON.stringify({
      error: error.message,
      details: error
    })
  };
}
};