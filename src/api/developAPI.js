/**
 * Created by hideyoshi on 2017/4/19.
 */
import HttpUtil from '@/common/HttpUtil'

const developApi = {
  /**
   * 营销推广列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getExtensionList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/channel/spread/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 渠道列表查询接口
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getChannelList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/channel/shop/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * Pinterest 画板列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getBoardList (params) {
    let getUrl = process.env.DOMAIN + '/channel/pinterest/boardlist'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 商品列表接口
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getProductList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/product/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 发布社交推广接口
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  publishPost (params) {
    let postUrl = process.env.DOMAIN + '/bshop/channel/spread'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 推广记录详情
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  editDetail (params) {
    let getUrl = process.env.DOMAIN + '/bshop/channel/spread/detail'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 推广记录详情
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  editSend (params) {
    let postUrl = process.env.DOMAIN + '/bshop/channel/spread/update'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 重新发送接口
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  reSendMes (params) {
    let postUrl = process.env.DOMAIN + '/bshop/channel/resend'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 删除营销推广记录
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  deleteMes (params) {
    let getUrl = process.env.DOMAIN + '/bshop/channel/spread/delete'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 用户创建侦探任务
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  addTask (params) {
    let getUrl = process.env.DOMAIN + '/bshop/detective/task/add'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 获取任务列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getTaskList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/detective/task/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 获取公司列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getCompanyList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/detective/company/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 获取公司海关列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getCustomsList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/detective/company/customs/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 获取员工Linkedin列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getLinkedinList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/detective/company/linkedIn/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 获取员工facebook列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getFacebookList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/detective/company/facebook/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 获取公司详情
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getCompanyDetail (params) {
    let getUrl = process.env.DOMAIN + '/bshop/detective/company/detail'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 获取关联联系人列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getReleContactList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/detective/company/relative/contacts/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 尝试解锁邮箱
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  unlockMailAdress (params) {
    let postUrl = process.env.DOMAIN + '/bshop/detective/company/contacts/mail/unlock'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 深度挖掘联系人
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  digDepthContact (params) {
    let postUrl = process.env.DOMAIN + '/bshop/detective/company/pivotal/contacts/mining'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 获取采购趋势列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getTrendBar (params) {
    let getUrl = process.env.DOMAIN + '/bshop/radar/ptrends/'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 获取采购记录列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getTrendRecord (params) {
    let getUrl = process.env.DOMAIN + '/bshop/radar/lastProcurementRecord/'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 获取贸易关系图
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getRelation (params) {
    let getUrl = process.env.DOMAIN + '/bshop/radar/tradeRelations/'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 获取关键联系人
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getPivotalContact (params) {
    let getUrl = process.env.DOMAIN + '/bshop/detective/company/pivotal/contacts/list'
    return HttpUtil.get(getUrl, params)
  },
  switchAutoTask (params) {
    let postUrl = process.env.DOMAIN + '/bshop/detective/task/autoCommitTask'
    return HttpUtil.post(postUrl, params)
  },
  getAddedCount (params) {
    let getUrl = process.env.DOMAIN + '/bshop/detective/company/getCountInfo'
    return HttpUtil.get(getUrl, params)
  },
  getResolveRecord (params) {
    let getUrl = process.env.DOMAIN + '/bshop/detective/company/getAboutTradeList'
    return HttpUtil.get(getUrl, params)
  },
  getRecentRecord (params) {
    let getUrl = process.env.DOMAIN + '/bshop/detective/company/getLatestTradeList'
    return HttpUtil.get(getUrl, params)
  }
}
export default developApi
