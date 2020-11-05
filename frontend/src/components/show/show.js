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

    navItems = [{
        title: 'Episodes',
        component: <Episodes show_id={this.props.match.params.id}/>
      },
      {
        title: 'Characters',
        component: <Characters show_id={this.props.match.params.id}/>
      },
      {
        title: 'Review',
        component: <Review show_id={this.props.match.params.id}/> 
      },
      {
        title: 'Similar Shows & Movies',
        component: <Similar show_id={this.props.match.params.id}/>
      }
    ] 

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
        const results = await Promise.all(promiseArray);
        const states = {
            show: results[0].data,
            nav_id: 0,
            show_id: showId
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
                                return <div  key ={index} className= {`${styles.sub_item} ${styles.neumorphism} ${this.state?.nav_id === index ? styles.sub_item_active:""}`} onClick={()=>{this.selectNav(index)}}> {x.title} </div>
                            })
                        }
                    </div>
                {this.navItems[this.state?.nav_id || 0]?.component}
            </div>
        )
    }
}

export default show
