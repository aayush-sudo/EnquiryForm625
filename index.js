const express = require("express");
const cors = require("cors");
const {MongoClient} = require("mongodb");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/save",(req,res) => {
    const url = process.env.mongo_url;
    const con = new MongoClient(url);
    const db = con.db("enquiry_28june25");
    const coll = db.collection("enquiry");
    const doc = {"name":req.body.name, "email":req.body.email, "phone":req.body.phone, "query":req.body.query,"en_dt":new Date().toString()};
    coll.insertOne(doc)
    .then(response => {
        let transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from : process.env.EMAIL_USER,
            to : process.env.EMAIL_USER,
            subject : "Enquiry From : " + req.body.name,
            text : "Phone : " + req.body.phone + "\n" + "Query : " + req.body.query
        };

        let userMailOptions = {
                from: process.env.EMAIL_USER,
                to: req.body.email,
                subject: "Your Enquiry Receipt",
                text: `Dear ${req.body.name},\n\nThank You For Contacting Us.\n\nThis is a Copy of your Enquiry:\n\nPhone: ${req.body.phone}\nQuery: ${req.body.query}\n\nWe Will Get Back To Tou Shortly.\n\nThank You`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if(error)
            {
                console.log(error);
                return res.status(500).json(error);
            }
            //return res.status(200).json("mail send");
        //});

        transporter.sendMail(userMailOptions, (userErr, userInfo) => {
                    if(userErr) 
                    {
                        console.log(userErr);
                        return res.status(500).json({ error: "Email to User Failed" });
                    }
                    return res.status(200).json("Both Mails Sent");
        });
    });
})
    .catch(err => {
        res.status(500).send(err);
    });
});

app.listen(9000, () => {console.log("Ready to Serve @ 9000");})