(function() {
  window._env = {
    api: {
      prod: 'https://api-prod-private.asf.alaska.edu',
      test: 'https://api-test.asf.alaska.edu',
    },
    auth: {
      api: 'https://auth.asf.alaska.edu',
      urs: 'https://urs.earthdata.nasa.gov'
    },
    banner: {
      prod: 'https://banners.asf.alaska.edu/calendar/prod',
      test: 'https://banners.asf.alaska.edu/calendar/test',
    },
    user_data: {
      prod: `https://appdata.asf.alaska.edu`,
      test: `https://gg0fcoca5c.execute-api.us-east-1.amazonaws.com/test`
    },
    devMode: false,
  }
})()
