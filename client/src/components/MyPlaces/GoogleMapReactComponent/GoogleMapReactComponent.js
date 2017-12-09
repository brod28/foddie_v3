import React, { PureComponent } from 'react';
import GoogleMapReact from 'google-map-react';

import './style.styl';


const CustomMarker = ({ text }) => <div className="custom-marker"><p>{text}</p></div>;

class GoogleMapReactComponent extends PureComponent {
  render() {
    const GoogleMapsMarkers = this.props.locations_data.map(location => (
      <CustomMarker
        key={`marker_${location.name}`}
        lat={location.location.lat}
        lng={location.location.lng}
        text={location.name}
      />
    ));

    return (
      <GoogleMapReact
        defaultCenter={[this.props.locations_data[0].location.lat,this.props.locations_data[0].location.lng]}
        defaultZoom="10"
        layerTypes={['TrafficLayer', 'TransitLayer']}
        bootstrapURLKeys={{
          key: "AIzaSyAh11iZaQSh0ycJjXsE2nm5784LkzyMA_A",
          language: 'en'
        }}
      >
        {GoogleMapsMarkers}
      </GoogleMapReact>
    );
  }
}

export default GoogleMapReactComponent;