import React, { Component } from 'react';
import SaveRestaurant from '../Helpers/SaveRestaurant/SaveRestaurant'
import CustomComponent from '../Helpers/CustomComponent'
import GoogleMapReactComponent from './GoogleMapReactComponent/GoogleMapReactComponent'
class MyPlaces extends CustomComponent {
    to_share=[];
    constructor(props) {
        super(props);
    }

    compress(locations) {
        var retVal = '';
        locations.forEach(function (element) {
            retVal = retVal + element.name + "|" + element.location.lat + "|" + element.location.lng+"|" + element.description + "||";
        });
        return retVal;
    }
    decompress(locations) { 
        var retVal = [];
        locations.split('||').forEach(function (element) {
            if (element != '') {
                let element1 = element.split('|');
                retVal.push({
                    name: element1[0],
                    description: element1[3],
                    location: {
                        lat: parseFloat(element1[1]),
                        lng: parseFloat(element1[2])
                    }
                });
            }
        });
        return retVal;
    }
    render() {
        let _this=this;
        let addShare=location=>{
            _this.to_share.push(location);
        }
        let share=location=>{
            alert('http://localhost:3000/myplaces/'+_this.compress(_this.to_share));
        }
        let restaurants = <p>no restaurants</p>
        let restaurants_data = [];
        if (this.props.places && this.props.places != '') {
            restaurants_data = this.decompress(this.props.places);
        }
        if (restaurants_data.length == 0 && localStorage.save_restaurants && localStorage.save_restaurants != '') {
            restaurants_data = JSON.parse(localStorage.save_restaurants);
            if (restaurants_data.length > 0) {
                console.log(this.compress(restaurants_data));
            }
        }
        if (restaurants_data.length > 0) {
            restaurants_data.forEach(restaurant=>{
                restaurant.share=()=>{
                    addShare(restaurant);
                }
                
            })
            restaurants =
                <div className="map_page">
                    <div>
                        <div  >
                            {restaurants_data.map(restaurant =>
                                <div key={restaurant.name}>
                                    <div>
                                        <input type="checkbox" onClick={restaurant.share}/>
                                    </div>
                                    <div>
                                        <a href={"/restaurant/" + restaurant.description} target="_blank">{restaurant.name}</a>
                                    </div>
                                    <div>
                                        <SaveRestaurant restaurant={restaurant} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <button onClick={share}>share</button>
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
