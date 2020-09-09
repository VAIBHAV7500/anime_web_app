import React, { useState , useEffect } from 'react'
import axios from '../../utils/axios';
import "./Row.css";
import movieTrailer from "movie-trailer";
import ReactPlayer from 'react-player/lazy'


function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  useEffect(() => {
    // if [] , run once when the row loads , and don;t run again
    async function fetchData() {
      console.log(fetchUrl);
      if(fetchUrl){
        const request = await axios.get(fetchUrl);
        setMovies(request.data);
        console.log(request);
        return request;
      }
    }
    fetchData();
  }, [fetchUrl]);

  console.log(movies);
  console.log(process.env.REACT_APP_BASE_URL);
  console.log(process.env.REACT_APP_SERVER_URL);
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  const handleClick = (movie) => {
      setTrailerUrl(movie.trailer_url);
  }
  return (
    <div className="row">
      <h2>{title}</h2>

      < div className = "cards row_posters" >
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
             className={`row_poster  card ${isLargeRow && "row_posterLarge"}`}
            src = {
              `${isLargeRow ? movie.poster_portrait_url : movie.poster_landscape_url}`
            }
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && < ReactPlayer  
          url={`${trailerUrl}`} 
          height = "390px"
          playing= {true}
      />}
    </div>
  );
}

export default Row