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
    const doc = {"name":req.body.name, "phone":req.body.phone, "query":"\n"+req.body.query,"en_dt":new Date().toString()};
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
            from : "aayush.hardas@gmail.com",
            to : "aayush.hardas@gmail.com",
            subject : "Enquiry From : " + req.body.query,
            text : "Phone : " + req.body.phone + "Query : " + req.body.query
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if(error)
            {
                console.log(error);
                return res.status(500).json(error);
            }
            return res.status(200).json("mail send");
        });
    })
    .catch(err => {
        res.status(500).send(error);
    });
});

app.listen(9000, () => {console.log("Ready to Serve @ 9000");})