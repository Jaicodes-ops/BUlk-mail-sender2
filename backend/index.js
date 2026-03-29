const express = require("express");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://jayarajraj81:DGziHRyy0uyYWqSX@cluster0.6apn4ev.mongodb.net/passkey?appName=Cluster0",
  )
  .then(() => console.log("connected to db"))
  .catch(() => console.log("failed to connect"));

const credentialSchema = new mongoose.Schema(
  { user: String, pass: String },
  { strict: false },
);
const credential = mongoose.model("credential", credentialSchema, "bulkmail");

app.post("/sendmail", async (req, res) => {
  const { msg, emaillist } = req.body;

  try {
    const data = await credential.find();

    if (!data || data.length === 0) {
      return res.send(false);
    }

    const { user, pass } = data[0].toJSON();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    for (let i = 0; i < emaillist.length; i++) {
      await transporter.sendMail({
        from: "jayarajraj81@gmail.com",
        to: emaillist[i],
        subject: "this message from bulk mail app",
        text: msg,
      });
      console.log("email sent to: " + emaillist[i]);
    }

    res.send(true);
  } catch (error) {
    console.log(error);
    res.send(false);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
