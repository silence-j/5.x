/**
 * Created by admin on 2017/4/12.
 */
import HttpUtil from '@/common/HttpUtil'

const schoolAPI = {
  /**
   * 文章列表分页
   */
  getArticleList (params) {
    let postUrl = process.env.DOMAIN + '/bshop/article/page'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 获取登录信息
   */
  getLoginInfo () {
    let postUrl = process.env.DOMAIN + '/bshop/person/account/info'
    return HttpUtil.get(postUrl)
  },
  /**
   * 查询详情
   */
  selArticleDetail (params) {
    console.log(params)
    let postUrl = process.env.DOMAIN + '/bshop/article/find'
    return HttpUtil.get(postUrl, params)
  }
}
export default schoolAPI

