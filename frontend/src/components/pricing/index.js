import React, { useState } from 'react';
import styles from './index.module.css';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import Nav from '../services/Nav';
import plans from './plans';
import { FaAngleRight, FaArrowRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function Pricing() {
  const [planId, setPlan] = useState(2);
  const userId = useSelector(state => state.user_id);

  const paymentHandler = async (e) => {
    e.preventDefault();
    const axiosInstance = axios.createInstance();
    const response = await axiosInstance.get(`${requests.order}?id=${planId}&user_id=${userId}`);
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
         const captureResponse = await axiosInstance.post(url, {
           plan_id: planId,
           user_id: userId
         });
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

  const setNewPlan = (id) => {
    if(id != 1){
      setPlan(id);
    }
  }

  return (
    <>
    <Nav type="dark"/>
    <div className={styles.pricing}>
      <div className={styles.card_container}>
        {plans.map(plan => (
          <table className={`${styles.card} ${planId === plan["id"] ? styles.current_plan : ""}`} onClick={()=>{setNewPlan(plan["id"])}}> 
            {Object.keys(plan).map(field => {
              if(["id","custom_class"].includes(field)){
                return;
              }
              return (
              field!=="name" ?
                <tr className={`${styles.card_field}`}>
                  <h5>{field}</h5>
                  <h4>{plan[field]}</h4>
                </tr>
              : <th className={`${styles.column_heading} ${plan[field]} ${plan["custom_class"]}`}>
                  <h2>{plan[field]}</h2>
                </th>
            )})}
          </table>
          ))}
      </div>    
      <div className={styles.buy_btn} onClick={paymentHandler}>Proceed with {plans[planId-1]?.name} <FaAngleRight/> </div>
    </div>
    </>
  )
}

export default Pricing
