import React from 'react'
import './footer.css'

function footer() {
    return (
        <div className="footer">
            <table className="footer_table">
                <tr>
                    <td>
                        Terms and Condition
                    </td>
                    <td>
                        Audio Description
                    </td>
                </tr>
                <tr>
                    <td>
                        Support
                    </td>
                    <td>
                        Investor Relations
                    </td>
                </tr>
                <tr>
                    <td>
                        Audio and Subtitles
                    </td>
                    <td>
                        Legal Notices
                    </td>
                </tr>
            </table>
            <h1 className="footer_logo">
                    ANIMEI
            </h1>
        </div>
    )
}

export default footer
