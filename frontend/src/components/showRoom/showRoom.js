import React, { Component } from 'react'
import Row from './Row';
import Banner from './Banner';
import requests from '../../utils/requests';
import Nav from '../services/Nav';
import Footer from './footer';
 

export class showRoom extends Component {
  
    render() {
        return (
            <div>
              <Nav />
              <Banner />
              <Row
                title="Top Shows in India"
                fetchUrl={requests.fetchTopRated}
                isLargeRow 
              />
              <Row title="Trending Now" fetchUrl={requests.fetchTrending} isLargeRow />
              <Row title="Top Rated" fetchUrl={requests.fetchTopRated} isLargeRow />
              <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} isLargeRow />
              <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} isLargeRow />
              <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} isLargeRow />
              <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} isLargeRow />
              <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} isLargeRow />
              <footer>
                <Footer/>
              </footer>
            </div>
        )
    }
}

export default showRoom
