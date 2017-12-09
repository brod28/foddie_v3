import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

class HeaderForPopup extends Component {
    constructor(props) {
        super(props);
        this.state={
            name:this.props.name,
            back:this.props.back,
            url:this.props.url
        };
    }

    render() {
        return (
            <div className="header">
                <span onClick={this.state.back}>
                {this.state.back?
                    "<< BACK"
                    :
                    ''
                }
                
                </span>

                <span className="name">
                    {this.state.name}
                </span>
            </div>
        )
    }
}
export default HeaderForPopup;
