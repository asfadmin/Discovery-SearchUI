import { Geometry } from "ol/geom"
import { MapDrawModeType } from '@models/map.model';

export interface timeseriesChartItemState {
    checked: boolean,
    color?: string,
    name: string,
    wkt: string,
    geometry: Geometry,
    drawMode: MapDrawModeType,
    seriesNumber: number,
    linearFit: boolean,
    valid?: boolean,
    error?: any
}

export interface TimeSeriesChartPoint {
    aoi: string
    short_wavelength_displacement: number
    interferometric_correlation: number
    temporal_coherence: number
    date: string
    file_name: string,
    temporal_baseline: number
    id: string
    drawMode: MapDrawModeType
}
export interface TimeSeriesData {
    short_wavelength_displacement: number
    date: string,
    id: string,
    base: number,
    seriesNumber: number,
    drawMode: MapDrawModeType,
    color: string,
    aoi: string,
  }
