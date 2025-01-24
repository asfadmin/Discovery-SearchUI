import { SimpleGeometry } from "ol/geom"

export interface timeseriesChartItemState {
    checked: boolean,
    color?: string,
    name: string,
    wkt: string,
    geometry: SimpleGeometry,
    seriesNumber: number,
    linearFit: boolean,
    valid: boolean,
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
}
export interface TimeSeriesData {
    short_wavelength_displacement: number
    date: string,
    id: string,
    base: number,
    seriesNumber: number,
    color: string,
    aoi: string,
  }
