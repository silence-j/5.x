var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROUTE_NAME_FOOT: '" - 盈店通"',
  IFRAM_DOMAIN: '"localhost"',
  DOMAIN: '"http://server.onloon.com.cn"',
  // DOMAIN: '"http://192.168.63.85:8085"',
  ADS_DOMAIN: '"http://matrixtest.onloon.cn"',
  IMG_DOMAIN: '"https://server.onloon.cc"',
  API_HOST: '".onloon.com.cn"',
  HOMEPAGE: '"http://localhost:8086"',
  HOMEPAGE_DOMAIN: '"localhost:8086"',
  PHOTO_DOMAIN: '"http://47.88.53.125/"',
  ACTIVITY: '"http://localhost:8089/"',
  FBAPP_ID: '"1462873430417362"'
})

