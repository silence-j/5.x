import HttpUtil from '@/common/HttpUtil'
// import Config from '@/common/config'

let configDomain = process.env.DOMAIN
const creativeApi = {
  /**
   * 智能作家列表
   */
  getIntellList (params) {
    return HttpUtil.get(configDomain + '/bshop/blog/query/keyword', params)
  },
  /**
   * 再次创作
   */
  createAgain (params) {
    return HttpUtil.get(configDomain + '/bshop/blog/create/keyword', params)
  },
  /**
   * 发布
   */
  publish (params) {
    return HttpUtil.post(configDomain + '/bshop/blog/publish', params)
  },
  /**
   * 获取关键字
   */
  getIntellKey (params) {
    return HttpUtil.get(configDomain + '/bshop/blog/keywords/get', params)
  }
}
export default creativeApi
