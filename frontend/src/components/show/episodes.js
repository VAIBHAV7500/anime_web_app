import React, { Component } from 'react'
import InfiniteScroll from "react-infinite-scroll-component";
import {getEpisodeList} from '../../utils/api';

const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
};

export class episodes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: []
        }
    }

    async componentDidMount(){
        const res = await getEpisodeList();
        console.log(res.data);
        this.setState({
            items: res.data
        })
    } 

    fetchMoreData = () => {
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
        getEpisodeList().then((res)=>{
            this.setState({
                items: this.state.items.concat(res.data)
            });
        });
    };

    reverseData = () => {
        console.log('In Reverse')
        this.setState({
            items: this.state.items.reverse()
        });
    }

    render() {
        return (
            <div>
                <h1>demo: react-infinite-scroll-component</h1>
                <button onClick={this.reverseData}>Reverse</button>
            {this.state.items ? <InfiniteScroll
                dataLength={this.state.items.length}
                next={this.fetchMoreData}
                hasMore={true}
                loader={<h4>Loading...</h4>}
                >
                {this.state.items[0]}
            </InfiniteScroll> : ''}
            </div>
        )
    }
}

export default episodes
