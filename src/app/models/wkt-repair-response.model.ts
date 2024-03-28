export interface WKTRepairResponse {
    wkt: {
        unwrapped: string;
        wrapped: string;
    }
    repairs: { report: string, type: string }[];
}