import React, { useState , useEffect } from 'react'
import axios from '../../utils/axios';
import "./Row.css";
import movieTrailer from "movie-trailer";
import ReactPlayer from 'react-player/lazy'


function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailer, setTrailer] = useState("");
  let keyId = 1;
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
      console.log(JSON.stringify(movie));
      movie.rating = 1.4;
      //movie.name = 'Lorem Ipsum Some dummy long name'
      setTrailer(movie);
  }
  return (
    <div className="row">
      <h2>{title}</h2>

      < div className = "cards row_posters" >
        {movies.map((movie) => (
          <img
            key={keyId++}
            onClick={() => handleClick(movie)}
             className={`row_poster  card ${isLargeRow && "row_posterLarge"}`}
            src = {
              `${isLargeRow ? movie.poster_portrait_url : movie.poster_landscape_url}`
            }
            alt={movie.name}
          />
        ))}
      </div>
      {
          trailer && <div className="trailer_window">
          < ReactPlayer  
            url={`${trailer.trailer_url}`} 
            height = "390px"
            playing= {true}
            className="player"
          />
          <div className="info"> 
            <div className="trailer_name">{trailer.name}</div><br/>
            <table className="info_table">
                <tr className="trailer_row">
                  <td>
                      Season: 
                  </td>
                  <td className="season">
                      {trailer.season}
                  </td>
                </tr>
                < tr className = "trailer_row" >
                  <td>
                    Rating: 
                  </td>
                  < td  >
                    <div className = {
                    `rating rating_${Math.ceil(trailer.rating/3)}`
                  }>{trailer.rating}/10</div>
                  </td>
                </tr>
                <tr className="trailer_row">
                  <td>
                      Genre: 
                  </td>
                  <td className="genre">
                      {trailer.genre || 'Comedy, Adventure, Mystery, Thriller'}
                  </td>
                </tr>
                <tr className="trailer_row">
                  <td>
                      Description: 
                  </td>
                  { trailer.description != '' && <td className="description">
                      {
                        trailer.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500 s, when an unknown printer..."}
                  </td> }
                </tr>
            </table>
            < button className = "trailer_btn" > Go to Show
            </button>
            < button className = "trailer_btn" > Add to List
            </button>
          </div>
        </div>
      }
    </div>
  );
}

export default Row