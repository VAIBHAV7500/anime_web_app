import React, { useState, useEffect } from "react";
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import './banner.css';

function Banner() {
    const [movie, setMovie] = useState([]);

    useEffect(() => {
        async function fetchData(){
            const request = await axios.get(requests.fetchBanner);
            setMovie(
                request.data[
                    Math.floor(Math.random() * request.data.length-1)
                ]
            );
            return request;

        }
        fetchData();
    }, []);

    function truncate(str , n){
        return str?.length > n ? str.substr(0 , n-1) + " ... ": str;
    }



    return (
      <header
        className="banner"
        style={{
          backgroundSize: "cover",
          backgroundImage: `url(
                "${movie?.poster_landscape_url}"
            )`,
          backgroundPosition: "center center",
        }}
      >
        <div className="banner_contents">
          <h1 className="banner_title">{movie?.title || movie?.name || movie?.original_name}</h1>
          <div className="banner_buttons">
            <button className="banner_button">Play</button>
            <button className="banner_button">My List</button>
          </div>
          <h1 className="banner_description">
              {truncate(movie?.description,150)}<br/>
              Country: {movie?.origin_country}<br/>
              Rating: {(movie?.total_views) ? movie.vote_average.toFixed(2) : 0}
          </h1>
        </div>
        <div className="banner--fadeBottom" />
      </header>
    );
}

export default Banner