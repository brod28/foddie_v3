import React, { Component } from 'react';
import VendorLogo from '../../Helpers/VendorLogo'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


class PhotoLinks extends Component {
  
    constructor(props) {
      super(props);
      
      this.state = {
        photos: this.props.photos
      }
    }
    render() {
        return (
            <div id="photos_links_ancor" className="photos_links">
              {this.state.photos.map(photo=> 
                <div>
                    <a href={photo.photos.url} target="_blank">
                      {photo.photos.text} <VendorLogo source={photo.source}/>
                    </a>
                </div>
              
              )}
            </div>
          
      )
    }
  }
  export default PhotoLinks;
  