export const env = {
  prod: {
    api: 'https://api-prod-private.asf.alaska.edu',
    auth: 'https://auth.asf.alaska.edu',
    urs: 'https://urs.earthdata.nasa.gov',
    urs_client_id: 'BO_n7nTIlMljdvU6kRRB3g',
    banner: 'https://banners.asf.alaska.edu',
    user_data: 'https://appdata.asf.alaska.edu',
    bulk_download: 'https://bulk-download.asf.alaska.edu',
    displacement_api: 'https://d2qmcvu7qty7vn.cloudfront.net/',
  },
  test: {
    api: 'https://api-test.asf.alaska.edu',
    api_maturity: 'test',
    auth: 'https://cumulus.asf.alaska.edu',
    urs: 'https://urs.earthdata.nasa.gov',
    urs_client_id: 'BO_n7nTIlMljdvU6kRRB3g',
    banner: 'https://banners.asf.alaska.edu',
    user_data: 'https://appdata-test.asf.alaska.edu',
    bulk_download: 'https://bulk-download.asf.alaska.edu',
    displacement_api: 'https://d8itg4twhevb5.cloudfront.net/',
  },
  defaultEnv: 'prod',
};
