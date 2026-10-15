import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import intersect from '@turf/intersect';
import { Polygon } from 'ol/geom';
import { Range } from '@models';

@Injectable({
  providedIn: 'root',
})
export class PairSelectionService {
  private source: VectorSource;
  public layer: VectorLayer<VectorSource>;
  constructor() {
    this.source = new VectorSource();

    this.layer = new VectorLayer<VectorSource>({
      source: this.source,
      style: new Style({
        fill: new Fill({
          color: '#FFFFFF33',
        }),
        stroke: new Stroke({
          color: 'black',
        }),
      }),
    });
  }

  public loadFramePreview(frames: Feature[]) {
    this.source.clear();
    this.source.addFeatures(frames);
  }

  public clearFramePreview() {
    this.source.clear();
  }

  private isWithinRange(value, range: Range<number | undefined>) {
    if (range === null || range == undefined) {
      return true;
    }
    if (range?.start !== null) {
      if (range?.end !== null) {
        return value >= range?.start && value <= range?.end;
      } else {
        return value >= range?.start;
      }
    } else if (range?.end !== null) {
      return value <= range.end;
    }
    return true;
  }

  public tempAriaMapFilter(
    features: Feature[],
    _params: any,
    polygon,
    pathFrameRange,
  ) {
    const baseCoords = [(polygon.getGeometry() as Polygon).getCoordinates()[0]];
    return features.filter((a) => {
      const frame = +a.get('id');
      const path = +a.get('path');
      if (
        !intersect(
          {
            type: 'Polygon',
            coordinates: [(a.getGeometry() as Polygon).getCoordinates()[0]],
          },
          {
            type: 'Polygon',
            coordinates: baseCoords,
          },
        )
      ) {
        return false;
      }
      if (
        this.isWithinRange(frame, pathFrameRange.frameRange) &&
        this.isWithinRange(path, pathFrameRange.pathRange)
      ) {
        return true;
      } else {
        return false;
      }
    });
  }
}
