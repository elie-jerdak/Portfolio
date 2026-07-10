const prisma = require("../db");
const validator = require("validator");
const path = require("path");
const { sendContactNotification } = require("../services/emailService");


exports.getContactPage = (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "views", "contact" ,"index.html")
    );
}

exports.sendMessage = async (req, res) => {

    const {name, email, subject, message} = req.body;


    if (!name || !email || !subject || !message) {

        return res.status(400).json({
            message: "All fields are required."
        });

    }

    if (!validator.isEmail(email)) {

        return res.status(400).json({
            message:"Invalid email address."
        });

    }

    try {

        // Save message
        const contactMessage = await prisma.contactMessage.create({

            data: {
                name,
                email,
                subject,
                message
            }

        });


        // Send notification email
        await sendContactNotification(contactMessage);



        res.status(201).json({

            message: "Message sent successfully."

        });


    } catch(error) {

        console.error("Contact message error:", error);


        res.status(500).json({

            message: "Failed to send message."

        });

    }

};