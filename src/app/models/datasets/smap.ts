import { Props } from '../filters.model';

export const smap = {
  id: 'SMAP',
  name: 'SMAP',
  subName: '',
  beta: false,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.FLIGHT_DIRECTION,
    Props.ABSOLUTE_ORBIT,
  ],
  apiValue: { datasets: 'SMAP' },
  date: { start: new Date('2015/04/13 17:57:07 UTC') },
  infoUrl: 'https://www.asf.alaska.edu/sar-data-sets/soil-moisture-active-passive-smap-mission/',
  frequency: 'L-Band',
  source: {
    name: 'NASA',
    url: 'https://www.nasa.gov/'
  },
  citationUrl: 'https://asf.alaska.edu/data-sets/sar-data-sets/smap/smap-how-to-cite/',
  productTypes: [{
    apiValue: 'L1A_Radar_RO_HDF5',
    displayName: 'L1A Radar Receive Only Product'
  }, {
    apiValue: 'L1A_Radar_HDF5',
    displayName: 'L1A Radar Product'
  }, {
    apiValue: 'L1B_S0_LoRes_HDF5',
    displayName: 'L1B S0 LoRes Product'
  }, {
    apiValue: 'L1C_S0_HiRes_HDF5',
    displayName: 'L1C S0 HiRes Product'
  }, {
    apiValue: 'L1A_Radar_RO_QA',
    displayName: 'L1A Radar Receive Only Data Quality'
  }, {
    apiValue: 'L1A_Radar_QA',
    displayName: 'L1A Radar Data Quality Information'
  }, {
    apiValue: 'L1B_S0_LoRes_QA',
    displayName: 'L1B S0 LoRes Data Quality Information'
  }, {
    apiValue: 'L1C_S0_HiRes_QA',
    displayName: 'L1C S0 HiRes Data Quality Information'
  }, {
    apiValue: 'L1A_Radar_RO_ISO_XML',
    displayName: 'L1A Radar Receive Only Product Metadata'
  }, {
    apiValue: 'L1B_S0_LoRes_ISO_XML',
    displayName: 'L1B S0 LoRes Metadata'
  }, {
    apiValue: 'L1C_S0_HiRes_ISO_XML',
    displayName: 'L1C S0 HiRes Metadata'
  }, ],
  beamModes: [ 'STD' ],
  polarizations: [],
  subtypes: [],
  platformDesc: 'SMAP_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
