import React, { Component } from 'react';
import Banner from './banner';
import Info from './info';
import Nav from '../services/Nav';
import requests from '../../utils/requests';
import axios from '../../utils/axios';
import styles from './show.module.css';
import Episodes from './episodes';
import Characters from './characters';
import Review from './review';
import Similar from './similar';

export class show extends Component {

    navItems = ['Episodes','Characters','Review', "Similar Shows & Movies"];

    fetchData = async () => {
        const showId = this.props.match.params.id
        const promiseArray = [];
        promiseArray.push(new Promise((res, rej) => {
            axios.get(`${requests.fetchShowDetails}?id=${showId}`).then((result) => {
                res(result);
            }).catch((err) => {
                rej(err)
            });
        }));
        promiseArray.push(new Promise((res, rej) => {
            axios.get(`${requests.fetchEpisodes}?show_id=${showId}`).then((result) => {
                res(result);
            }).catch((err) => {
                rej(err)
            });
        }));
        const results = await Promise.all(promiseArray);
        const states = {
            show: results[0].data,
            episodes: results[1].data,
            nav_id: 0,
        };
        this.setState(states);
    }
    async componentDidMount(){  
        window.scrollTo(0, 0);
        this.fetchData();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            window.scrollTo(0, 0);
            this.fetchData();
        }
    }

    selectNav = (id) =>{
        this.setState(prevState=>({
            ...prevState,
            nav_id : id
        }));
    }
    
    render() {
        return (
            <div className={styles.show}>
                <Nav/>
                <Banner movie = {this.state?.show}/>
                <Info movie = {this.state?.show} className={styles.info}/>
                <br className={styles.break}/>
                    <div className={styles.sub_nav}>
                        <div className={styles.filler}></div>
                        {
                            this.navItems.map((x, index) =>{
                                return <div  key ={index} className= {`${styles.sub_item} ${styles.neumorphism} ${this.state?.nav_id === index ? styles.sub_item_active:""}`} onClick={()=>{this.selectNav(index)}}> {x} </div>
                            })
                        }
                    </div>
                { this.state?.nav_id === 0 ? <Episodes show_id={this.props.match.params.id} /> : ""}
                { this.state?.nav_id === 1 ? <Characters show_id={this.props.match.params.id} /> : ""}
                { this.state?.nav_id === 2 ? <Review show_id={this.props.match.params.id} /> : ""}
                { this.state?.nav_id === 3 ? <Similar show_id={this.props.match.params.id} /> : ""}

                <div className={styles.episodes}>
                    
                </div>
            </div>
        )
    }
}

export default show
