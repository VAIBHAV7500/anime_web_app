import React, { Component } from 'react';
import Pace from 'react-pace-progress';
import Banner from './banner';
import Info from './info';
import Nav from '../services/Nav';
import requests from '../../utils/requests';
import axios from '../../utils/axios';
import styles from './show.module.css';
import Episodes from './episodes';
import Characters from './characters';
import Review from './review';
import Similar from './similar';
import { connect } from 'react-redux';


class show extends Component {

  toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }

  setDataCache = (index,data) => {
    if(this.state){
      switch(index){
        case 0:
          this.state.episodes = data;
          break;
        case 1:
          this.state.characters = data;
          break;
        case 2:
          this.state.reviews = data;
          break;
        case 3:
          this.state.similar = data;
          break; 
        default:
          break;
      }
      this.setState(this.state);
    }
  }

  navItems = [{
      title: 'Episodes',
      component: <Episodes show_id={this.props.match.params.id} setState = {this.setDataCache} prev = {this?.state?.episodes} toastConfig = {this.toastConfig}/>
    },
    {
      title: 'Characters',
      component: <Characters show_id={this.props.match.params.id} setState = {this.setDataCache} prev = {this?.state?.characters} toastConfig = {this.toastConfig}/>
    },
    {
      title: 'Reviews',
      component: <Review show_id={this.props.match.params.id} setState = {this.setDataCache} prev = {this?.state?.reviews} toastConfig = {this.toastConfig}/> 
    },
    {
      title: 'Similar Shows & Movies',
      component: <Similar show_id={this.props.match.params.id} setState = {this.setDataCache} prev = {this?.state?.similar} toastConfig = {this.toastConfig}/>
    }
  ] ;

    fetchData = async () => {
      if(this.props.user_id){
        const showId = this.props.match.params.id
        const promiseArray = [];
        this.setState({
            show_id: showId,
            nav_id: 0,
            loading:true
        });
        promiseArray.push(new Promise((res, rej) => {
            axios.get(`${requests.fetchShowDetails}?id=${showId}&user_id=${this.props.user_id}`).then((result) => {
                res(result);
            }).catch((err) => {
                rej(err)
            });
        }));
        const results = await Promise.all(promiseArray);
        const states = {
            show: results[0].data,
            nav_id: 0,
            show_id: showId,
            loading:false,
        };
        this.setState(states);
      }
    }
    async componentDidMount(){ 
      window.scrollTo(0, 0);
      this.fetchData();
    }

    async componentDidUpdate(prevProps) {
      if(this.props.user_id != prevProps.user_id){
        this.fetchData();
      }
      if (this.props.match.params.id !== prevProps.match.params.id ) {
            window.scrollTo(0, 0);
            this.fetchData();
        }
    }

    async componentWillUnmount(){
      this.setState({});
    }

    selectNav = (id) =>{
        this.setState(prevState=>({
            ...prevState,
            nav_id : id
        }));
    }
    
    render() {
        return (
            <div className={styles.show}>
                {
                  this.state?.loading && <Pace 
                    color="#641ba8"
                    height = {10}
                    />
                }
                <Nav/>
                <Banner movie = {this.state?.show}/>
                <Info movie = {this.state?.show} className={styles.info}/>
                <br className={styles.break}/>
                <div className={`${styles.sub_nav} ${styles.noselect}`}>
                    {
                        this.navItems.map((x, index) =>{
                            return <div  key ={index} className= {`${styles.sub_item} ${styles.neumorphism} ${this.state?.nav_id === index ? styles.sub_item_active:""}`} onClick={()=>{this.selectNav(index)}}> {x.title} </div>
                        })
                    }
                </div>
                {this.navItems[this.state?.nav_id || 0]?.component}
                
            </div>
        )
    }
}

const mapStatetoProps = (state) => {
  return {
    user_id : state.user_id,
  }
}

export default connect(mapStatetoProps)(show);
