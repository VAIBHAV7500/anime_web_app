import React, { Component } from 'react';
import Banner from './banner';
import Info from './info';
import Nav from '../services/Nav';
import requests from '../../utils/requests';
import axios from '../../utils/axios';
import styles from './show.module.css';
import { FaThList } from 'react-icons/fa';

export class show extends Component {

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
            axios.get(`${requests.fetchEpisodes}?show_id=${1}`).then((result) => {
                res(result);
            }).catch((err) => {
                rej(err)
            });
        }));
        const results = await Promise.all(promiseArray);
        const states = {
            show: results[0].data,
            episodes: results[1].data
        };
        this.setState(states);
        console.log(this.state);
    }
    async componentDidMount(){
        this.fetchData();
    }

    async componentDidUpdate(prevProps) {
        console.log(prevProps);
        if (this.props.match.params.id !== prevProps.match.params.id) {
            // call the fetch function again
            console.log('Updated');
             this.fetchData();
        }
    }
    
    render() {
        return (
            <div className={styles.show}>
                <Nav/>
                <Banner movie = {this.state?.show}/>
                <Info movie = {this.state?.show}/>
                <br className={styles.break}/>
                {/* <div className={styles.sub_nav}>
                    <div className={styles.sub_item}>Episodes</div>
                </div> */}
                {/* {
                    this.state && this.state.episodes && this.state.episodes.map((episode)=>{
                        return <div key={episode.id}>
                            {episode.id}
                        </div>
                    })
                } */}
                <div className={styles.episodes}>
                    
                </div>
            </div>
        )
    }
}

export default show
