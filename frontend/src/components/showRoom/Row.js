import React, { useState } from 'react'
import "./Row.css";
import ReactPlayer from 'react-player/lazy';
import { MdClose } from "react-icons/md";
import {useHistory} from "react-router-dom";



function Row({ title, movies, isLargeRow }) {
  const [trailer, setTrailer] = useState("");
  const history = useHistory();
  let keyId = 1;
  const handleClick = (movie) => {
      movie.rating = Math.round(((Math.random() * (10 - 8 + 1)) + 8) * 9) / 10;
      let description = movie.description;
      let truncLength = window.screen.availWidth < 520 ? 200 : 400;
      if(description.length > truncLength){
          description = description.substring(0,truncLength) + '...';
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
        {movies && movies.map((movie) => (
          <img
            draggable="false"
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
          window.screen.availWidth > 514 ?( trailer && <div className="trailer_window">
          < MdClose className = "close-btn" onClick={()=>{setTrailer(undefined)}}/>
          < ReactPlayer  
            url={`${trailer.trailer_url}`} 
            height = "390px"
            width = "640px"
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
                          trailer.description}
                    </td> }
                  </tr>
                </tbody>
            </table>
            < button className = "trailer_btn neumorphism"  onClick={()=>{goToVideo(trailer)}}>Go to Show
            </button>
            < button className = "trailer_btn" > Add to WatchList
            </button>
          </div>
        </div>) : trailer && goToVideo(trailer) 
      }
    </div>
  );
}

export default Row