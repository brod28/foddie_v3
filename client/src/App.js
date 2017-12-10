import React, { Component } from 'react';
import SearchResult from './components/SearchResult/SearchResult';
import Restaurant from './components/Restaurant/Restaurant';
import MyPlaces from './components/MyPlaces/MyPlaces';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { restaurants: [] }
  }

  render() {
     

    return (
      
      <Router>
        <div className="App">
          <Route path="/myplaces/:places" render={({ match }) => (
            <MyPlaces places={match.params.places}/>
          )} />
          <Route exact path="/myplaces" render={({ match }) => (
            <MyPlaces />
          )} />
          <Route path="/search/:name" render={({ match }) => (
            <SearchResult name={match.params.name}>
            </SearchResult>
          )} />
          <Route path="/restaurant/:name" render={({ match }) => (
            <Restaurant name={match.params.name}>
            </Restaurant>
          )} />
        </div>
      </Router>
    );
  }
}

export default App;
