import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

class SaveRestaurant extends Component {
    constructor(props) {
        super(props);
        this.setRestaurants(this.getRestaurants() || []);
    }


    indexOfRestaurant(name){
        let index=-1;
        this.getRestaurants().forEach(function(element,i) {
            if(element.name==name){
                index=i;
            }
        });
        return index
    }
    setRestaurants(object){
        localStorage.save_restaurants=JSON.stringify(object)
    }
    getRestaurants(){
        let retVal;
        if(localStorage.save_restaurants && localStorage.save_restaurants!=''){
            retVal= JSON.parse(localStorage.save_restaurants);
        }
        return retVal;
    }


    render() {
        let _this=this;
        let save=()=>{
            let new_restaurant=_this.getRestaurants();
            new_restaurant.push(_this.props.restaurant);
            _this.setRestaurants(new_restaurant);
            _this.forceUpdate();
        }
        let unsave=()=>{
            let new_restaurant=_this.getRestaurants()
            new_restaurant.splice(_this.indexOfRestaurant(_this.props.restaurant.name), 1);
            _this.setRestaurants(new_restaurant);
            _this.forceUpdate();
        }
        let save_render;
        if (typeof(Storage) !== "undefined") {
            if(this.indexOfRestaurant(this.props.restaurant.name)==-1){
                save_render=<div  onClick={save}>
                    <span className="clickable"> click to save >>> </span>
                </div>

            }
            else{
                save_render=<div  onClick={unsave}>
                    <span className="clickable"> click to unsave >>> </span>
                </div>
        }
        } 
        
        return (
            (
                <div>
                    <p>
                        {this.props.restaurant.name}
                    </p>
                    {save_render}
                </div>

            )
        )
    }
}
export default SaveRestaurant;
