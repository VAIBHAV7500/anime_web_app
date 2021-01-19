import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import SignIn from './SignIn/SignIn'
import SignUp from './SignUp/SignUp'
import SignUpVerification from './SignUpVerification'

const Welcome = () => {
    const [active,setActive] = useState(0);
    const [email,setEmail] = useState("");
    const [user, setUser]= useState();
    const components = [
        {
            component : <SignIn activeArray={[,setActive]}/>,
        },
        {
            component : <SignUp activeArray={[,setActive]} emailDetail={[email,setEmail]} userDetail ={[user,setUser]}/>,
        },
        {
            component : <SignUpVerification activeArray={[,setActive]} emailDetail={[email,setEmail]} userDetail ={[user,setUser]}/>,
        }
    ]

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                {components[active].component}
            </div>
        </div>
    )
}

export default Welcome
