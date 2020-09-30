import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import './Banner.css';

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

    function generateBanners(){
      const elements = [];
      for(var i=0;i<movies.length;i++){
            elements.push(
              <div 
            className = "banner"
            key = {i}
            style = {
              {
                backgroundSize: "cover",
                backgroundImage: `url(
                      "${movies[i]?.poster_landscape_url}"
                  )`,
                backgroundPosition: "center center",
              }
            } >
              <div className="banner_contents">
                <h1 className="banner_title">{movies[i]?.title || movies[i]?.name || movies[i]?.original_name}</h1>
                <h1 className="banner_description">
                    {"Some description" }
                </h1>
              </div>
              <div className="banner--fadeBottom" />
            </div>
          );
      }
      return elements;
    }

    return (
      <Carousel 
      responsive={responsive}
      autoPlay= {true}
      arrows = {false}
      showDots = {true}
      infinite = {true}
      autoPlaySpeed={3000}
      >
            {generateBanners()}
      </Carousel>
    );
}

export default Banner
