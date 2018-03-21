/**
 * Created by silence on 2017/6/22.
 */

import HttpUtil from '@/common/HttpUtil'
const webCountApi = {
  getPvUv (params) {
    let getUrl = process.env.DOMAIN + '/bshop/statistics/website/pvAndUv'
    return HttpUtil.get(getUrl, params)
  },
  getComphsive (params) {
    let getUrl = process.env.DOMAIN + '/bshop/statistics/website/integration'
    return HttpUtil.get(getUrl, params)
  },
  getSource (params) {
    let getUrl = process.env.DOMAIN + '/bshop/statistics/website/byChannelType'
    return HttpUtil.get(getUrl, params)
  },
//  PV，uvip国家分布图
  getCountryCount (params) {
    let getUrl = process.env.DOMAIN + '/bshop/statistics/website/country'
    return HttpUtil.get(getUrl, params)
  },
//  产品流量接口
  getAllProduct (params) {
    let getUrl = process.env.DOMAIN + '/bshop/statistics/website/productTraffic'
    return HttpUtil.get(getUrl, params)
  }
}
export default webCountApi
