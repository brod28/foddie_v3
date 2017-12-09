import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import HeaderForPopup from '../../Header/HeaderForPopup'
import VendorLogo from '../../Helpers/VendorLogo'

class Menus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menus: this.props.menus
        }
    }
    componentDidMount() {
    }

    render() {
        return (
            (
                <div id="menus_ancor" className="menus">
                    {this.state.menus.map(menu =>
                        <div>

                            <a href={menu.menu.url} target="_blank">
                                click here to explore 
                                <img  className="menu-icon" src={require('../../../images/menu-icon.png')} />
                                by
                                <VendorLogo source={menu.source}/>

                            </a>
                        </div>

                    )}
                </div>

            )
        )
    }
}
export default Menus;
