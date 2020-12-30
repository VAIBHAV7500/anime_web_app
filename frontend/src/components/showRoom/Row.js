import React, { useEffect, useState } from 'react'
import "./Row.css";
import ReactPlayer from 'react-player/lazy';
import { MdClose, MdPlayCircleOutline, MdTv } from "react-icons/md";
import {useHistory} from "react-router-dom";
import { FaAngleDoubleDown, FaAngleLeft, FaAngleRight, FaTimes, FaYoutube} from 'react-icons/fa';

let prevIndex;

function Row({ title, movies, isLargeRow, rowIndex,trailerArray, showIndexArray }) {
  const [trailer, setTrailer] = trailerArray;
  const [showIndex,setShowIndex] = showIndexArray;
  const [showTrailer, setShowTrailer] = useState(false);
  const history = useHistory();
  let keyId = 1;
  let curTimeOut;
  const handleClick = (movie,index) => {  
      movie.rating = Math.round(((Math.random() * (10 - 8 + 1)) + 8) * 9) / 10;
      let description = movie.description;
      let truncLength = window.screen.availWidth < 520 ? 200 : 400;
      if(description.length > truncLength){
          description = description.substring(0,truncLength) + '...';
      }
      movie.description = description;
      console.log(movie);
      setTrailer({...movie,index : `${rowIndex}-${index}`});
      trailerShow(index);
  }

  const goToVideo = (trailer) => {
    history.push(`/show/${trailer.id}`);
  }

  const slide = (e,direction) => {
    let slider = document.querySelector(`[rowindex="${rowIndex}"]`);
    if(direction === "left")
      slider.scrollBy(-1000,0);
    else
      slider.scrollBy(1000,0); 
  }

  useEffect(() => {
    if(showIndex !== prevIndex){
      let el = document.querySelector(`[index="${showIndex.prev}"]`);
      if(el)
      el.classList.remove("show_trailer");
      if(showIndex.current === showIndex.prev && showIndex.current!="" && showIndex.prev!=""){
        trailerRemove();
        setTimeout(()=>{
          setShowIndex({current : "" , prev : ""});
          setTrailer(undefined);
        },500);
      }
      prevIndex = showIndex;
    }
  }, [showIndex])

  const trailerRemove = () => {
    let el = document.querySelector(`[index="${showIndex.current}"]`);
    if(el)
    el.classList.remove("show_trailer");
  }
  
  const trailerShow = (index) => {
    let prevIndex = showIndex.current;
    setShowTrailer(true);
    setShowIndex({
      current : `${rowIndex}-${index}`,
      prev : prevIndex
    });
    let el = document.querySelector(`[index="${rowIndex}-${index}"]`);
    el.classList.add("show_trailer");
    setTimeout(()=>{
     const plr =  el.querySelector(".player");
     plr.scrollIntoView({behavior: "smooth", block: "nearest", inline: "center"});
    },300)
  }

  const keys = [{
    "key": "season",
    "title": "Season"
  },{
    "key":"type",
    "title": "type",
  },{
    "key": "total_view",
    "title":"total view",
  },{
    "key":"total_episodes",
    "title": "Total Episodes"
  }];

  const genCardOverlay = (movie,index) => {
    return (
      <div className={`card_overlay ${`${rowIndex}-${index}`=== trailer?.index ? "card_overlay_show" : ""} `}>
        <div className="card_overlay_container">
          <p className="show_name">{movie.name}</p>
          <table className="show_details"> 
            <tbody>
              {Object.keys(movie).map((key,index) => {
                  const containskey = keys.find(x => x.key === key);
                  if(containskey){
                    return (
                      <tr key={index} >
                        <td>{containskey.title}</td>
                        <td className="show_detail_field">{movie[key]}</td>
                      </tr>
                    )
                  } 
              })}
              <tr>
                <td className="card_description" colSpan="2">{movie.description.length > 150 ? movie.description.substring(0,150) + "..." : movie.description }</td>
              </tr>
            </tbody>
          </table>
          <div onClick={() => { handleClick(movie,index)  }} className="card_btn top_overlay_btn">
            {`${rowIndex}-${index}`=== trailer?.index ? <FaTimes/> : <MdTv/>}
            <span>{`${rowIndex}-${index}`=== trailer?.index ? "Close" : "Play"} Trailer</span>
          </div>
          <div onClick={()=>{goToVideo(movie)}} className="card_btn watch_now_btn">
            <MdPlayCircleOutline className="watch_now_icon"/>
            <span>WATCH NOW!</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="row_container">
      <h2 className="row_title">{title}</h2>
      <div className={`row_wrapper`}>
      <div className="slider slider_back" onClick={(e)=>{slide(e,"left")}}>
        <FaAngleLeft/>
      </div>
      <div className="slider slider_front" onClick={(e)=>{slide(e,"right")}}>
      <FaAngleRight/>
      </div>
      <div rowindex={rowIndex} className="row">
        <div className = "cards row_posters" >
          {movies && movies.map((movie,index) => (
            <div key={index} index={`${rowIndex}-${index}`} className={`card_wrapper`}>
              <div name={movie.name} className={`card_div`}>
                {genCardOverlay(movie,index)}
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
              {
                `${rowIndex}-${index}`=== trailer?.index &&
                <ReactPlayer  
                  url={`${trailer?.trailer_url}`} 
                  width="500px"
                  height="100%"
                  playing= {true}
                  className="player"
                />
              }
            </div>
          ))}
          
        </div>
      </div>
    </div>
    </div>
  );
}

export default Row