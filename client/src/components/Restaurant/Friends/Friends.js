import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: this.props.friends
        }
    }
    componentDidMount() {
    }

    render() {
        return (
            (
                <div>
                    {this.state.friends.map(friend =>
                        <div><a href={friend.review_friends.link} target="_blank">check if your friends visited here>>></a> </div>
                    )}
                </div>

            )
        )
    }
}
export default Friends;
