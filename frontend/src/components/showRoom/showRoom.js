import React, { Component } from 'react'
import Row from './Row';
import Banner from './Banner';
import requests from '../../utils/requests';
import Nav from '../services/Nav';
import Footer from './footer';
 import Loader from 'react-loader-spinner'
 

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
              <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
              <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
              <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
              <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
              <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
              <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
              <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} />
              <footer>
                <Footer/>
              </footer>
            </div>
        )
    }
}

export default showRoom
