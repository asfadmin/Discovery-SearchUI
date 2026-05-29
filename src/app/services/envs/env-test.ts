export const env = {
  prod: {
    api: 'https://api.daac.asf.alaska.edu',
    auth: 'https://auth.asf.alaska.edu',
    urs: 'https://urs.earthdata.nasa.gov',
    urs_client_id: 'BO_n7nTIlMljdvU6kRRB3g',
    banner: 'https://banners.asf.alaska.edu',
    user_data: 'https://appdata.asf.alaska.edu',
    bulk_download: 'https://bulk-download.asf.alaska.edu',
  },
  test: {
    api: 'https://api-test.asf.alaska.edu',
    api_maturity: 'prod',
    auth: 'https://cumulus.asf.alaska.edu',
    urs: 'https://urs.earthdata.nasa.gov',
    urs_client_id: 'BO_n7nTIlMljdvU6kRRB3g',
    banner: 'https://banners.asf.alaska.edu',
    user_data: 'https://appdata-test.asf.alaska.edu',
    bulk_download: 'https://bulk-download.asf.alaska.edu',
  },
  defaultEnv: 'test',
};
