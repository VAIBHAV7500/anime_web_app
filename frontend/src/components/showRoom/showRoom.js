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
           console.log(err);
        })
        this.state.pageLoader = false;
        this.state.rows = this.rows;
        this.state.trailer = "";
        this.state.showIndex = {current : "" , prev : ""};
        this.setState(this.state);      
    }

    changeTrailer = (newTrailerData) => {
      this.setState(prev=>({...prev,trailer : newTrailerData}))
    }
    changeShowIndex = (newIndexData) =>{
      this.setState(prev=>({...prev,showIndex : newIndexData}))
    }

    componentDidMount = () => {
      this.loadData();
    }

    render() {
        return (
            <div className={styles.showRoom}>
              { this.state?.pageLoader && <PageLoader className={styles.shadow} /> }
              <Nav />
              <Banner />
              <div  className={styles.spaces}/>
              <div className={styles.rows_wrapper}>
              {
                this.state.rows?.map((row,index)=>{
                  return <Row rowIndex={index} showIndexArray={[this.state.showIndex,this.changeShowIndex]} trailerArray={[this.state.trailer,this.changeTrailer]} title = {row.name} movies = {row.movies} isLargeRow  key={index} className={styles.row}/>
                })
              }
              </div>
              <footer>
                <Footer/>
              </footer>
            </div>
        )
    }
}

export default showRoom
