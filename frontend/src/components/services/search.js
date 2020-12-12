import React, { useEffect, useState } from 'react'
import { FaSlidersH, FaTimes } from 'react-icons/fa';
import {useHistory} from "react-router-dom";
import styles from './search.module.css'
import Filter from './filter'
import { closeModal } from './modalGenerator';
import requests from '../../utils/requests';
import axios from '../../utils/axios';

const Search = (props) => {
    const [filter,setFilter] = useState(false);
    const [search,setSearch] = props.searchHook;
    const [searchSet, setSearchSet] = useState([]);
    const history = useHistory();
    const searchTime=0.5;
    let searchTimeout;
    useEffect(() => {
        if(search === true){
            document.querySelector("." + styles.search_input).focus();
            document.body.style.overflow="hidden";
        }else{
            document.body.style.overflow="auto";
            setFilter(false);
            document.querySelector("." + styles.search_input).value="";
            setSearchSet([]);
        }
    },[search])

    const getSuggestions = async (fiter = false,data) => {
        const word = document.getElementsByClassName(styles.search_input)[0].value;
        let baseUrl = requests.fetchSuggestions;
        let body = {};
        if(word){
            body = {
                key: word,
            }
        }
        if(filter){
            baseUrl += '?filter=true';
            body = Object.assign(body,data);
        }
        let request = await axios.post(baseUrl, body);
        setSearchSet(request.data);
    }

    const getData = (data)=>{
        getSuggestions(true,data);
    }

    const goToShow = (e,id) => {
        closeModal(e,"searchModal",setSearch,true);
        history.push(`/show/${id}`);
    }

    return (
        <div className={`${styles.search_container}`}>
            <FaTimes 
                className={`${styles.close_search_icon}`} 
                onClick={(e)=>{
                    closeModal(e,"searchModal",setSearch,true);
                }}
            />
            <div className={`${styles.search_group} ${styles.slide_in_top}`}>
                <input placeholder="Search" className={`${styles.search_input}`} onChange={()=>{
                    if(searchTimeout)
                        clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(()=>{
                        getSuggestions();
                    },searchTime * 1000)
                }}></input>
                <FaSlidersH 
                    className={`${styles.filter_icon}`}
                    onClick={() => {
                        setFilter(!filter);
                    }} 
                />
            </div>
            <div className={`${styles.filter_container} ${filter ? styles.show_filter : ""}`}>
                <Filter showFilter={setFilter} submit={getData} />
            </div>
            <div className={`${styles.suggestion_box}`}>
                {searchSet?.map((suggestion_card,index) => (
                    <div key={index} className={`${styles.suggestion_card}`}>
                        <img 
                            alt={suggestion_card.name} 
                            src={suggestion_card.poster_portrait_url}
                            onClick={(e)=>{goToShow(e,suggestion_card.id)}}
                            className={`${styles.suggestion_card_image}`} 
                        />
                        <span className={`${styles.suggestion_card_name}`}>{suggestion_card.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Search;
