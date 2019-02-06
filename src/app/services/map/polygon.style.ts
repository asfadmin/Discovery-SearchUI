import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';

export const valid = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)'
  }),
  stroke: new Stroke({
    color: '#ffcc33',
    width: 4
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: '#ffcc33'
    })
  })
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
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)'
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
