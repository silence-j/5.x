/**
 * Created by admin on 2017/4/17.
 */
import HttpUtil from '@/common/HttpUtil'
// import Config from '@/common/config'

const registerApi = {
  /**
   * 企业查询接口
   */
  SearchCertify: function (params) {
    let getUrl = process.env.DOMAIN + '/bshop/shop/company/detail'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 开始使用店铺接口
   */
  FirstUse: function (params) {
    let getUrl = process.env.DOMAIN + '/bshop/shop/trialshop'
    return HttpUtil.post(getUrl, params)
  }

}
export default registerApi
