import React from 'react'
import {ImHome} from "react-icons/im";
import './player.css';
import {Redirect,useHistory} from "react-router-dom";

function HomeButton({path}) {

    const history = useHistory();
    function sendBack() {
        history.push(path);
    }
    return (
        < ImHome className = 'home-btn btn' onClick={sendBack} />
    );
}

export default HomeButton
