/**
 * 活动
 */
import HttpUtil from '@/common/HttpUtil'

const activityApi = {
  /**
   * 活动列表
   */
  getactList (params) {
    let data = {size: 10, page: 1}
    Object.assign(data, params)
    let postUrl = process.env.DOMAIN + '/bshop/shop/activity/marketing/list'
    return HttpUtil.get(postUrl, data)
  },
  /**
   * 获取子账号信息
   */
  getSubuser () {
    let postUrl = process.env.DOMAIN + '/bshop/subUser/list'
    return HttpUtil.get(postUrl)
  },
  /**
   * 活动删除
   */
  deleteActivity (params) {
    let postUrl = process.env.DOMAIN + '/bshop/shop/activity/marketing/delete'
    return HttpUtil.get(postUrl, params)
  },
  // 修改活动状态
  updateStatus (params) {
    let postUrl = process.env.DOMAIN + '/bshop/shop/activity/marketing/updateStatus'
    return HttpUtil.get(postUrl, params)
  },
  copyActivity (pramer) {
    let postUrl = process.env.DOMAIN + '/bshop/shop/activity/marketing/copy'
    return HttpUtil.get(postUrl, pramer)
  },
  // 获取活动营销模板列表
  getActmodelList (params) {
    let postUrl = process.env.DOMAIN + '/bshop/marketing/template/list'
    return HttpUtil.get(postUrl, params)
  },
  // 添加活动营销
  addActivity (params) {
    let postUrl = process.env.DOMAIN + '/bshop/shop/activity/marketing/add'
    return HttpUtil.post(postUrl, params)
  },
  // 修改更新活动信息
  updateActivity (params) {
    return HttpUtil.post(process.env.DOMAIN + '/bshop/shop/activity/marketing/update', params)
  }
}
export default activityApi
