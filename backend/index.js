const express = require("express");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://jayarajraj81:DGziHRyy0uyYWqSX@cluster0.6apn4ev.mongodb.net/passkey?appName=Cluster0")
  .then(function () {
    console.log("connected to db");
  })
  .catch(function () {
    console.log("failed to connect");
  });

const credential = mongoose.model("credential", {}, "bulkmail");

app.post("/sendmail", async (req, res) => {
  const msg = req.body.msg;
  const emaillist = req.body.emaillist;

  credential
    .find()
    .then(function (data) {

      console.log("DATA:", data);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: data[0].toJSON().user,
          pass: data[0].toJSON().pass,
        },
      });

      console.log(data[0].toJSON());

      return new Promise(async function (resolve, reject) {
        try {
          for (let i = 0; i < emaillist.length; i++) {
            await transporter.sendMail({
              from: "jayarajraj81@gmail.com",
              to: emaillist[i],
              subject: "this message from bulk mail app",
              text: msg,
            });

            console.log("email sent to: " + emaillist[i]);
          }

          resolve("success");
        } catch (error) {
          reject("failed");
        }
      });

    })
    .then(() => {
      res.send(true);
    })
    .catch((error) => {
      console.log(error);
      res.send(false);
    });

});

app.listen(5000, () => {
  console.log("server is started");
});