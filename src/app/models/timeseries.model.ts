import { SimpleGeometry } from "ol/geom"

export interface TimeSeriesResult {
    averages: layerInfo,
    coordinates: number[],
    layer_type: string,
    time_series: layerInfo
}

export interface layerInfo {
    short_wavelength_displacement: number[],
    interferometric_correlation: number[],
    temporal_coherence: number[]
}

export interface timeseriesChartItemState {
    checked: boolean,
    color: string,
    name: string,
    wkt: string,
    geoemetry: SimpleGeometry
}