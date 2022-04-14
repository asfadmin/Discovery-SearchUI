
export interface DerivedDataset {
  name: string;
  info: string;
  description: string;
  info_url: string;
  download_url: string;
  picture: string;
}

const pictureFolder = 'assets/derived-datasets';
const asfWebsiteUrl = 'https://www.asf.alaska.edu';

export const derivedDatasets: DerivedDataset[] = [{
  name: 'Global Seasonal Sentinel-1 Interferometric Coherence & Backscatter Dataset',
  info: 'This dataset provides spatial representation of multi-seasonal, global interferometric coherence and backscatter signatures.',
  description: `
This dataset is the first-of-its-kind spatial representation of multi-seasonal, global SAR repeat-pass interferometric coherence and backscatter signatures. Global coverage comprises all land masses and ice sheets from 82 degrees northern to 78 degrees southern latitude. The dataset is derived from high-resolution multi-temporal repeat-pass interferometric processing of about 205,000 Sentinel-1 Single-Look-Complex (SLC) data acquired in Interferometric Wide-Swath mode (Sentinel-1 IW mode) from 1-Dec-2019 to 30-Nov-2020.
  `,
  info_url: `${asfWebsiteUrl}/datasets/derived/global-seasonal-sentinel-1-interferometric-coherence-and-backscatter-dataset/`,
  download_url: `${asfWebsiteUrl}/datasets/derived/global-seasonal-sentinel-1-interferometric-coherence-and-backscatter-dataset/`,
  picture: `assets/no-thumb.png`,
}, {
  name: 'GISMO',
  info: 'The Global Ice-Sheet Mapping Observatory (GISMO) project mapped flight lines over the Greenland ice sheet.',
  description: `
    The Global Ice-Sheet Mapping Observatory (GISMO) spaceborne radar
    system was part of the NASA Instrument Incubator Project (IIP).
    GISMO had a specific focus in measuring the surface topography of
    ice sheets, ice-sheet thickness, and in uncovering physical properties
    of the glacier bed using synthetic aperture radar (SAR). It utilized VHF and
    P-band interferometric radars and tested different methods of clutter rejection.
    GISMO achieved mapping the physical properties of a glacier bed through
    up to 5 km of ice. The GISMO project documented flight lines over the
    Greenland ice sheet in 2006, 2007, and 2008.
  `,
  info_url: `${asfWebsiteUrl}/sar-data-sets/global-ice-sheet-mapping-orbiter-gismo`,
  download_url: `${asfWebsiteUrl}/data-sets/derived-data-sets/gismo/gismo-data-products`,
  picture: `${pictureFolder}/gismo.gif`,
}, {
  name: 'Glacier Speed',
  info: 'This dataset reveals complex patterns of glacier flow throughout Alaska.',
  description: `
This dataset was produced by Evan Burgess and colleagues at the University of Utah and the University of Alaska Fairbanks using ALOS PALSAR data. It reveals complex patterns of glacier flow throughout Alaska. The speed data are available for download in formats designed both for scientists and educators. Surface velocities are available for 47,880 km^2 of glacier ice, which includes almost all of the state’s major glaciers. Detailed information on its production is available in Burgess et al., Nature Communications, 2013 (https://www.nature.com/articles/ncomms3146).
  `,
  info_url: `${asfWebsiteUrl}/sar-data-sets/glacier-speed`,
  download_url: `${asfWebsiteUrl}/data-sets/derived-data-sets/glacier-speed/glacier-speed-download-data`,
  picture: `${pictureFolder}/glacier_speed.jpg`,
}, {
  name: 'International Polar Year',
  info: 'International Polar Year (IPY) is a collaborative research event focused on the Arctic and Antarctic.',
  description: `
International Polar Year (IPY) was a collaborative research event focused on the Arctic and Antarctic. IPY 2007-2009 focused on collaborative research and extensively explored the complex relationships between the Arctic and Antarctic. Over 60 countries and thousands of researchers participated, investigating more than 200 projects. Topics included Arctic and Antarctic relationships with geophysical elements, oceans and sea ice, Earth’s atmosphere, space, and human relations. ASF hosts an archive of the IPY project titled the Global Inter-agency IPY Polar Snapshot Year (GIIPSY). GIIPSY’s objective was to obtain high-definition satellite snapshots of the polar regions during 2007-2008.
  `,
  info_url: `${asfWebsiteUrl}/sar-data-sets/international-polar-year-2007-2008`,
  download_url: `${asfWebsiteUrl}/sar-data-sets/international-polar-year-2007-2008`,
  picture: `${pictureFolder}/polar_year.jpeg`,
}, {
  name: 'RADARSAT-1 Antarctic Mapping Project (RAMP)',
  info: 'The RADARSAT-1 Antarctic Mapping Project (RAMP) acquired a complete map of Antarctica.',
  description: `
The RADARSAT-1 Antarctic Mapping Project (RAMP) was composed of two main missions, the first Antarctic Mapping Mission (AMM-1) and the Modified Antarctic Mapping Mission (MAMM). AMM-1 started on September 9, 1997 and was completed on October 20, 1997. Its goals were to acquire a complete map of Antarctica and better understand the relationships between the southernmost continent’s environmental elements. MAMM started on September 3, 2000 and was completed on November 17, 2000. It planned to remap Antarctica and measure ice velocity data using interferometric analysis and data from AMM-1.
  `,
  info_url: `${asfWebsiteUrl}/sar-data-sets/radarsat-antarctic-mapping-project-ramp`,
  download_url: `${asfWebsiteUrl}/data-sets/derived-data-sets/ramp/ramp-get-ramp-data`,
  picture: `${pictureFolder}/ramp.png`,
}, {
  name: 'Sea Ice MEaSUREs',
  info: 'This dataset includes radar snapshots of Arctic and Southern Ocean sea ice.',
  description: `
Sea-ice imagery and data products are supported under NASA’s Making Earth System data records for Use in Research Environments (MEaSUREs) program. Arctic and Southern Ocean imagery, data, and data products are available at no cost to approved users from the ASF DAAC. These include over 11 years of RADARSAT-1 three-day radar snapshots of Arctic and Southern Ocean sea ice, and original SAR images. RADARSAT-1 data have been processed to construct a near decadal record of small-scale ice motion of the Arctic and Southern Oceans, a record of ice motion of the northern Bering Sea, and monthly high-resolution image mosaics of the Arctic Ocean.
  `,
  info_url: `${asfWebsiteUrl}/sar-data-sets/sea-ice-measures`,
  download_url: `${asfWebsiteUrl}/data-sets/derived-data-sets/seaice-measures/sea-ice-measures-data-products/`,
  picture: `${pictureFolder}/sea_ice_measures.jpeg`,
}, {
  name: 'Wetlands MEaSUREs',
  info: 'This dataset includes regional and continental-scale maps covering crucial wetlands systems.',
  description: `
The inundated wetlands Earth System Data Record (ESDR) consists of two primary components. First, fine-resolution maps of wetland extent, vegetation type, and seasonal inundation dynamics, derived from Synthetic Aperture Radar (SAR) for regional and continental-scale areas covering crucial wetlands systems. Second, global coarse-resolution time series mappings of inundated area fraction at ~25 km resolution derived from multiple satellite remote sensing observations including passive and active microwave sensors and optical data sets optimized for inundation detection. These datasets are provided on a bi-monthly basis for 1992-1999 and daily for 2000 onward. Annual summary products and a daily near real time (NRT) dataset with 2-3 day latency are also provided.
  `,
  info_url: `${asfWebsiteUrl}/sar-data-sets/wetlands-measures`,
  download_url: `${asfWebsiteUrl}/data-sets/derived-data-sets/wetlands-measures/wetlands-measures-product-downloads/`,
  picture: `${pictureFolder}/wetlands_measures.gif`,
}];
