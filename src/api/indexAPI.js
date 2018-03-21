import HttpUtil from '@/common/HttpUtil'

let configDomain = process.env.DOMAIN
const indexApi = {
  /**
   * 网站统计
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getWebStaticInfo (params) {
    let postUrl = configDomain + '/bshop/statistics/home/website'
    // let postUrl = process.env.DOMAIN + '/bshop/datareport/showtotal'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 流量浏览
   */
  getFlowCount (params) {
    let postUrl = configDomain + '/bshop/statistics/website/trafficOverview'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 获取邮件营销列表
   */
  getMarketList (params) {
    let getUrl = configDomain + '/bshop/client/mail/marketing/page'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 活动列表
   */
  getactList (params) {
    let postUrl = process.env.DOMAIN + '/bshop/shop/activity/marketing/list'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 拿到询盘信息
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getInquireInfo (params) {
    let postUrl = configDomain + '/bshop/msg/product/list'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 精准推荐信息
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getRecommendInfo (params) {
    let postUrl = configDomain + '/bshop/purchaser/recommendation/list'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 盈店学堂信息
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getSchoolInfo (params) {
    let postUrl = configDomain + '/bshop/article/page'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 盈店学堂详情
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getSchoolDetailInfo (params) {
    let postUrl = configDomain + '/bshop/article/find'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 生日信息
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getBirthdayInfo (params) {
    let postUrl = configDomain + '/bshop/contacts/birthdayprompt/list'
    // let postUrl = '/static/mock/indexBirthdayInfo.json'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 删除生日信息
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  removeBirthdayInfo (params) {
    let postUrl = configDomain + '/bshop/contacts/birthdayprompt/remove'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 客户来源
   */
  clientSource (params) {
    let postUrl = configDomain + '/bshop/index/contacts/statistics'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 当前在线
   */
  currOnline (params) {
    let postUrl = configDomain + '/bshop/statistics/home/online'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 客户最近动态
   */
  dynamicRecent (params) {
    return HttpUtil.get(configDomain + '/bshop/contacts/timeline/getLatestAction', params)
  },
  /**
   * 客户唤醒
   */
  customerWake (params) {
    return HttpUtil.get(configDomain + '/bshop/contacts/person/wakeup', params)
  },
  /**
   * 客户唤醒(忽略)
   */
  customerignoreWake (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/person/ignoreWakeup', params)
  },
  /**
   * lead推荐
   */
  leadData (params) {
    return HttpUtil.get(configDomain + '/bshop/client/recommend/list', params)
  },
  /**
   * 营销邮件统计
   */
  marketData (params) {
    return HttpUtil.get(configDomain + '/bshop/index/mail/marketing/statistic/overall', params)
  },
  /**
   * 营销邮件排行（阅读率）
   */
  marketRankData (params) {
    return HttpUtil.get(configDomain + '/bshop/index/mail/marketing/order/byRead', params)
  },
  /**
   * 营销邮件排行（点击率）
   */
  marketClickData (params) {
    return HttpUtil.get(configDomain + '/bshop/index/mail/marketing/order/byHit', params)
  },
  isAds (params) {
    let postUrl = process.env.DOMAIN + '/bshop/config/dict/list'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 得到邮件数量
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getMailAmount (params) {
    let postUrl = process.env.DOMAIN + '/bshop/inbox/mail/count/unread'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 验证邮箱有效性
   */
  mailCheck () {
    return HttpUtil.get(configDomain + '/channel/mail/check')
  },
  /**
   * 联系人转化
  */
  getContact (params) {
    let postUrl = process.env.DOMAIN + '/bshop/contacts/person/stageStatistics'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 联系人转化漏斗
  */
  getContactChange (params) {
    let postUrl = process.env.DOMAIN + '/bshop/contacts/person/recent/stageStatistics'
    return HttpUtil.get(postUrl, params)
  },
  // ----------loginApi，enquiriesAPI 拿来的接口 -----------
  /*
  * 获取登录token
  * */
  getLoginToken () {
    let getUrl = process.env.DOMAIN + '/api/operation/getToken'
    return HttpUtil.get(getUrl)
  },
  /**
   * 获取微询盘列表
   * */
  getMicroEnquiries (params) {
    let getUrl = process.env.DOMAIN + '/bshop/client/enquiry/recommend/micro/page'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 获取普通询盘列表
   * */
  getCommonEnquiries (params) {
    let getUrl = process.env.DOMAIN + '/bshop/client/enquiry/recommend/trad/page'
    return HttpUtil.post(getUrl, params)
  }
}
export default indexApi
