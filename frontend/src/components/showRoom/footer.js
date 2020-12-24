import React, {useEffect} from 'react'
import './footer.css';
import mainLogo from '../services/logo_transparent.png';
import { useHistory } from 'react-router-dom';

function Footer() {
    const history = useHistory();

    const goToPath = (path) => {
        history.push(path);
    }

    return (
        <div className="footer">
            <div className="footer_table">
                <div>
                    <p onClick={() => { goToPath("/terms-and-conditions")}}>Terms and Condition</p>
                    <p>Support</p>
                    <p>Audio and Subtitles</p>
                </div>
                <div>
                    <p>Audio Description</p>
                    <p>Investor Relations</p>
                    <p>Legal Notices</p>
                </div>
                <div className="footer_logo_div">
                    <img draggable="false" className="footer_logo"  src={mainLogo} />
                </div>
            </div>
        </div>
    )
}

export default Footer
