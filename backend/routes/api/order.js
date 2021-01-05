var express = require('express');
var router = express.Router();
var db = require('../../db/index');
const keys = require('../../config/keys.json');
const Razorpay = require('razorpay');
const request = require('request');

const instance = new Razorpay(keys.razorpay);

const cleanJson = (js) => {
  let newJs = {};
  Object.keys(js).forEach((key)=>{
    if(js[key]){
      newJs[key] = js[key];
    }
  });
  return newJs;
}


router.get("/", (req, res) => {
  try {
    const plan_id = req.query.id;
    console.log(plan_id);
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
    console.log(order);
    const body = {
      id: order.id,
      amount: (order.amount/100),
      status: order.status
    }
    console.log(body);
    await db.razorpay_orders.create(body);
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
   async function (err, response, stringBody) {
     if (err) {
       console.log('Error');
      return res.status(500).json({
         message: "Something Went Wrong",
       }); 
     }
      const body = JSON.parse(stringBody);
      let updateBody = {
        transaction_id: body.id,
        amount: body.amount / 100,
        invoice_id: body.invoice_id,
        method: body.method,
        amount_refunded: body.amount_refunded,
        refund_status: body.refund_status,
        card_id: body.card_id,
        bank: body.bank,
        wallet: body.wallet,
        vpa: body.vpa,
        email: body.email,
        contact: body.contact
      };
      updateBody = cleanJson(updateBody);
      await db.razorpay_orders.onTransactionComplete(updateBody,body.order_id);
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

