/**
 * Created by hideyoshi on 2017/6/23.
 */

import HttpUtil from '@/common/HttpUtil'

const mailApi = {
  /**
   * 获取邮件收件箱
   * @return {[type]}        [description]
   */
  getMailList (params) {
    let postUrl = process.env.DOMAIN + '/bshop/inbox/mail/page'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 获取邮件详情
   * @return {[type]}        [description]
   */
  getMailDetail (params) {
    let postUrl = process.env.DOMAIN + '/bshop/inbox/mail/detail'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 阅读邮件
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  readMail (params) {
    let postUrl = process.env.DOMAIN + '/bshop/inbox/mail/read'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 获取邮件附件
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getAttachment (params) {
    let postUrl = process.env.DOMAIN + '/bshop/inbox/mail/get/attachment'
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
   * 新增联系人
   */
  addPerson (params) {
    let postUrl = process.env.DOMAIN + '/bshop/contacts/person/add'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 获取主账号下所有的邮箱
   */
  getMainAccountList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/channel/mail/list'
    return HttpUtil.get(getUrl, params)
  }
}
export default mailApi
