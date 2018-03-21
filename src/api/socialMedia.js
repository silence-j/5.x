import HttpUtil from '@/common/HttpUtil'

const socialMediaApi = {
  /**
   * 查询社媒
   * @param {[type]} params [description]
   */
  list (params) {
    let getUrl = process.env.DOMAIN + '/bshop/radar/query'
    return HttpUtil.get(getUrl, params)
  },
  getFbAbout (params) {
    let getUrl = process.env.DOMAIN + '/bshop/radar/getFbAbout'
    return HttpUtil.get(getUrl, params)
  }
}
export default socialMediaApi
