export interface Platform {
  name: string;
  date: DateRange;
}

export interface DateRange {
  start: Date;
  end?: Date;
}
