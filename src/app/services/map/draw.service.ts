import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Feature, Map } from 'ol';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Draw, Modify, Snap } from 'ol/interaction.js';
import { createBox } from 'ol/interaction/Draw.js';

import * as polygonStyle from './polygon.style';
import * as models from '@models';
import GeometryType from 'ol/geom/GeometryType';
import Geometry from 'ol/geom/Geometry';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { DrawNewPolygon } from '@store/map';

// Declare GTM dataLayer array.
declare global {
  interface Window { dataLayer: any[]; }
}

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  private source: VectorSource;
  private layer: VectorLayer;

  private draw: Draw;
  private modify: Modify;
  private snap: Snap;

  private defaultStyle = polygonStyle.valid;
  private drawEndCallback;

  public polygon$ = new BehaviorSubject<Feature<Geometry> | null>(null);
  public isDrawing$ = new BehaviorSubject<boolean>(false);

  constructor(private store$: Store<AppState>) {
    this.source = new VectorSource({
      wrapX: models.mapOptions.wrapX
    });

    this.layer = new VectorLayer({
      source: this.source,
      style: polygonStyle.valid
    });
  }

  public getLayer(): VectorLayer {
    return this.layer;
  }

  public setInteractionMode(map: Map, mode: models.MapInteractionModeType) {
    map.removeInteraction(this.snap);
    map.removeInteraction(this.modify);
    map.removeInteraction(this.draw);

    map.once("pointermove", (_) => {
      map.getViewport().style.cursor = 'move'
    });

    if (mode === models.MapInteractionModeType.DRAW) {
      map.addInteraction(this.draw);
      map.once("pointermove", (_) => {
        map.getViewport().style.cursor = 'grab'
      });
    } else if (mode === models.MapInteractionModeType.EDIT) {
      map.addInteraction(this.snap);
      map.addInteraction(this.modify);
      map.once("pointermove", (_) => {
        map.getViewport().style.cursor = 'crosshair'
      });
    }
  }

  public setDrawMode(map: Map, mode: models.MapDrawModeType): void {
    map.removeInteraction(this.draw);

    this.setInteraction(mode);
    map.addInteraction(this.draw);
  }

  public setInteraction(mode: models.MapDrawModeType): void {
    this.draw = this.create(mode);
  }

  public setDrawStyle(style: models.DrawPolygonStyle): void {
    switch (style) {
      case models.DrawPolygonStyle.VALID: {
        this.setValidStyle();
        break;
      }
      case models.DrawPolygonStyle.INVALID: {
        this.setInvalidStyle();
        break;
      }
      case models.DrawPolygonStyle.OMITTED: {
        this.setOmittedStyle();
        break;
      }
    }
  }

  public setFeature(feature, _): void {
    this.drawEndCallback(feature);
    this.source.clear();
    this.source.addFeature(feature);
    this.layer.setStyle(this.defaultStyle);

    this.polygon$.next(feature);
  }

  public clear = (): void => {
    this.source.clear();
    this.setValidStyle();
    this.polygon$.next(null);
  }

  public setDrawEndCallback(callback): void {
    this.drawEndCallback = callback;
  }

  private create(drawMode: models.MapDrawModeType): Draw {
    let draw: Draw;
    this.isDrawing$.next(false);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'draw',
      'draw-mode': drawMode
    });

    if (drawMode === models.MapDrawModeType.BOX) {
      draw = new Draw({
        source: this.source,
        type: 'Circle' as GeometryType, // Actually a box...
        geometryFunction: createBox()
      });
    } else {
      draw = new Draw({
        source: this.source,
        type: drawMode.valueOf() as GeometryType
      });
    }

    draw.on('drawstart', _ => {
      this.isDrawing$.next(true);
      this.clear();
    });
    draw.on('drawend', e => {
      this.drawEndCallback(e.feature);

      this.isDrawing$.next(false);
      this.polygon$.next(e.feature);
      this.store$.dispatch(new DrawNewPolygon());
    });

    this.snap = new Snap({source: this.source});
    this.modify = this.createModify();

    return draw;
  }

  private createModify(): Modify {
    const modify = new Modify({ source: this.source });

    modify.on('modifyend', e => {
      const feature = e.features.getArray()[0];

      this.drawEndCallback(feature);

      this.setDrawStyle(models.DrawPolygonStyle.VALID);
      this.polygon$.next(feature);
      this.store$.dispatch(new DrawNewPolygon());
    });

    return modify;
  }

  private setValidStyle(): void {
    this.defaultStyle = polygonStyle.valid;
    this.layer.setStyle(this.defaultStyle);
  }

  private setOmittedStyle() {
    this.defaultStyle = polygonStyle.omitted;
    this.layer.setStyle(this.defaultStyle);
  }

  private setInvalidStyle(): void {
    this.layer.setStyle(polygonStyle.invalid);
  }
}
