function pos(s) {
  return {
    // get pixel value from window position
    x: v => v * s.windowWidth,
    y: v => v * s.windowHeight
  }
}

export default pos;
