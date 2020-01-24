(function() {
  window._env = {
    api: {
      prod: 'https://api.daac.asf.alaska.edu',
      test: 'https://api-test.asf.alaska.edu/test',
    },
    auth: {
      api: {
        test: 'https://auth-test-jnk.asf.alaska.edu',
        prod: 'https://auth.asf.alaska.edu',
      },
      urs: {
        test: 'https://uat.urs.earthdata.nasa.gov',
        prod: 'https://urs.earthdata.nasa.gov'
      }
    },
    banner: {
      prod: 'https://banners.asf.alaska.edu/calendar/prod',
      test: 'https://banners.asf.alaska.edu/calendar/test',
    },
    user_data: {
      prod: `https://appdata.asf.alaska.edu`,
      test: `https://gg0fcoca5c.execute-api.us-east-1.amazonaws.com/test`
    },
    devMode: true,
  }
})()
