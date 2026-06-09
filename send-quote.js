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
const language = data.language || "en";

const sheetResponse = await fetch("https://script.google.com/macros/s/AKfycbzt4Sj03Erc5HwOzTG0srZ2Pkib8LnjdWPR8n5jLKyr6ZyMG_ASxtXVgTDuXBKHyr7ncw/exec", {
  method: "POST",
  headers: {
    "Content-Type": "text/plain"
  },
body: JSON.stringify({
  reference: data.request_id,
  company: data.company,
  email: data.email,
  service: data.service,
  operation: data.operation
})
});

const sheetText = await sheetResponse.text();
console.log("GOOGLE SHEET RESULT:", sheetText);
const packages = [];

Object.keys(data).forEach((key) => {
  const match = key.match(/^package_(\d+)_type$/);

  if (match) {
    const number = match[1];

    packages.push({
      number,
      type: data[`package_${number}_type`] || "",
      quantity: data[`package_${number}_quantity`] || "",
      weight: data[`package_${number}_weight`] || "",
      dimensions: data[`package_${number}_dimensions`] || ""
    });
  }
});

const packagesHtml = packages.map((pkg) => `
  <h3>Package ${pkg.number}</h3>
  <p>
    <strong>Type:</strong> ${pkg.type}<br>
    <strong>Quantity:</strong> ${pkg.quantity}<br>
    <strong>Gross Weight:</strong> ${pkg.weight} kg<br>
    <strong>Dimensions:</strong> ${pkg.dimensions}
  </p>
`).join("");

    const recipients = getRecipients(data.service);
console.log("ATTACHMENTS:", data.attachments);
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

     <h3>Package Details</h3>
${packagesHtml}

${data.attachments && data.attachments.length > 0 ? `
  <h2 style="color:#101664;font-size:18px;">Supporting Documents</h2>

  <ul style="padding-left:18px;">
    ${data.attachments.map(file => `
      <li>📎 ${file.filename}</li>
    `).join("")}
  </ul>
` : ""}

      <h2 style="color:#101664;font-size:18px;">Additional Information</h2>
      <p>${data.shipment_details || "No additional information provided."}</p>
    </div>

    <div style="background:#101664;padding:18px;text-align:center;color:white;font-size:13px;">
      3C Express — Air, Sea, Road Freight & Customs Clearance
    </div>

  </div>
</div>
      `
,
attachments: (data.attachments || []).map((file) => ({
  filename: file.filename,
  content: file.content
}))
    });

if (data.email) {
  const isFrench = language === "fr";

  const clientSubject = isFrench
    ? `3C Express - Demande reçue | ${data.request_id}`
    : `3C Express - Request Received | ${data.request_id}`;

  const clientGreeting = isFrench
    ? `Bonjour ${data.contact_person || ""},`
    : `Dear ${data.contact_person || "Customer"},`;

  const trackingLink = isFrench
    ? "https://3cexpress.fr/track-shipment-fr.html"
    : "https://3cexpress.fr/track-shipment.html";

  const buttonText = isFrench
    ? "Suivre votre demande"
    : "Track Your Request";

  await resend.emails.send({
    from: "3C Express <onboarding@resend.dev>",
    to: [data.email],
    subject: clientSubject,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f5f7fa;padding:30px;color:#1E293B;">
        <div style="max-width:680px;margin:auto;background:white;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">

          <div style="background:#101664;padding:24px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:24px;">
              ${isFrench ? "Demande reçue" : "Request Received"}
            </h1>

            <p style="color:#C68A2D;margin:8px 0 0;font-weight:bold;">
              ${data.request_id}
            </p>
          </div>

          <div style="padding:28px;">
            <p>${clientGreeting}</p>

            <p>
              ${isFrench
                ? "Nous vous remercions pour votre demande. Votre demande de cotation a bien été reçue par 3C Express."
                : "Thank you for contacting 3C Express. Your quote request has been successfully received."
              }
            </p>

            <p>
              ${isFrench
                ? "Veuillez conserver le numéro de référence suivant pour toute communication future :"
                : "Please keep the following reference number for any future communication:"
              }
            </p>

            <p style="font-size:22px;font-weight:bold;color:#101664;">
              ${data.request_id}
            </p>

            <p>
              ${isFrench
                ? "Vous pouvez suivre l'avancement de votre demande, expédition ou dossier douanier à tout moment via notre portail de suivi."
                : "You can follow the progress of your quotation request, shipment or customs process at any time using our tracking portal."
              }
            </p>

            <div style="text-align:center;margin:30px 0;">
              <a
                href="${trackingLink}"
                style="
                  display:inline-block;
                  background:#C68A2D;
                  color:#ffffff;
                  padding:14px 28px;
                  border-radius:8px;
                  text-decoration:none;
                  font-weight:bold;
                  font-size:15px;
                "
              >
                ${buttonText}
              </a>
            </div>

            <p>
              ${isFrench
                ? "Notre équipe va étudier votre demande et vous recontactera dans les meilleurs délais."
                : "Our team will review your request and get back to you shortly."
              }
            </p>

            <p>
              ${isFrench
                ? "Cordialement,<br>L'équipe 3C Express"
                : "Best regards,<br>3C Express Team"
              }
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