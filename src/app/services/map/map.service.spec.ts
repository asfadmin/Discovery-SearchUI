import { async } from '@angular/core/testing';
import {MapService} from './map.service';

describe('MapService', () => {
  let service;

  const wktService: any = {
    // mock properties here
  };

  const drawService: any = {
    // mock properties here
  };

  beforeEach(() => {
    service = new MapService(wktService, drawService);
  });

  it('should run #epsg()', async () => {
    // const result = epsg();
  });

  it('should run #setLayer()', async () => {
    // setLayer(layer);
  });

  it('should run #setDrawStyle()', async () => {
    // setDrawStyle(style);
  });

  it('should run #setDrawFeature()', async () => {
    // setDrawFeature(feature);
  });

  it('should run #setInteractionMode()', async () => {
    // const result = setInteractionMode(mode);
  });

  it('should run #setDrawMode()', async () => {
    // setDrawMode(mode);
  });

  it('should run #clearDrawLayer()', async () => {
    // clearDrawLayer();
  });

  it('should run #setCenter()', async () => {
    // setCenter(centerPos);
  });

  it('should run #setZoom()', async () => {
    // setZoom(zoom);
  });

  it('should run #setMapView()', async () => {
    // setMapView(viewType);
  });

  it('should run #clearFocusedGranule()', async () => {
    // clearFocusedGranule();
  });

  it('should run #setFocusedFeature()', async () => {
    // setFocusedFeature(feature);
  });

  it('should run #zoomTo()', async () => {
    // zoomTo(feature);
  });

  it('should run #setMap()', async () => {
    // setMap(mapView);
  });

  it('should run #createNewMap()', async () => {
    // const result = createNewMap();
  });

  it('should run #updatedMap()', async () => {
    // const result = updatedMap();
  });

});
