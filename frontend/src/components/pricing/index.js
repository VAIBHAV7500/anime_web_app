import React from 'react';
import styles from './index.module.css';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import Nav from '../services/Nav';

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
         const captureResponse = await axios.post(url, {});
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

  const plans = [
    {
      "name" : "Basic",
      "Simulcasts" : "Delayed",
      "Advertisement" : "Yes",
      "Quality" : "480p",
      "Subtitle Languages" : "Japanese,English",
      "Dubbed Languages" : "English, Hindi, Japanese",
      "Support" : "Standard Support",
      "Price" : "Free",
      "Duration" : "Unlimited"
    },
    {
      "name" : "Premium",
      "Simulcasts" : "No Delay",
      "Advertisement" : "Yes",
      "Quality" : "480p, 720p",
      "Subtitle Languages" : "Japanese,English",
      "Dubbed Languages" : "English, Hindi, Japanese",
      "Support" : "Standard Support",
      "Price" : "250 Rs.",
      "Duration" : "1 month"
    }
  ]

  return (
    <>
    <Nav type="dark"/>
    <div className={styles.pricing}>
      {/* <button onClick={paymentHandler}>Pay Now</button> */}
      <h1>Select Your Plan</h1>
      <div className={styles.card_container}>
        {plans.map(plan => (
          <div>
          <table className={styles.card}> 
            {Object.keys(plan).map(field => (
              field!=="name" ?
                <tr className={styles.card_field}>
                  <h5>{field}</h5>
                  <h4>{plan[field]}</h4>
                </tr>
              : <th className={styles.column_heading}>
                  <h2>{plan[field]}</h2>
                </th>
            ))}
          </table>
          <div className={styles.buy_btn}>Buy Now</div>
          </div>
        ))}

      </div>    
    </div>
    </>
  )
}

export default Pricing
