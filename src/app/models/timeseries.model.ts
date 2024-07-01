export interface TimeSeriesResult {
    averages: layerInfo,
    coordinates: number[],
    layer_type: string,
    time_series: layerInfo
}

export interface layerInfo {
    unwrapped_phase: number[],
    interferometric_correlation: number[],
    temporal_coherence: number[]
}