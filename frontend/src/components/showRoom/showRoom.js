import React, { Component } from 'react'
import Banner from './Banner';
import requests from '../../utils/requests';
import Nav from '../services/Nav';
import Row from './Row';
import Footer from './footer';
import PageLoader from '../services/page_loader';
import styles from './showRoom.module.css';
import axios from '../../utils/axios';
import {useHistory} from "react-router-dom";

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
        name: 'Fantasy',
        url: requests.fetchFantasy
      },
      {
        name: 'Adventure',
        url: requests.fetchAdventure
      },
      {
        name: 'Drama',
        url: requests.fetchDrama
      },
    ]
    }

    getShows = async () => {
      const promiseArray = [];
        this.rows.forEach((row, index) => {
          promiseArray.push(new Promise((res,rej)=>{
            const axiosInstance = axios.createInstance();
            axiosInstance.get(row.url).then((result) => {
              this.rows[index].movies = result.data;
              res(result.data);
            }).catch((err) => {
              rej(err);
            });
          }));
        });
        await Promise.all(promiseArray).catch((err) => {
           // redirect in this case
           throw err;
        })
    }

    loadData = async () => {
        this.state.pageLoader = true;
        this.setState(this.state);
        let retry = 0;
        do{
          try{
            await this.getShows();
            retry = -1;
          }catch(err){
            console.log(err);
          }
          retry++;
        }while(retry > 0 && retry < 10)
        this.state.rows = this.rows;
        this.state.trailer = "";
        this.state.showIndex = {current : "" , prev : ""};
        this.setState(this.state);   
        await new Promise((res,rej)=>{
          setTimeout(()=>{
              this.state.pageLoader = false;
              this.setState(this.state);
              res(true);
          },1000);
        })   
    }

    changeTrailer = (newTrailerData) => {
      this.setState(prev=>({...prev,trailer : newTrailerData}))
    }
    changeShowIndex = (newIndexData) =>{
      this.setState(prev=>({...prev,showIndex : newIndexData}))
    }

    checkRedirect = () => {
      const query = new URLSearchParams(this.props.location.search);
      const redirectURL = query.get('redirect');
      if(redirectURL){
        this.props.history.push(redirectURL);
      }
    }

    componentDidMount = () => {
      this.checkRedirect();
      this.loadData();
    }

    render() {
        return (
            <div className={styles.showRoom}>
              { this.state?.pageLoader && <PageLoader className={styles.shadow} title="Loading Home..." /> }
              <Nav />
              <Banner />
              <div  className={styles.spaces}/>
              <div className={styles.rows_wrapper}>
              {
                this.state.rows?.map((row,index)=>{
                  return <Row rowIndex={index} showIndexArray={[this.state.showIndex,this.changeShowIndex]} trailerArray={[this.state.trailer,this.changeTrailer]} key={index} title = {row.name} movies = {row.movies} isLargeRow className={styles.row}/> 
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
