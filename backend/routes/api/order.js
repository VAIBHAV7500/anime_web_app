var express = require('express');
var router = express.Router();
var db = require('../../db/index');
const keys = require('../../config/keys.json');
const Razorpay = require('razorpay');
const request = require('request');

const instance = new Razorpay(keys.razorpay);


router.get("/", (req, res) => {
  try {
    const options = {
      amount: 10 * 100, // amount == Rs 10
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 0,
 // 1 for automatic capture // 0 for manual capture
    };
  instance.orders.create(options, async function (err, order) {
    if (err) {
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  return res.status(200).json(order);
 });
} catch (err) {
  return res.status(500).json({
    message: "Something Went Wrong",
  });
 }
});


router.post("/capture/:paymentId", (req, res) => {
  console.log(req.params.paymentId);
  try {
    return request(
     {
     method: "POST",
     url: `https://${keys.razorpay.key_id}:${keys.razorpay.key_secret}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
     form: {
        amount: 10 * 100, // amount == Rs 10 // Same As Order amount
        currency: "INR",
      },
    },
   async function (err, response, body) {
     if (err) {
       console.log('Error');
      return res.status(500).json({
         message: "Something Went Wrong",
       }); 
     }
      console.log("Status:", response.statusCode);
      console.log("Headers:", JSON.stringify(response.headers));
      console.log("Response:", body);
      return res.status(200).json(body);
    });
  } catch (err) {
    console.log('ERROR 2');
    console.log(err.stack);
    return res.status(500).json({
      message: "Something Went Wrong",
   });
  }
});


module.exports = router;

