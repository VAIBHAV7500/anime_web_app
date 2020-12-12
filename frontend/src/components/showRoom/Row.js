import React, { useEffect, useState } from 'react'
import "./Row.css";
import ReactPlayer from 'react-player/lazy';
import { MdClose, MdPlayCircleOutline } from "react-icons/md";
import {useHistory} from "react-router-dom";
import { FaAngleDoubleDown, FaAngleLeft, FaAngleRight} from 'react-icons/fa';

function Row({ title, movies, isLargeRow, rowIndex,trailerArray, showIndexArray }) {
  const [trailer, setTrailer] = trailerArray;
  const history = useHistory();
  let keyId = 1;
  let curTimeOut;
  const [showIndex,setShowIndex] = showIndexArray;
  const handleClick = (movie,index) => {  
      movie.rating = Math.round(((Math.random() * (10 - 8 + 1)) + 8) * 9) / 10;
      let description = movie.description;
      let truncLength = window.screen.availWidth < 520 ? 200 : 400;
      if(description.length > truncLength){
          description = description.substring(0,truncLength) + '...';
      }
      movie.description = description;
      setTrailer({...movie,index : rowIndex});
      tiltDiv(index);   
  }

  const goToVideo = (trailer) => {
    history.push(`/show/${trailer.id}`);
  }

  const handleSlider = (e) => {
    let slide = e.target.closest('.cards');
    slide.scrollBy(1000,0); 
  }

  const handleSliderBack = (e) => {
    let slide = e.target.closest('.cards');
    slide.scrollBy(-1000,0);
  }

  useEffect(() => {
    let el = document.querySelector(`[index="${showIndex.prev}"]`);
    if(el)
    el.classList.remove("card_div_tilt");
    if(showIndex.current === showIndex.prev && showIndex.current!="" && showIndex.prev!=""){
      setShowIndex({current : "" , prev : ""});
      setTrailer(undefined);
    }
  }, [showIndex])

  const currentTiltRemove = () => {
    let el = document.querySelector(`[index="${showIndex.current}"]`);
    if(el)
    el.classList.remove("card_div_tilt");
  }
  
  const tiltDiv = (index) => {
    let prevIndex = showIndex.current;
    setShowIndex({
      current : `${rowIndex}-${index}`,
      prev : prevIndex
    });
    let el = document.querySelector(`[index="${rowIndex}-${index}"]`);
    el.classList.add("card_div_tilt");
  }

  return (
    <div>
      <div className="row">
        <h2>{title}</h2>
        < div className = "cards row_posters" >
          <div className="slider slider_back" onClick={handleSliderBack}>
            <FaAngleLeft/>
          </div>
          {movies && movies.map((movie,index) => (
            <div key={index} index={`${rowIndex}-${index}`} name={movie.name} className={`card_div`}>
              <MdPlayCircleOutline className="play_icon" onClick={()=>{goToVideo(movie)}}></MdPlayCircleOutline>
              <div className="box-shadow"></div>
              <FaAngleDoubleDown onClick={() => handleClick(movie,index)} className={`see_more`}></FaAngleDoubleDown>
              <p className="show_name">{movie.name}</p>
              <img
                loading="lazy"
                draggable="false"
                key={keyId++}
                onClick={()=>{goToVideo(movie)}}
                className={`row_poster  card ${isLargeRow && "row_posterLarge"}`}
                src = {
                  `${isLargeRow ? movie.poster_portrait_url.replace('medium','large') : movie.poster_landscape_url}`
                }
                alt={movie.name}
              />
            </div>
          ))}
          <div className="slider slider_front" onClick={handleSlider}>
            <FaAngleRight/>
          </div>
        </div>
      </div>
      {
          window.screen.availWidth > 514 ?( trailer && rowIndex==trailer.index && <div className="trailer_window" id="trailer_window">
          < MdClose className = "close-btn" onClick={()=>{setTrailer(undefined);currentTiltRemove();setShowIndex({prev : "",current : ""})}}/>
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
                        {trailer.genres?.join(', ') || 'Comedy, Adventure, Mystery, Thriller'}
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