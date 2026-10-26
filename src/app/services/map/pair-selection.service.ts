import { Injectable } from '@angular/core';
import intersect from '@turf/intersect';
import { Feature } from 'ol';
import { Geometry, Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import { Range } from '@models';

import { framePreview } from './polygon.style';

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
      style: framePreview,
      properties: {
        selectable: true,
      },
    });
  }

  public selectFrame(_id: string) {
    return;
  }

  // make private
  public onInteract() {
    // check if interaction is overlapping multiple frames
    // if no just select it
    // if yes, bring up menu with multiple frame options available
    return;
  }

  public previewFrame(_id: string) {
    // finds frame feature by id in vector layer
    // sets frame to certain style
    return;
  }

  public clearPreviewFrame() {
    // go through all features and remove frame preview styling
    return;
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
    features: Feature<Geometry>[],
    _params: any,
    polygon,
    pathFrameRange,
  ) {
    const baseCoords = [polygon.getGeometry().getCoordinates()[0]];
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
