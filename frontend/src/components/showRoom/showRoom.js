import React, { Component } from 'react'
import Row from './Row';
import Banner from './Banner';
import requests from '../../utils/requests';
import Nav from '../services/Nav';
import Footer from './footer';
import PageLoader from '../services/page_loader';
import styles from './showRoom.module.css';
import axios from '../../utils/axios';
 

export class showRoom extends Component {
    constructor(props) {
      super(props);
      this.state = {
        rows: []
      };
      this.rows = [
        {
        name: 'Trending Now',
        url: requests.fetchTrending
      }, 
      {
        name: 'Top Rated',
        url: requests.fetchTopRated
      },
      {
        name: 'Action',
        url: requests.fetchActionMovies
      },
      {
        name: 'Comedy',
        url: requests.fetchComedyMovies
      },
      {
        name: 'Horror',
        url: requests.fetchHorrorMovies
      },
      {
        name: 'Romance',
        url: requests.fetchRomanceMovies
      },
      {
        name: 'Drama',
        url: requests.fetchDrama
      },
    ]
    }

    loadData = async () => {
        this.state.pageLoader = true;
        this.setState(this.state);
        const promiseArray = [];
        this.rows.forEach((row, index) => {
          promiseArray.push(new Promise((res,rej)=>{
            axios.get(row.url).then((result) => {
              this.rows[index].movies = result.data;
              res(result.data);
            }).catch((err) => {
              rej(err);
            });
          }));
        });
        await Promise.all(promiseArray).catch((err) => {
           // redirect in this case
        })
        this.state.pageLoader = false;
        this.state.rows = this.rows;
        this.setState(this.state);      
    }

    componentDidMount = () => {
        this.loadData();
    }

    render() {
        return (
            <div>
              { this.state?.pageLoader && <PageLoader className={styles.shadow} /> }
              <Nav />
              <Banner />
              <div  className={styles.spaces}/>
              {
                this.state.rows?.map((row)=>{
                  console.log(row)
                  return <Row title = {row.name} movies = {row.movies} isLargeRow />
                })
              }
              <footer>
                <Footer/>
              </footer>
            </div>
        )
    }
}

export default showRoom
