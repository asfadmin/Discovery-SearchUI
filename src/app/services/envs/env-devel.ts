export const env = {
  prod: {
    api: 'https://api.daac.asf.alaska.edu',
    auth: 'https://auth.asf.alaska.edu',
    urs: 'https://urs.earthdata.nasa.gov',
    urs_client_id: 'BO_n7nTIlMljdvU6kRRB3g',
    banner: 'https://banners.asf.alaska.edu/calendar/prod',
    user_data: 'https://appdata.asf.alaska.edu'
  },
  test: {
    api: 'https://api-test.asf.alaska.edu',
    api_maturity: 'prod',
    auth: 'https://auth-test-jnk.asf.alaska.edu',
    urs: 'https://uat.urs.earthdata.nasa.gov',
    urs_client_id: 'Qkd0Z9KbhG86qedkRC7nSA',
    banner: 'https://banners.asf.alaska.edu/calendar/test',
    user_data: 'https://gg0fcoca5c.execute-api.us-east-1.amazonaws.com/test'
  },
  defaultEnv: 'test'
};
