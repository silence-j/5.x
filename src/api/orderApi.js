/**
 * Created by shaohuan on 2017/4/12.
 * 商品
 */
import HttpUtil from '@/common/HttpUtil'

const orderAPI = {
  /**
   * 订单列表
   */
  getList (params) {
    let postUrl = process.env.DOMAIN + '/bshop/order/list'
    // let postUrl = '../static/mock/order.json'
    return HttpUtil.get(postUrl, params)
  },
  getInfo (params) {
    let postUrl = process.env.DOMAIN + '/bshop/order/info'
    // let postUrl = '../static/mock/orderinfo.json'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 物流公司列表
   */
  getCompanys (params) {
    let postUrl = process.env.DOMAIN + '/bshop/config/dict/list'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 发货
   */
  doDeliver (params) {
    let postUrl = process.env.DOMAIN + '/bshop/order/logistics/delivery'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 修改物流
   */
  doModLogist (params) {
    let postUrl = process.env.DOMAIN + '/bshop/order/logistics/update'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 修改价格
   */
  doModPrice (params) {
    let postUrl = process.env.DOMAIN + '/bshop/order/price/update'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 物流信息
   */
  getLogistList (params) {
    let postUrl = process.env.DOMAIN + '/order/waybillprocess/list'
    // let postUrl = '../static/mock/logist.json'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 关闭订单
   */
  closeOrder (params) {
    let postUrl = process.env.DOMAIN + '/bshop/order/close'
    return HttpUtil.post(postUrl, params)
  }
}
export default orderAPI
