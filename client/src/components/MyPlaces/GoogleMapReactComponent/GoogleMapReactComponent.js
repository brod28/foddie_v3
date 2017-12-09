import React, { PureComponent } from 'react';
import GoogleMapReact from 'google-map-react';

import './style.styl';



const AnyReactComponent = ({ text }) => <div>{text}</div>;

class GoogleMapReactComponent extends PureComponent {

  render() {
    let CustomMarker = ({ text }) => <div className={"custom-marker"}><p>{text}</p></div>;
    
    let GoogleMapsMarkers = this.props.locations_data.map(location => (
      <CustomMarker
        key={"marker_"+location.name}
        lat={location.location.lat}
        lng={location.location.lng}
        text={location.name}
      />
    ));
    
    return (
      <GoogleMapReact
        defaultCenter={[this.props.locations_data[0].location.lat,this.props.locations_data[0].location.lng]}
        defaultZoom={12}
        bootstrapURLKeys={{
          key: "AIzaSyDvPk7IVCdmEVXDHF9urU9DEB-FYnTpkcE",
          language: 'en'
        }}>
      {GoogleMapsMarkers}
      </GoogleMapReact>
    );
  }
}

export default GoogleMapReactComponent;