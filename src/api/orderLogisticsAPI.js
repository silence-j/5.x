/**
 * Created by admin on 2017/4/21.
 */
/**
 * Created by admin on 2017/4/12.
 */
import HttpUtil from '@/common/HttpUtil'

const orderLogisticsAPI = {
  /**
   * 获取物流模板
   */
  getLogisticsTmpl (parame) {
    let postUrl = process.env.DOMAIN + '/bshop/logistics/freighttemplate/list'
    return HttpUtil.get(postUrl, parame)
  },
  /**
   * 设置地址界面
   * @param  {[type]} parame [description]
   * @return {[type]}        [description]
   */
  getZhouAndCountry (parame) {
    let postUrl = process.env.DOMAIN + '/bshop/config/continent/listwithcountrys'
    return HttpUtil.get(postUrl, parame)
  },
  /**
   * 删除模板
   * @param  {[type]} parame [description]
   * @return {[type]}        [description]
   */
  deleteTmpl (parame) {
    let postUrl = process.env.DOMAIN + '/bshop/logistics/freighttemplate/delete'
    return HttpUtil.get(postUrl, parame)
  },
  /**
   * 更新运费组合
   * @param  {[type]} parame [description]
   * @return {[type]}        [description]
   */
  updateFreight (parame) {
    let postUrl = process.env.DOMAIN + '/bshop/logistics/freighttemplate/update'
    return HttpUtil.post(postUrl, parame)
  },
  /**
   * 增加 运费组合
   * @param {[type]} parame [description]
   */
  addFreight (parame) {
    let postUrl = process.env.DOMAIN + '/bshop/logistics/freighttemplate/add'
    return HttpUtil.post(postUrl, parame)
  },
  /**
   * 默认模板
   * @param {[type]} parame [description]
   */
  setDefaultTmpl (parame) {
    let postUrl = process.env.DOMAIN + '/bshop/logistics/freighttemplate/setdefault'
    return HttpUtil.get(postUrl, parame)
  },
  /**
   * 查询 物流模板详情
   * @param  {[type]} parame [description]
   * @return {[type]}        [description]
   */
  getLogisticsDetail (parame) {
    let postUrl = process.env.DOMAIN + '/bshop/logistics/freighttemplate/detail'
    return HttpUtil.get(postUrl, parame)
  },

  /**
   * 是否绑定账户
   */
  isBindAccount (parame) {
    let postUrl = process.env.DOMAIN + '/bshop/capital/paypal/querydetail'
    return HttpUtil.get(postUrl, parame)
  },
  /**
   * 获取资金收益信息
   */
  getStatisticsData () {
    let postUrl = process.env.DOMAIN + '/bshop/capital/shop/statistics'
    return HttpUtil.get(postUrl)
  },
  /**
   * 绑定
   */
  bindAccount () {
    let lost = location.protocol + '//' + window.location.host + '/#/back/2/'
    let pramerobj = {callbackHtml: lost}
    let postUrl = process.env.DOMAIN + '/bshop/capital/paypal/binding'
    return HttpUtil.get(postUrl, pramerobj)
  },
  /**
   * 解除绑定
   */
  removeAccount () {
    let postUrl = process.env.DOMAIN + '/bshop/capital/paypal/remove'
    return HttpUtil.post(postUrl)
  },
  /**
   * 交易记录列表
   */
  getTransactionList (param) {
    let postUrl = process.env.DOMAIN + '/bshop/capital/shop/flowpage'
    return HttpUtil.get(postUrl, param)
  }
}
export default orderLogisticsAPI
