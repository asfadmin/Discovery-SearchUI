import { async, fakeAsync, tick, TestBed, inject } from '@angular/core/testing';
import { MapService } from './map.service';
import { DrawService } from './draw.service';
import { WktService } from '../wkt.service';


describe('MapService', () => {
  let service: MapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapService,
        WktService,
        DrawService,
      ]
    });
    service = TestBed.get(MapService);
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

  it('should run #clearFocusedScene()', async () => {
    // clearFocusedScene();
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
