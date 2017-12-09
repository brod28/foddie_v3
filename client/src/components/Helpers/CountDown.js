import React, { Component } from 'react';

class CountDown extends Component {
    constructor() {
      super();
      this.state = { time: {}, seconds: 15 };
      this.timer = 0;
      this.startTimer = this.startTimer.bind(this);
      this.countDown = this.countDown.bind(this);
    }
  
    secondsToTime(secs){
      let hours = Math.floor(secs / (60 * 60));
  
      let divisor_for_minutes = secs % (60 * 60);
      let minutes = Math.floor(divisor_for_minutes / 60);
  
      let divisor_for_seconds = divisor_for_minutes % 60;
      let seconds = Math.ceil(divisor_for_seconds);
  
      let obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
      };
      return obj;
    }
  
    componentDidMount() {
      let timeLeftVar = this.secondsToTime(this.state.seconds);
      this.setState({ time: timeLeftVar });
      if (this.timer == 0) {
        this.timer = setInterval(this.countDown, 1000);
      }
    }
  
    startTimer() {
      if (this.timer == 0) {
        this.timer = setInterval(this.countDown, 1000);
      }
    }
  
    countDown() {
      // Remove one second, set state so a re-render happens.
      let seconds = this.state.seconds - 1;
      let missed_once=this.state.missed_once;
      // Check if we're at zero.
      if (seconds == 0) { 
        seconds=seconds+10;
        missed_once=true;
      }

      this.setState({
        time: this.secondsToTime(seconds),
        seconds: seconds,
        missed_once:missed_once
      });
      
    }
  
    render() {
      return(
      <div>
        <p>
            Loading results in {this.state.time.s} seconds
        </p>
        <p>
            {this.state.missed_once==true?' ( sorry, it takes longer than expected by 10 seconds :) )':'' } 
        </p>
        </div>
      );
    }
  }
  
  export default CountDown;
  