const { Resend } = require("resend");
const escape = require("escape-html");

const resend = new Resend(process.env.RESEND_API_KEY);


exports.sendContactNotification = async (contactMessage) => {

    await resend.emails.send({

        from: process.env.FROM_EMAIL,

        to: process.env.CONTACT_EMAIL,

        subject: `New Portfolio Message: ${contactMessage.subject}`,

        html: `
            <h2>New Contact Form Submission</h2>

            <p>
            <strong>Name:</strong>
            ${escape(contactMessage.name)}
            </p>

            <p>
            <strong>Email:</strong>
            ${escape(contactMessage.email)}
            </p>

            <p>
            <strong>Subject:</strong>
            ${escape(contactMessage.subject)}
            </p>

            <hr>

            <p>
            ${escape(contactMessage.message)}
            </p>
        `
    });

};