import React from 'react'
import './footer.css'

function footer() {
    return (
        <div className="footer">
            <div className="footer_table">
                <div>
                    <p>Terms and Condition</p>
                    <p>Support</p>
                    <p>Audio and Subtitles</p>
                </div>
                <div>
                    <p>Audio Description</p>
                    <p>Investor Relations</p>
                    <p>Legal Notices</p>
                </div>
                <div className="footer_logo_div">
                    <h1 className="footer_logo">
                        ANIMEI
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default footer
