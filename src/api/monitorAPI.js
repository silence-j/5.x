/**
 * Created by hideyoshi on 2017/4/17.
 */
import HttpUtil from '@/common/HttpUtil'
// import Config from '@/common/config'

const monitorApi = {
  /**
   * 社交监控列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getSocialList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/opportunity/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 社交通知扩展详情接口
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getSocialDetail (params) {
    let getUrl = process.env.DOMAIN + '/bshop/opportunity/detail'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 拉取新消息个数
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getNewMesNumber (params) {
    let getUrl = process.env.DOMAIN + '/bshop/opportunity/pullCount'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 关注
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  createFollow (params) {
    let postUrl = process.env.DOMAIN + '/bshop/social/follow/create'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 取消关注
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  destroyFollow (params) {
    let postUrl = process.env.DOMAIN + '/bshop/social/follow/destroy'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 添加联系人
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  addContact (params) {
    let postUrl = process.env.DOMAIN + '/bshop/contacts/social/add'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 社交消息 回复/评论 接口
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  socialReply (params) {
    let postUrl = process.env.DOMAIN + '/bshop/contacts/social/reply'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 社交消息 转发/分享 接口
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  socialShare (params) {
    let postUrl = process.env.DOMAIN + '/bshop/contacts/social/share'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 社交文章(信息流) 点赞
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  socialLike (params) {
    let postUrl = process.env.DOMAIN + '/bshop/contacts/social/content/like'
    return HttpUtil.post(postUrl, params)
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
   * 邮件监控列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getMailList (params) {
    let getUrl = process.env.DOMAIN + '/channel/mail/track/list'
    return HttpUtil.get(getUrl, params)
  },
  getMailLog (params) {
    let getUrl = process.env.DOMAIN + '/bshop/mail/send/extend/log/page'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 邮件监控详情
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getMailDetail (params) {
    let getUrl = process.env.DOMAIN + '/channel/mail/detail'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 邮件监控详情新
   * @param  {[type]} params [description]
   */
  getMailDetailNew (params) {
    let getUrl = process.env.DOMAIN + '/bshop/mail/send/extend/get'
    return HttpUtil.get(getUrl, params)
  },
  /**
   *  登录监控列表
   * @param  {[type]} params [description]
   */
  getLoginList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/monitor/website/login/access/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 官网登录添加联系人
   */
  addLoginPerson (params) {
    let getUrl = process.env.DOMAIN + '/bshop/monitor/website/login/contact/add'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 询盘监控列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getInquiryList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/msg/product/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 询盘单详情查询接口
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getInquiryDetail (params) {
    let getUrl = process.env.DOMAIN + '/bshop/msg/product/detail'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 查询群组列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getGroupList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/assistant/group/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 查询帖子列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getGroupPostList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/assistant/grouppost/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 删除帖子
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  delPost (params) {
    let getUrl = process.env.DOMAIN + '/bshop/assistant/grouppost/delete'
    return HttpUtil.get(getUrl, params)
  }
}
export default monitorApi
