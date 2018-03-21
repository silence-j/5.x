import HttpUtil from '@/common/HttpUtil'
import Config from '@/common/config'

const api = {
  /**
   *  获取加密RSA PublicKey
   * @return {[type]} [description]
   */
  getRSAPublicKey (params) {
    let postUrl = Config.mock ? 'static/mock/dealList.json' : process.env.DOMAIN + '/bshop/login/key/get'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 登录
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  login (params) {
    let postUrl = process.env.DOMAIN + '/bshop/login'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 注册
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  register (params) {
    let postUrl = process.env.DOMAIN + '/bshop/register/confirm'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 拿手机验证码 (忘记密码)
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getPhoneVcode (params) {
    let postUrl = process.env.DOMAIN + '/bshop/sms/send'
    return HttpUtil.post(postUrl, params)
  },
   /**
   * 拿手机验证码 （注册）
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getRegisterPhoneVcode (params) {
    let postUrl = process.env.DOMAIN + '/bshop/sms/send'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 验证手机验证码
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  validatePhoneVcode (params) {
    let postUrl = process.env.DOMAIN + '/bshop/forget/password/validcode'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 设置新密码
   * @param {[type]} params [description]
   */
  setNewPwd (params) {
    let postUrl = process.env.DOMAIN + '/bshop/forget/password/new'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 退出登录
   *
   */
  logOut (params) {
    let postUrl = process.env.DOMAIN + '/bshop/logout'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 获取登录账户信息
   */
  accountInfo () {
    let postUrl = process.env.DOMAIN + '/bshop/person/account/info'
    return HttpUtil.get(postUrl)
  },
  /*
  * 获取登录token
  * */
  getLoginToken () {
    let getUrl = process.env.DOMAIN + '/api/operation/getToken'
    return HttpUtil.get(getUrl)
  }
}
export default api
