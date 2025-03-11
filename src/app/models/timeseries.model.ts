import { Geometry } from "ol/geom"
import { MapDrawModeType } from '@models/map.model';

export interface timeseriesChartItemState {
    uuidSeries: string,
    checked: boolean,
    color?: string,
    wkt: string,
    geometry: Geometry,
    drawMode: MapDrawModeType,
    seriesNumber: number,
    seriesName: string,
    linearFit: boolean,
    valid?: boolean,
    error?: any,
    frames?: TimeseriesSubframe[]
}

export interface TimeSeriesChartPoint {
    uuidSeries: string,
    aoi: string
    short_wavelength_displacement: number
    interferometric_correlation: number
    temporal_coherence: number
    date: string
    file_name: string,
    temporal_baseline: number
    id: string
    drawMode: MapDrawModeType,
}
export interface TimeSeriesData {
    uuidSeries: string,
    short_wavelength_displacement: number
    date: string,
    id: string, // id of the individual point
    uuid: string, // id of the series frame
    base: number,
    seriesNumber: number,
    seriesName: string,
    frame: string,
    drawMode: MapDrawModeType,
    color: string,
    aoi: string,
  }

export interface TimeseriesSubframe {
    number: string,
    uuid: string,
    wkt: string,
    checked: boolean,
    color: string,
}