import React from 'react'
import { withRouter } from 'react-router';
import PulseLoader from "react-spinners/PulseLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const style = {
    width: "100%",
    height: "300px",
    textAlign: "center",
    paddingTop: "30px",
    color: "white",
}

function Support() {
    return (
        <div style={style}>
            Please contact us at <a href="mailto:support@animei.tv">support@animei.tv</a>
        </div>
    )
}

export default Support
