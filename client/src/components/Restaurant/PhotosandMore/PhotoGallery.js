import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class PhotoGallery extends Component {

  constructor(props) {
    super(props);
    let photos = this.props.photos.slice();
    this.state = {
      first_photo: photos.shift(),
      photos: photos
    }
  }
  render() {
    return (
      <div id="myCarousel" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
          <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
          {this.state.photos.map((photo,index) =>
            <li data-target="#myCarousel" data-slide-to={index+1}></li>
          )}
        </ol>

        <div class="carousel-inner">
          <div class="item active">
            <img src={this.state.first_photo.url} />
          </div>
          {this.state.photos.map(photo =>
            <div class="item">
              <img src={photo.url} />
            </div>
          )}
        </div>

        <a class="left carousel-control" href="#myCarousel" data-slide="prev">
          <span class="glyphicon glyphicon-chevron-left"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="right carousel-control" href="#myCarousel" data-slide="next">
          <span class="glyphicon glyphicon-chevron-right"></span>
          <span class="sr-only">Next</span>
        </a>
       
      </div>
    )
  }
}
export default PhotoGallery;
