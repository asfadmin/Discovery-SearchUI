import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style.js';

export const valid = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)'
  }),
  stroke: new Stroke({
    color: '#236192',
    width: 2
  }),
  image: new CircleStyle({
    stroke: new Stroke({
      color: '#ffcc33',
      width: 2
    }),
    radius: 10,
    fill: new Fill({
      color: '#236192',
    }),
  })
});

const fill = new Fill({
  color: 'rgba(255,255,255,0.0)'
});
const stroke = new Stroke({
  color: '#3399CC',
  width: 2.5
});

export const scene = new Style({
    image: new CircleStyle({
      fill,
      stroke,
      radius: 5
    }),
    stroke,
    fill,
  });

  export const staticAOI = new Style({
    stroke: new Stroke({
      color: '#ff5555',
      width: 4
    }),
    fill,
  });

  export const icon = new Style({
    stroke,
    fill,
  });

export const omitted = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)'
  }),
  stroke: new Stroke({
    color: '#aaaaaa',
    width: 4
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: '#aaaaaa',
    })
  })
});

export const invalid = new Style({
  text: new Text({
    text: 'Approximate Placement Only',
    scale: 2,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 1.0)'
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1.0)'
    }),
    placement: 'line',
    textBaseline: 'bottom',
  overflow: false,
  font: '50px'
  }),
  stroke: new Stroke({
    color: '#f44336',
    width: 4
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: '#f44336',
    })
  })
});

export const hidden = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.0)'
  }),
  stroke: new Stroke({
    color: 'rgba(255, 255, 255, 0.0)',
    width: 4
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.0)'
    })
  })
});

export const hover = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)'
  }),
  stroke: new Stroke({
    color: 'rgba(255, 255, 255, 0.2)',
    width: 4
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.4)'
    })
  })
});
