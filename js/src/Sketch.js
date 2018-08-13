import React from 'react';
import p5 from 'p5';

export default class Sketch extends React.Component {

  componentDidMount() {
    this.canvas = new p5(this.props.run, this.wrapper);
  }

  componentWillReceiveProps(newprops) {
    if(this.props.run !== newprops.run){
      this.wrapper.removeChild(this.wrapper.childNodes[0]);
      this.canvas = new p5(newprops.run, this.wrapper);
    }
  }

  render() {
    return <div ref={wrapper => this.wrapper = wrapper}></div>;
  }
}