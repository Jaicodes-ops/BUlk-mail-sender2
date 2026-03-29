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
  res.send(true); // respond fast

  const msg = req.body.msg;
  const emaillist = req.body.emaillist;

  try {
    const data = await credential.find();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].user,
        pass: data[0].pass,
      },
    });

    for (let i = 0; i < emaillist.length; i++) {
      try {
        await transporter.sendMail({
          from: "jayarajraj81@gmail.com",
          to: emaillist[i],
          subject: "this message from bulk mail app",
          text: msg,
        });

        console.log("email sent to:", emaillist[i]);
      } catch (err) {
        console.log("failed:", emaillist[i]);
      }
    }

  } catch (error) {
    console.log("error:", error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));