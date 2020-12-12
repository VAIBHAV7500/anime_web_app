import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import './Banner.css';
import {useHistory} from "react-router-dom";

const responsive = {
  superLargeDesktop: {
    breakpoint: {
      max: 4000,
      min: 3000
    },
    items: 1
  },
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024
    },
    items: 1
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 464
    },
    items: 1
  },
  mobile: {
    breakpoint: {
      max: 464,
      min: 0
    },
    items: 1
  }
};

function Banner() {
    const [movies, setMovies] = useState([]);
    const history = useHistory();

    const goToShow = (id) => {
      history.push(`/show/${id}`);
    }

    useEffect(() => {
        async function fetchData(){
            const request = await axios.get(requests.fetchBanner);
            setMovies(
                request.data
            );
            return request;

        }
        fetchData();
    }, []);

    return (
      <Carousel 
      className="carousal"
      responsive={responsive}
      autoPlay= {true}
      arrows = {true}
      showDots = {false}
      infinite = {true}
      autoPlaySpeed={3000}
      >
          {movies.map((movie,i)=>{
            return <div 
            className = "banner"
            key = {i}
            onClick={()=>{goToShow(movie?.show_id)}}
            style = {
              {
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url(
                      "${movie?.src}"
                  )`,
                backgroundPosition: "center center",
              }
            } >
              <div className="banner_contents">
                <h1 className="banner_title">{movie?.title || movie?.name || movie?.original_name}</h1>
                
              </div>
              <div className="banner_fadeBottom" />
            </div>
          })}
      </Carousel>
    );
}

export default Banner
