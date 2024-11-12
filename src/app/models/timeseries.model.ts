import { SimpleGeometry } from "ol/geom"

export interface timeseriesChartItemState {
    checked: boolean,
    color: string,
    name: string,
    wkt: string,
    geoemetry: SimpleGeometry,
    seriesNumber: number,
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
