/**
 * Created by hideyoshi on 2017/6/23.
 */

import HttpUtil from '@/common/HttpUtil'

const mulAccountApi = {
  /**
   * 查询子账号列表
   * @return {[type]}        [description]
   */
  getChildAccList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/subUser/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 新增子账户
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  addChildAccount (params) {
    let postUrl = process.env.DOMAIN + '/bshop/subUser/add'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 删除子账户
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  delChildAccount (params) {
    let postUrl = process.env.DOMAIN + '/bshop/subUser/delete'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 发送重置密码邮件
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  sendResetMail (params) {
    let postUrl = process.env.DOMAIN + '/bshop/subUser/sendRestMail'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 验证重置密码链接是否可用
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  checkCode (params) {
    let getUrl = process.env.DOMAIN + '/bshop/subUser/checkCode'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 重置子账户密码
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  resetPassword (params) {
    let postUrl = process.env.DOMAIN + '/bshop/subUser/resetPassword'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 查询功能列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getFuncList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/subUser/function/list'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 更新功能列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  updateFuncList (params) {
    let postUrl = process.env.DOMAIN + '/bshop/subUser/updateFunction'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 子账号统计接口
   */
  subsetCount (params) {
    let getUrl = process.env.DOMAIN + '/bshop/subUser/statistics'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 重新分配账号
   */
  redistr (params) {
    return HttpUtil.post(process.env.DOMAIN + '/bshop/subUser/redistribute', params)
  },
  /**
   * 用户登录操作记录
   */
  userHistory: function (params) {
    let getUrl = process.env.DOMAIN + '/bshop/subUser/reportHistory'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 统计概况
   */
  reportCount: function (params) {
    let getUrl = process.env.DOMAIN + '/bshop/subUser/report'
    return HttpUtil.get(getUrl, params)
  }
}
export default mulAccountApi
