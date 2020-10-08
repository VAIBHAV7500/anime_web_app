import React, { Component } from 'react'
import styles from './index.module.css';
import constants from '../../constants';
export default class browse extends Component {
    componentDidMount = () => {
        this.state = {
            genre_arr: [],
            episode_arr: [],
            score_arr: [],
            type_arr: [],
            age_category_arr: []
        }
        this.setState(this.state);
    }

    toggler = (e,arr_type,oneElement=false)=>{
        let arr = this.state[arr_type] || [];
        if(arr.indexOf(e.target.value) !==-1){
            arr = arr.filter(x => x !== e.target.value);
        }else{
            if(oneElement){
                arr = [];
            }
            arr.push(e.target.value);
        }
        this.state[arr_type] = arr;
        this.setState(this.state);
    }

    filterRow(type,arr,data,styleClass,oneElement=false){
        let btnArr = []
        {data.forEach((element,index) => {
        btnArr.push(<button key={"type"+index} onClick={(e)=>{this.toggler(e,arr,oneElement)}} value={element} className={`${styleClass} ${styles.filter_button } ${styles.neumorphism} ${ this.state &&  this?.state[arr] && this?.state[arr].indexOf(element) !== -1 ? styles.filter_button_active : ''}`}>{element}</button>)
        })}
        return (
            <div className={styles.filter_row}>   
                Filter By {type} :
                <div className={styles.filter_row_wrapper}>
                    {btnArr}
                </div>
            </div>
        )
    }
    filter = ()=>{
        this.props.onChange(false);
        console.log("genre Array");
        console.log(this.genre_arr);
        console.log("Score Array");
        console.log(this.score_arr);
        console.log("Type Array");
        console.log(this.type_arr);
        console.log("Episode No Array");
        console.log(this.episodeNo_arr);
        console.log("Age Category Array");
        console.log(this.age_category_arr);
    }

    render() {
        
        return (
             <div className={`${styles.filterBar} ${styles.neumorphism}`}>
                <div className={`${styles.container} ${styles.make_flex}`}>
                    <div className={styles.left_filter_column}>
                        {this.filterRow("Genres",this.genreArr,constants.genres,`${styles.genre}`)}
                    </div>
                    <div className={styles.right_filter_column}>
                        {this.filterRow("Minimum Episode",'episode_arr',constants.minimum_episodes,'',true)}
                        {this.filterRow("Minimum Rating",'score_arr',constants.scores,'',true)}
                        {this.filterRow("Types",'type_arr',constants.types)}
                        {this.filterRow("Age Category",'age_category_arr',constants.age_categories)}
                    </div>
                </div>
                <button className={`${styles.filter_submit_button} ${styles.filter_button_active} ${styles.filter_button}`} onClick={this.filter}>Submit</button>
             </div>
        )
    }
}


//  {/*

//                 To Do

//                 Search
//             1) Character
//             2) Season
//             3) Title

//                 Filter
//              1) Genre
//              2) Episode Limit
//              3) Score
//              4) Type ( series || Movies || OVA'S and related)
//              5) Age Category
//              6) PRODUCTION HOUSE ETC.

//                 Sort
//              1) Release Date
//              2) Popularity (Higest Rating First)
//              3) name A-Z (asc)

//              */}

//              {/*


//                 1) SHOW ALL CARD ON MAIN SCREEN
//                 2) SEARCH GENRE SEARCH ANIME APPLY FILTER TOP RIGHT  A APANEL THAT OPERATE FILTER  IT SHOULD BE MODAL I GUESS  NON ON MODAL DIRECT AEK BOX USKE NICHE SE ANIME SHOW KRENGE OR FIR DATATABSE SE UPDATED LIST DENTGE FILTER COMPLETE K BAAD

//              */}