var express = require('express');
var router = express.Router();
var db = require('../../db/index');
const Razorpay = require('razorpay');
const request = require('request');
const plans = require('../../config/plans');
const { updateUserDates } = require('../../lib/order');
const {logger} = require('../../lib/logger');

const keys = {
  razorpay: {
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  }
}

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
    const plan_id = parseInt(req.query.id);
    const user_id = req.query.user_id;
    const currPlan = plans.paid_plan_ids.find(x => x.id === plan_id);
    const amount = (currPlan.price) * 100;
    const options = {
      amount,
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
    const body = {
      id: order.id,
      amount: (order.amount/100),
      status: order.status,
      user_id,
    }
    await db.razorpay_orders.create(body);
  return res.status(200).json(order);
 });
} catch (err) {
  logger.error(err);
  return res.status(500).json({
    message: "Something Went Wrong",
  });
 }
});


router.post("/capture/:paymentId", (req, res) => {
  const plan_id = parseInt(req.body.plan_id);
  const user_id = req.body.user_id;
  const currPlan = plans.paid_plan_ids.find(x => x.id === plan_id);
  const amount = (currPlan.price) * 100;
  
  try {
    return request(
     {
     method: "POST",
     url: `https://${keys.razorpay.key_id}:${keys.razorpay.key_secret}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
     form: {
        amount,
        currency: "INR",
      },
    },
   async function (err, response, stringBody) {
     if (err) {
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
        status: body.status,
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
      await updateUserDates(currPlan.duration, user_id, plan_id);
      return res.status(200).json(body);
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      message: "Something Went Wrong",
   });
  }
});


module.exports = router;
