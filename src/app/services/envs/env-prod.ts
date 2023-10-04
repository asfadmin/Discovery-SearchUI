export const env = {
  prod: {
    api: 'https://api-prod-private.asf.alaska.edu',
    auth: 'https://auth.asf.alaska.edu',
    urs: 'https://urs.earthdata.nasa.gov',
    urs_client_id: 'BO_n7nTIlMljdvU6kRRB3g',
    banner: 'https://banners.asf.alaska.edu',
    user_data: 'https://appdata.asf.alaska.edu',
    unzip: 'https://unzip.asf.alaska.edu',
    bulk_download: 'https://bulk-download.asf.alaska.edu',
  },
  test: {
    api: 'https://api-test.asf.alaska.edu',
    api_maturity: 'test',
    auth: 'https://auth.asf.alaska.edu',
    urs: 'https://urs.earthdata.nasa.gov',
    urs_client_id: 'BO_n7nTIlMljdvU6kRRB3g',
    banner: 'https://banners.asf.alaska.edu',
    user_data: 'https://e0visv5gj4.execute-api.us-east-1.amazonaws.com/prod/',
    unzip: 'https://unzip.asf.alaska.edu',
    bulk_download: 'https://bulk-download.asf.alaska.edu',
  },
  defaultEnv: 'prod'
};
