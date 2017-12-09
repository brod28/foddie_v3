import React, { Component } from 'react';
import GoogleMapReactComponent from './GoogleMapReactComponent/GoogleMapReactComponent'
class MyPlaces extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let restaurants = <p>no restaurants</p>
        let restaurants_data = [];
        if (localStorage.save_restaurants && localStorage.save_restaurants != '') {
            restaurants_data = JSON.parse(localStorage.save_restaurants);
        }
        if (restaurants_data.length>0) {
            restaurants =
                <div className="map_page">
                    <div>
                        <div  >
                            {restaurants_data.map(restaurant =>
                                <div key={restaurant.description}>
                                    <div>
                                        <a href={"/restaurant/" + restaurant.description} target="_blank">{restaurant.description}</a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="map_container">
                            <GoogleMapReactComponent locations_data={restaurants_data} />
                        </div>
                    </div>
                </div>

        }
        return (
            restaurants 
        );
    }
}

export default MyPlaces;
