import React, { Component } from 'react'

export class header extends Component {
    render() {
        return (
            <div style={headerStyle}>
                <h1>Headers</h1>
            </div>
        )
    }
}

const headerStyle = {
    align: 'center',
}

export default header
