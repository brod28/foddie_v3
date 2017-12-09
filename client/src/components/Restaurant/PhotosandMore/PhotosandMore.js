import React, { Component } from 'react';
import PhotoLinks from './PhotoLinks'
import PhotoGallery from './PhotoGallery'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class PhotosandMore extends Component {
  
    constructor(props) {
      super(props);
      let photos_internal=[];
      let photos_external=[];
      this.props.photos.forEach(function(photo){
          if(photo.photos.url){
              photos_external.push(photo);
          } 
          if(photo.photos.photos){
            photo.photos.photos.forEach(function(photo){
              photos_internal.push(photo);
            });
          }
      })
      this.state = {
        number_of_more: 0,
        photos_internal: photos_internal,
        photos_external:photos_external,
        andmore:false
      }
    }
    render() {
      let _this=this;
      let add_more=()=>{
        _this.setState({
          number_of_more: this.props.photos.length - 4,
          photos: this.props.photos,
          andmore:true
        });
      }
      let remove_more=()=>{
        _this.setState({
          number_of_more: this.props.photos.length - 4,
          photos: this.props.photos.slice(0, 4),
          andmore:false
        });
      }
      let fullClass='';
      if(this.state.andmore){
        fullClass='popup';
      }
      let photos_internal=''
      if(this.state.photos_internal.length>0){
        photos_internal=<PhotoGallery photos={this.state.photos_internal}/>
      }
      let photos_external=''
      if(this.state.photos_external.length>0){
        photos_external=<PhotoLinks photos={this.state.photos_external}/>
      }
        return (
          <div className={fullClass}>
            <div id="photos_ancor" className="photos_and_more">
              {photos_internal}
              {photos_external} 
            </div>
          </div>
          
      )
    }
  }
  export default PhotosandMore;
  