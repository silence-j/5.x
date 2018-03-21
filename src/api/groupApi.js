/**
 * Created by shaohuan on 2017/4/12.
 * 商品
 */
import HttpUtil from '@/common/HttpUtil'

const groupAPI = {
  getList (params) {
    let data = {size: 10, productStatus: -1, page: 1}
    // data.page = params.page
    Object.assign(data, params)
    let postUrl = process.env.DOMAIN + '/bshop/product/list'
    return HttpUtil.get(postUrl, data)
  },
  /**
   * 组列表
   */
  getGroupList (params) {
    let postUrl = process.env.DOMAIN + '/bshop/product/group/list'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 所有组
   */
  getGroup () {
    let postUrl = process.env.DOMAIN + '/bshop/product/group/listall'
    return HttpUtil.get(postUrl)
  },
  /**
   * 新增分组
   */
  addGroup (params) {
    let postUrl = process.env.DOMAIN + '/bshop/product/group/add'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 编辑分组
   */
  modGroup (params) {
    let postUrl = process.env.DOMAIN + '/bshop/product/group/update'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 删除
   */
  delGroup (params) {
    let postUrl = process.env.DOMAIN + '/bshop/product/group/delete'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 分组和置顶
   */
  topAndGroup (params) {
    let postUrl = process.env.DOMAIN + '/bshop/product/group/moveproducts'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 分组排序
   */
  groupSort (params) {
    let postUrl = process.env.DOMAIN + '/bshop/product/group/sort'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 商品排序
   */
  productSort (params) {
    let postUrl = process.env.DOMAIN + '/bshop/product/sort'
    return HttpUtil.post(postUrl, params)
  }
}
export default groupAPI
