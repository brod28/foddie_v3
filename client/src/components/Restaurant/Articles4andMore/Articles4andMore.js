import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import VendorLogo from '../../Helpers/VendorLogo'
import HeaderForPopup from '../../Header/HeaderForPopup'

class Articles4andMore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      number_of_more: this.props.articles.length - 4,
      review_article: this.props.articles.slice(0, 4)
    }
  }

  render() {
    let _this=this;
    let add_more=()=>{
      _this.setState({
        number_of_more: this.props.articles.length - 4,
        review_article: this.props.articles,
        andmore:true
      });
    }
    let remove_more=()=>{
      _this.setState({
        number_of_more: this.props.articles.length - 4,
        review_article: this.props.articles.slice(0, 4),
        andmore:false
      });
    }

    let fullClass='';
    if(this.state.andmore){
      fullClass='popup';
    }

    return (
      <div className={fullClass}>
      <div id="articles_ancor" className="articles_4_and_more">

      
        {this.state.review_article.map(article =>
        
        <div className="articles_4">
          <ul>
            <il>
              {article.review_article.summary.substring(0, 202) + "   ..."}
            </il>
            <il className="logo">
              <VendorLogo source={article.source}/>
              <p>
              {article.review_article.url?
              <a href={article.review_article.url} target="_blank">
                click here to read the article
              </a>
              :
                ''
                }
              </p>
            </il>
          </ul>
            <p>

            </p>
            </div>
        )}
        {this.state.number_of_more > 0 ?
          <div className="and_more">
            {!this.state.andmore ?

              <p>
                <div className="clickable" onClick={add_more}>
                   <strong> another {this.state.number_of_more} articles >>> </strong>
                </div>
              </p>
              :
              <HeaderForPopup name="Articles :TODO" back={remove_more}/>

            }
          </div>
          :
          ''
        }
      </div>
      </div>
    )
  }
}


export default Articles4andMore;
