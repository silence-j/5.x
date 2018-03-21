/**
 * Created by admin on 2017/4/12.
 */
import HttpUtil from '@/common/HttpUtil'

const createShopAPI = {
  /**
   * 获取省份
   */
  getProvince () {
    let postUrl = process.env.DOMAIN + '/bshop/config/province/list'
    return HttpUtil.get(postUrl)
  },
  /**
   * 获取市
   */
  getCityList (param) {
    let postUrl = process.env.DOMAIN + '/bshop/config/city/list'
    return HttpUtil.get(postUrl, param)
  },
  /**
   * 创建公司
   */
  createShopfunc (param) {
    let postUrl = process.env.DOMAIN + '/bshop/shop/add'
    return HttpUtil.post(postUrl, param)
  },
  /**
   * 企业店铺信息修改接口
   */
  updateShopfunc (param) {
    let postUrl = process.env.DOMAIN + '/bshop/shop/update'
    return HttpUtil.post(postUrl, param)
  },
  /**
   * 企业详细信息
   */
  companyDetail (param) {
    let postUrl = process.env.DOMAIN + '/bshop/shop/company/detail'
    return HttpUtil.get(postUrl, param)
  }
}
export default createShopAPI
