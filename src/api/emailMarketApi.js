/**
 * 邮件营销
 * Created by hideyoshi on 2017/4/19.
 */
import HttpUtil from '@/common/HttpUtil'

let configDomain = process.env.DOMAIN
const emailmApi = {
  /**
   * 搜索联系人
   */
  getLinker (params) {
    return HttpUtil.get(configDomain + '/bshop/contacts/list', params)
  },
  /**
   * 可选择的联系人数量
   */
  getSendNum (params) {
    return HttpUtil.get(configDomain + '/bshop/client/mail/marketing/account', params)
  },
  /**
   * 渠道列表接口 - 获取发件人邮箱
   * @param params
   * @returns {*|AxiosPromise}
   */
  channelShopList (params) {
    return HttpUtil.get(configDomain + '/bshop/channel/shop/list', params)
  },
  /**
   * 获取统计数据
   */
  getMarketStatistic (params) {
    let getUrl = configDomain + '/bshop/client/mail/marketing/statistic/overall'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 获取邮件营销列表
   */
  getMarketList (params) {
    let getUrl = configDomain + '/bshop/client/mail/marketing/page'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 获取邮件营销详情
   */
  getMarketDetail (params) {
    let getUrl = configDomain + '/bshop/client/mail/marketing/detail'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 删除邮件
   */
  deleteMarket (params) {
    let getUrl = configDomain + '/bshop/client/mail/marketing/delete'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 添加并发送
   */
  addMarketSend (params) {
    let getUrl = configDomain + '/bshop/client/mail/marketing/add/send'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 添加到草稿
   */
  addDraft (params) {
    let getUrl = configDomain + '/bshop/client/mail/marketing/add/draft'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 修改并发送
   */
  updateMarketSend (params) {
    let getUrl = configDomain + '/bshop/client/mail/marketing/update/send'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 修改到草稿
   */
  updateDraft (params) {
    let getUrl = configDomain + '/bshop/client/mail/marketing/update/draft'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 获取渠道列表
   */
  getChannelList () {
    let getUrl = configDomain + '/bshop/channel/shop/list'
    return HttpUtil.get(getUrl)
  },
  /**
   * 获取邮件营销手机人列表总体统计
   */
  getReceiverStatis (params) {
    let getUrl = configDomain + '/bshop/client/mail/marketing/receiver/statistic'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 获取邮件营销手机人列表总体统计
   */
  getReceiverList (params) {
    let getUrl = configDomain + '/bshop/client/mail/marketing/receiver/page'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 登录没有name的时候找注册的name
   */
  getContact () {
    return HttpUtil.get(configDomain + '/bshop/company/contact/find')
  },
  /**
   * 获取联系人分组
   */
  getGroups (params) {
    return HttpUtil.get(configDomain + '/bshop/contacts/group/list', params)
  },
  /**
   * 计算选中联系人数量
   */
  getLinkerNum (params) {
    return HttpUtil.post(configDomain + '/bshop/client/mail/marketing/receiver/count', params)
  },
  /**
   * 加载邮件营销收件人列表
   */
  getEmailReceivers (params) {
    return HttpUtil.post(configDomain + '/bshop/client/mail/marketing/receiver/page', params)
  },
  /**
   * 加载邮件营销收件人详情
   */
  getEmailReceiversDetail (params) {
    return HttpUtil.post(configDomain + '/bshop/client/mail/marketing/receiver/detail', params)
  },
  /**
   * 数据概况接口
   */
  getmailSeriesAll (params) {
    return HttpUtil.get(configDomain + '/bshop/client/mail/marketing/statistic/report', params)
  },
  /**
   * 邮件模版列表
   */
  searchTemplateList (params) {
    return HttpUtil.get(configDomain + '/bshop/mail/template/list', params)
  },
  /**
   * 活动模版列表
   */
  searchActivityTemplate (params) {
    return HttpUtil.get(configDomain + '/bshop/mail/template/list', params)
  }
}
export default emailmApi
