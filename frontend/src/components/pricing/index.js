import React from 'react';
import styles from './index.module.css';
import axios from '../../utils/axios';
import requests from '../../utils/requests';

function Pricing() {
  const paymentHandler = async (e) => {
    e.preventDefault();
    const orderUrl = `api/order`;
    const response = await axios.get(requests.order);
    const { data } = response;
    const options = {
      key: "rzp_test_NBD5PIK1a8cjiN",
      name: "ANIMEI TV",
      description: "An Anime Streaming Platform",
      order_id: data.id,
      handler: async (response) => {
        try {
         const paymentId = response.razorpay_payment_id;
         const url = `${requests.captureOrder}/${paymentId}`;
         const captureResponse = await axios.post(url, {})
         console.log(captureResponse.data);
        } catch (err) {
          console.log(err);
        }
      },
      theme: {
        color: "#641BA8",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
    };

  return (
    <div className={styles.pricing}>
      <button onClick={paymentHandler}>Pay Now</button>
    </div>
  )
}

export default Pricing
