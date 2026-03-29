const express = require("express");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb+srv://jayarajraj81:DGziHRyy0uyYWqSX@cluster0.6apn4ev.mongodb.net/passkey?appName=Cluster0")
  .then(() => console.log("connected to db"))
  .catch(() => console.log("failed to connect"));

const credential = mongoose.model("credential", {}, "bulkmail");

app.post("/sendmail", async (req, res) => {
  const { msg, emaillist } = req.body;

  res.send(true);

  try {
    const data = await credential.find();

    if (!data || data.length === 0) {
      console.log("No credentials found in DB");
      return;
    }

    const user = data[0].toJSON().user;
    const pass = data[0].toJSON().pass;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    for (let i = 0; i < emaillist.length; i++) {
      try {
        await transporter.sendMail({
          from: "jayarajraj81@gmail.com",
          to: emaillist[i],
          subject: "this message from bulk mail app",
          text: msg,
        });

        console.log("sent:", emaillist[i]);
      } catch (err) {
        console.log("failed:", emaillist[i], err.message);
      }
    }

    console.log("All emails processed");

  } catch (error) {
    console.log("Server error:", error);
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));