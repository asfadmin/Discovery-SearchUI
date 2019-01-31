import { Range } from './range.model';

export type DateRangeExtrema = Range<DateExtrema>;

export interface DateExtrema {
  min: Date;
  max: Date;
}
