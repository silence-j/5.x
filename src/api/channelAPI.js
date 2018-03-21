/**
 * Created by admin on 2017/4/12.
 */
import HttpUtil from '@/common/HttpUtil'

const channelAPI = {
  /**
   * 绑定渠道列表查询
   */
  getAllChannel () {
    let postUrl = process.env.DOMAIN + '/bshop/channel/shop/list'
    return HttpUtil.get(postUrl)
  },
  /**
   * 解除绑定
   */
  unBundled (pramer) {
    let type = pramer.typestr
    let postUrl = process.env.DOMAIN + '/channel/' + type + '/removebind'
    return HttpUtil.get(postUrl)
  },
  /**
   * 公共主页解绑
   */
  unHomepage (pramer) {
    let postUrl = process.env.DOMAIN + '/bshop/channel/removepage'
    return HttpUtil.post(postUrl, pramer)
  },
  /**
   * 绑定
   */
  oAuth (pramer) {
    let type = pramer.type
    let lost = location.protocol + '//' + window.location.host + '/#/back/1/'
    let pramerobj = {callbackHtml: lost}
    let postUrl = process.env.DOMAIN + '/channel/' + type + '/outh/binding'
    return HttpUtil.get(postUrl, pramerobj)
  },
  /**
   * 绑定邮箱
   */
  bindEmail (pramer) {
    let postUrl = process.env.DOMAIN + '/channel/mail/binding'
    return HttpUtil.post(postUrl, pramer)
  },
  /**
   * facebook个人主页获取
   */
  selFacebookHomelist () {
    let postUrl = process.env.DOMAIN + '/channel/facebook/homepagelist'
    return HttpUtil.get(postUrl)
  },
  /**
   * linkedin公司获取
   */
  selLinkedinComlist () {
    let postUrl = process.env.DOMAIN + '/channel/linkedin/companylist'
    return HttpUtil.get(postUrl)
  },
  /**
   * facebook个人主页绑定
   */
  bindFacebookHome (param) {
    let postUrl = process.env.DOMAIN + '/channel/facebook/bindhomepage'
    return HttpUtil.post(postUrl, param)
  },
  /**
   * linkedin公司绑定
   */
  bindLinkedinCom (param) {
    let postUrl = process.env.DOMAIN + '/channel/linkedin/bindcompanypage'
    return HttpUtil.get(postUrl, param)
  }
}
export default channelAPI
