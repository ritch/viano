import React, { Component } from 'react';
import './App.css';
import Sketch from './Sketch';
import p5 from 'p5';
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";
import sketches from './sketches'

class App extends Component {
  constructor() {
    super();
    this.state = {}
  }
  componentDidMount() {
    this.selectSketch('midi')
  }
  getSketches() {
    const current = this.state.selectedSketch
    const results = []
    for (let [name, sketch] of Object.entries(sketches)) {
      const item = {name, sketch, selected: sketch === current}
      results.push(item)
    }
    return results
  }
  selectSketch(sketchName) {
    console.log('selecting', sketchName)
    for (let [name, sketch] of Object.entries(sketches)) {
      if (sketchName === name) {
        this.setState({selectedSketch: {name, sketch, selected: true}})
      }
    }
  }
  render() {
    return (
      <div className="App">
        <Controls current={this.state.selectedSketch} sketches={this.getSketches()} onChange={sketch => this.selectSketch(sketch)} />
        <Display sketch={this.state.selectedSketch} />
      </div>
    );
  }
}

function Controls({onChange, sketches, current}) {
  return <div id='controls'>
    <select value={current && current.name} onChange={e => onChange(e.target.value)}>
      <option>Select one...</option>
      {sketches.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
    </select>
  </div>
}

function Display({sketch}) {
  if (!sketch) return null;

  return <Sketch run={sketch.sketch} />
}

export default App;
