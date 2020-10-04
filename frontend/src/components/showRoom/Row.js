import React, { useState , useEffect } from 'react'
import axios from '../../utils/axios';
import "./Row.css";
import ReactPlayer from 'react-player/lazy';
import { MdClose } from "react-icons/md";
import {useHistory} from "react-router-dom";



function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailer, setTrailer] = useState("");
  const history = useHistory();
  let keyId = 1;
  useEffect(() => {
    // if [] , run once when the row loads , and don;t run again
    async function fetchData() {
      if(fetchUrl){
        const request = await axios.get(fetchUrl);
        setMovies(request.data);
        return request;
      }
    }
    fetchData();
  }, [fetchUrl]);
  const handleClick = (movie) => {
      movie.rating = Math.round(((Math.random() * (10 - 8 + 1)) + 8) * 9) / 10;
      //movie.name = 'Lorem Ipsum Some dummy long name'
      let description = movie.description;
      if(description.length > 400){
          description = description.substring(0,400) + '...';
      }
      movie.description = description;
      setTrailer(movie);
  }

  const goToVideo = (trailer) => {
    history.push(`/show/${trailer.id}`);
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
          < MdClose className = "close-btn" onClick={()=>{setTrailer(undefined)}}/>
          < ReactPlayer  
            url={`${trailer.trailer_url}`} 
            height = "390px"
            playing= {true}
            className="player"
          />
          <div className="info"> 
            <div className="trailer_name">{trailer.name}</div><br/>
            <table className="info_table">
                <tbody>
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
                    { trailer.description !== '' && <td className="description">
                        {
                          trailer.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500 s, when an unknown printer..."}
                    </td> }
                  </tr>
                </tbody>
            </table>
            < button className = "trailer_btn neumorphism"  onClick={()=>{goToVideo(trailer)}}>Go to Show
            </button>
            < button className = "trailer_btn" > Add to WatchList
            </button>
          </div>
        </div>
      }
    </div>
  );
}

export default Row