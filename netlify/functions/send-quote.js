const { Resend } = require("resend");

exports.handler = async (event) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = JSON.parse(event.body);

    await resend.emails.send({
      from: "3C Express <contact@3cexpress.fr>",
      to: [
        "operations@3cexpress.fr",
        "air@3cexpress.fr"
      ],
      subject: `New Quote Request - ${data.request_id}`,
      html: `
        <h2>New Quote Request</h2>

        <p><strong>Reference:</strong> ${data.request_id}</p>

        <h3>Client Information</h3>

        <p>
          <strong>Company:</strong> ${data.company}<br>
          <strong>Contact:</strong> ${data.contact_person}<br>
          <strong>Email:</strong> ${data.email}<br>
          <strong>Phone:</strong> ${data.phone}
        </p>

        <h3>Shipment</h3>

        <p>
          <strong>Service:</strong> ${data.service}<br>
          <strong>Operation:</strong> ${data.operation}<br>
          <strong>Origin:</strong> ${data.origin}<br>
          <strong>Destination:</strong> ${data.destination}
        </p>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};