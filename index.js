const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const { log } = require("console");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: process.env.MAILGUN_USERNAME /* VOTRE NOM D'UTILISATEUR */,
  key: process.env.MAILGUN_API_KEY /* VOTRE CLÉ API */,
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/form", async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  try {
    const messageData = {
      from: `${firstName} ${lastName} <${email}>`,
      to: process.env.MAILGUN_EMAIL,
      subject: "Formulaire JS",
      text: message,
    };

    const response = await client.messages.create(
      process.env.MAILGUN_SANDBOX,
      messageData
    );

    console.log(response);

    res.status(200).json({ message: "Message sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occured" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
