 // routes/payment.js
 const express = require("express");
 const razorpay = require("razorpay");
 const router = express.Router();
 require("dotenv").config();

 const razorpayInstance = new razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.RAZORPAY_KEY_SECRET,
 });

 router.post("/create-order", async (req, res) => {
     const options = {
         amount: req.body.amount, // amount in the smallest currency unit
         currency: "INR",
         receipt: "receipt#1",
     };

     try {
         const order = await razorpayInstance.orders.create(options);
         res.json(order);
     } catch (error) {
         res.status(500).send({ error: error.message });
     }
 });

 module.exports = router;