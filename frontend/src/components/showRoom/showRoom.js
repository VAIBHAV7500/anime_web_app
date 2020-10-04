import React, { Component } from 'react'
import Row from './Row';
import Banner from './Banner';
import requests from '../../utils/requests';
import Nav from '../services/Nav';
import Footer from './footer';
import styles from './showRoom.module.css';
 

export class showRoom extends Component {
    render() {
        return (
            <div>
              <Nav />
              <Banner />
              <div  className={styles.spaces}/>
              <Row title="Trending Now" fetchUrl={requests.fetchTrending} isLargeRow />
              <Row title="Top Rated" fetchUrl={requests.fetchTopRated} isLargeRow />
              <Row title="Action" fetchUrl={requests.fetchActionMovies} isLargeRow />
              <Row title="Comedy" fetchUrl={requests.fetchComedyMovies} isLargeRow />
              <Row title="Horror" fetchUrl={requests.fetchHorrorMovies} isLargeRow />
              <Row title="Romance" fetchUrl={requests.fetchRomanceMovies} isLargeRow />
              <Row title="Drama" fetchUrl={requests.fetchDrama} isLargeRow />
              <footer>
                <Footer/>
              </footer>
            </div>
        )
    }
}

export default showRoom
