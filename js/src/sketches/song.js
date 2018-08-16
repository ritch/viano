import p5 from 'p5';
import pos from '../lib/pos';
import Song from '../lib/Song';
let v;
let song;
let color = 255;
let lastBar = 1;
let lastBeat = 1;
let spacing = 20
let lofi = false
let transparency = 1
let tDelta = -0.01

export default function song(s) {
  s.setup = () => {
    song = new Song(107, 'Gmaj', s)
    s.createCanvas(s.windowWidth, s.windowHeight);
    v = s.createVideo(['song2.mp4'], () => v.play());
    let {x, y} = pos(s)
    v.size(x(1), y(1))
    // v.hide()
    v.loop()
    // v.volume(0)
    s.noStroke()
    song.play()
    s.colorMode(s.HSB)
    videoOpacity(transparency)
  }
  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  }
  s.draw = () => {
    song.onDraw()
    let opacity = 0.2
    let bar = song.bars()
    let beat = song.beats()
    let intro = 37
    let isDropBeat = 85
    let firstChorus = 53
    let secondChorus = 165

    let section = 'intro'

    if (beat === 151) {
      spacing = 10
    }

    if (beat > 85 && bar % 8 == 0) {
      spacing = 10
      lofi = !lofi
    }

    if (beat > intro && beat != lastBeat) {
      spacing += 1
    }

    if (beat === isDropBeat || beat == firstChorus || beat == secondChorus) {
      spacing = 5
    }

    if (beat === isDropBeat) {
      lofi = true
    }

    if (beat >= isDropBeat) {
      opacity = 0.8
      section = 'drop'
    }
    if (beat <= intro) {
      section = 'intro'
    }

    if (beat >= intro) {
      s.background(color, s.map(song.beat(), 1, 4, 0, 255), 128)
    } else {
      lofi = false
      s.background(0, 0, 255)
    }

    if (beat >= isDropBeat) {
      opacity = 0.7
      s.background(s.random(0, 255), s.random(0, 255), s.random(0, 255))
    }

    // s.background(0)
    s.textSize(18) 
    s.text(`beat: ${song.beat()}`, 5, 20)
    s.text(`beats: ${song.beats()}`, 5, 40)
    s.text(`bars: ${bar}`, 5, 60)

    if (lastBar !== bar) {
      color = s.random(0, 255)
    }




    if (lofi) {
      if (beat == isDropBeat) {
        transparency = -0.1
      }
      if (transparency < 0) {
        tDelta = 0.01
      }
      if (transparency > 1) {
        tDelta = -0.01
      }
      videoOpacity(transparency += tDelta)
      v.loadPixels()
      if (beat >= isDropBeat) {
        s.fill(255, 255, 255, opacity)
      } else if (beat != lastBeat) {
        s.fill(s.random(0, 255), s.random(0, 255), s.random(0, 255), opacity)
      }
      for (let y = 0; y < s.height; y += spacing) {
        for (let x = 0; x < s.width; x += spacing / 2) {
          let offset = ((y * s.width) + x) * 4;
          s.rect(x, y, spacing, spacing * (v.pixels[offset + 1] / 255));
        }
      }
    } else {
      transparency = 1
      videoOpacity(1)
    }


    lastBar = bar;
    lastBeat = beat;
  }
}

let video
function videoOpacity(o) {
  if (!video) video = document.getElementsByTagName('video')[0]
  video.style.opacity = o
}
