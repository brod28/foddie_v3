import React, { Component } from 'react';
import GoogleMapReactComponent from './GoogleMapReactComponent/GoogleMapReactComponent'
class MyPlaces extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let restaurants = <p>no restaurants</p>
        let restaurants_data;
        if (localStorage.save_restaurants != '') {
            restaurants_data = JSON.parse(localStorage.save_restaurants);
        }
        if (restaurants_data) {
            restaurants =
                <div class="container">
                    {restaurants_data.map(restaurant =>
                        <div class="row">
                            <div class="col-6">
                                {restaurant.description}
                            </div>
                        </div>
                    )}
                </div>
                    
        }
        return (
            <div>
                {restaurants}
                <GoogleMapReactComponent locations_data={restaurants_data}/>
            </div>
        );
    }
}

export default MyPlaces;
