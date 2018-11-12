export interface Platform {
  name: string;
  date: DateRange;
}

export interface DateRange {
  start: Date;
  end?: Date;
}

export const platforms: Platform[] = [{
    name: 'Sentinel-1A',
    date: {
      start: new Date(2014, 3, 25)
    }
  }, {
    name: 'Sentinel-1B',
    date: {
      start: new Date(2016, 3, 3)
    }
  }, {
    name: 'SMAP',
    date: {
      start: new Date(2015, 0, 15)
    }
  }, {
    name: 'UAVSAR',
    date: {
      start: new Date(2008, 0, 1)
    }
  }, {
    name: 'ALOS PALSAR',
    date: {
      start: new Date(2006, 0, 1),
      end: new Date(2011, 0, 1)
    }
  }, {
    name: 'RADARSAT-1',
    date: {
      start: new Date(1995, 0, 1),
      end: new Date(2008, 0, 1)
    }
  }, {
    name: 'ERS-2',
    date: {
      start: new Date(1995, 0, 1),
      end: new Date(2011, 0, 1)
    }
  }, {
    name: 'JERS-1',
    date: {
      start: new Date(1992, 0, 1),
      end: new Date(1998, 0, 1)
    }
  }, {
    name: 'ERS-1',
    date: {
      start: new Date(1991, 0, 1),
      end: new Date(1997, 0, 1)
    }
  }, {
    name: 'AIRSAR',
    date: {
      start: new Date(1990, 0, 1),
      end: new Date(2004, 0, 1)
    }
  }, {
    name: 'SEASAT',
    date: {
      start: new Date(1978, 0, 1),
      end: new Date(1978, 0, 1)
    }
  }]
