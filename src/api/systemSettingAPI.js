/**
 * Created by admin on 2017/4/18.
 */
import HttpUtil from '@/common/HttpUtil'

const systemSettingAPI = {
  /**
   * 获取登录账户信息
   */
  accountInfo () {
    let postUrl = process.env.DOMAIN + '/bshop/person/account/info'
    return HttpUtil.get(postUrl)
  },
  /**
   * 获取用户账号信息
   */
  selectInfo () {
    let postUrl = process.env.DOMAIN + '/bshop/company/contact/find'
    return HttpUtil.get(postUrl)
  },
  /**
   * 修改头像或用户名
   */
  updatePersonInfo (param) {
    let postUrl = process.env.DOMAIN + '/bshop/person/updatePersonInfo'
    return HttpUtil.post(postUrl, param)
  },
  /**
   * 短信验证
   */
  smsSend (param) {
    let postUrl = process.env.DOMAIN + '/bshop/sms/send'
    return HttpUtil.post(postUrl, param)
  },
  /**
   * 企业联系方式查询
   */
  selectContactInfo () {
    let postUrl = process.env.DOMAIN + '/bshop/company/contact/find'
    return HttpUtil.get(postUrl)
  },
  /**
   * 修改密码
   */
  updatePassword (param) {
    let postUrl = process.env.DOMAIN + '/bshop/person/password/change'
    return HttpUtil.post(postUrl, param)
  },
  /**
   * 更换手机原手机验证
   */
  accountVerification (param) {
    let postUrl = process.env.DOMAIN + '/bshop/person/account/ori-check'
    return HttpUtil.post(postUrl, param)
  },
  /**
   * 更换手机原手机验证
   */
  updateAccount (param) {
    let postUrl = process.env.DOMAIN + '/bshop/person/account/change'
    return HttpUtil.post(postUrl, param)
  },
  /**
   * 获取智能关键字(设置关键字页面)
   */
  getKeywords () {
    let postUrl = process.env.DOMAIN + '/bshop/system/keywords/get'
    return HttpUtil.get(postUrl)
  },
  /**
   * 更新关键字(设置关键字页面)
   */
  updateKeyword (param) {
    let postUrl = process.env.DOMAIN + '/bshop/system/keywords/update'
    return HttpUtil.post(postUrl, param)
  },
  /**
   * 第三方平台代码查询
   */
  getAnalysisInfo (param) {
    let postUrl = process.env.DOMAIN + '/bshop/analysis/info'
    return HttpUtil.get(postUrl)
  },
  /**
   * 第三方平台代码查询
   */
  analysisUpdate (param) {
    let postUrl = process.env.DOMAIN + '/bshop/analysis/update'
    return HttpUtil.post(postUrl, param)
  },
  /**
   * 查询店铺Message状态接口
   */
  getMessageType () {
    let postUrl = process.env.DOMAIN + '/bshop/shop/open/message/query'
    return HttpUtil.get(postUrl)
  },
  /**
   * 设置店铺Message是否开启
   */
  saveMessageType () {
    let postUrl = process.env.DOMAIN + '/bshop/shop/open/message/save'
    return HttpUtil.post(postUrl)
  },
  /**
   * 更新智能关键字
   */
  // updateIntellKey (params) {
  //   let postUrl = process.env.DOMAIN + '/bshop/system/keywords/update'
  //   return HttpUtil.post(postUrl, params)
  // },
  /**
   * 获取智能关键字
   */
  getIntellKey (params) {
    let postUrl = process.env.DOMAIN + '/bshop/blog/keywords/get'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 保存智能关键字
   */
  saveIntellKey (params) {
    let postUrl = process.env.DOMAIN + '/bshop/blog/keywords/save'
    return HttpUtil.post(postUrl, params)
  }
}
export default systemSettingAPI
