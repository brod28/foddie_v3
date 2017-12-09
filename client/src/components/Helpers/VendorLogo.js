import React, { Component } from 'react';

class VendorLogo extends Component {
  constructor(props) {
    super(props);
    this.setState = {
      source: this.props.source
    }
  }
  render() {
    let logo=<p><strong>{this.props.source}</strong></p>
    try{
      let logo_name=this.props.source.replace('www.','').replace('.com','').replace(' ','_').toLowerCase();
      logo=<img className="vendor_logo" src={require('../../images/logos/'+logo_name+'_logo.png')} />      
    }
    catch(e){
      console.log('logo for '+this.props.source+ ' is broken' + e.message);
    }

    return (
      logo
    )
  }
}  

  
  export default VendorLogo;
  