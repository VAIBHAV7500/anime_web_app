import React, { Component } from 'react';
import Banner from './banner';
import Nav from '../services/Nav';
import Episodes from './episodes';

export class show extends Component {
    
    render() {
        return (
            <div>
                <Nav/>
                <Banner/>
                < Episodes/>
            </div>
        )
    }
}

export default show


const data = {
    "episodes": [
        1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19
    ]
}
