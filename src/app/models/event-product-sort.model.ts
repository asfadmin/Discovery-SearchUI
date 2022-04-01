export interface EventProductSort {
  sortType: EventProductSortType,
  sortDirection: EventProductSortDirection
}

export enum EventProductSortType {
    PATH = "path",
    FRAME = "frame",
    DATE = "date"
}

export enum EventProductSortDirection {
  ASCENDING = "ascending",
  DESCENDING = "descending"
}
