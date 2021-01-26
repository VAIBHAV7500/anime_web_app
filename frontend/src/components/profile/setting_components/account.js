import React from 'react'
import { FaAngleRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import styles from './account.module.css'
import default_img from '../../../images/default_user_profile.png'
const Account = () => {

    const userDetail = {
        email : "anubhavsolanki0@gmail.com",
        username : "anubhav",
    }
    
    const accountFields = [
        {
            name : "Email",
            type : "email",
            value : "email",
            disabled : true,
        },
        {
            name : "Username",
            value : "username"
        },
        {
            name : "Mobile Number",
            placeholder : "Enter Mobile Number"
        },
        {
            name : "Current Password",
            placeholder : "Enter Current Password",
        },
        {
            name : "New Password",
            placeholder : "Enter New Password",
        },
        {
            name : "Confirm New Password",
            placeholder : "Confirm New Password",
        },
    ]
    return (
        <div className={styles.body}>
            <form className={styles.container}>
                {accountFields?.map(field => (
                    <div>
                        <p className={styles.field_name}>{field.name}</p>
                        <input className={styles.field_input} required={true} placeholder={field.placeholder ? field.placeholder : null} disabled = {field.disabled ? true : false} type={field.type ? field.type : "text"} value={field.value ? userDetail[field["value"]] : null}/>
                    </div>
                ))}
                <button className={styles.update_btn}>Update Profile</button>
            </form>
       
            {/* <div className={styles.plan_detail_section}>
                <table className={styles.plan_detail}>
                    <tbody>
                        <tr>
                            <td className={styles.see_plan_cell} colSpan={2}>
                                <Link to={'/pricing'}  className={styles.see_plan}>Change Plan <FaAngleRight/></Link> 
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className={styles.overlook}>PLAN </span><br/>
                                <span className={styles.highlight}>Otaku</span>
                            </td>
                            <td>
                                <span className={styles.overlook}>EXPIRES ON</span><br/>
                                <span className={styles.highlight}>02/05/2021</span> 
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Link to={'/pricing'} className={styles.plan_btn}>UPGRADE TO PREMIUM NOW!!</Link>
            </div> */}
        </div>
    )
}

export default Account
