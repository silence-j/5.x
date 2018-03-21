/**
 * Created by admin on 2017/4/13.
 */
import HttpUtil from '@/common/HttpUtil'
// import Config from '@/common/domain'

const api = {
  /**
    获取ppc列表
   */
  getPpcList (params) {
    let postUrl = process.env.DOMAIN + '/bshop/purchaser/recommendation/list'
    return HttpUtil.get(postUrl, params)
  },
  /**
    ppc加入联系人
   */
  addPpc (params) {
    let postUrl = process.env.DOMAIN + '/bshop/contacts/person/add'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * ppc联系人详情接口
   */
  getPpcDetail (params) {
    let postUrl = process.env.DOMAIN + '/bshop/purchaser/recommendation/detail'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 推荐海关联系人LeadS列表
   */
  getLeads (params) {
    let postUrl = process.env.DOMAIN + '/bshop/client/recommend/list'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 添加联系人接口
   */
  addLeads (params) {
    let postUrl = process.env.DOMAIN + '/bshop/explore/recommend/add'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 移除联系人接口
   */
  removeContact (params) {
    let postUrl = process.env.DOMAIN + '/bshop/explore/recommend/remove'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 公司搜索页接口
   */
  companyList (params) {
    let postUrl = process.env.DOMAIN + '/bshop/explore/company/list'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 添加探索公司接口
   */
  addCompany (params) {
    let postUrl = process.env.DOMAIN + '/bshop/explore/company/add'
    return HttpUtil.post(postUrl, params)
  },
  addCompanyNow (params) {
    let postUrl = process.env.DOMAIN + '/bshop/contacts/social/add'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 公司详情接口
   */
  getCompanyDetail (params) {
    let postUrl = process.env.DOMAIN + '/bshop/contacts/company/detail'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 根据关键词搜索接口
   */
  getSearchResult (params) {
    let postUrl = process.env.DOMAIN + '/bshop/client/search/list'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 国家地区、行业列表
   */
  getCountry (params) {
    let postUrl = process.env.DOMAIN + '/bshop/config/dict/list'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 公司详情接口
   */
  getCompany (params) {
    let postUrl = process.env.DOMAIN + '/bshop/client/company/detail'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 公司下员工列表
   */
  getStaffList (params) {
    let postUrl = process.env.DOMAIN + '/bshop/client/company/employee/list'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 海关数据列表
   */
  getLeadList (params) {
    let postUrl = process.env.DOMAIN + '/bshop/purchaser/detailList'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 员工详情接口
   */
  getStaffDetail (params) {
    let postUrl = process.env.DOMAIN + '/bshop/client/employee/detail'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * facebook推荐
   */
  getFbRecommend (params) {
    let postUrl = process.env.DOMAIN + '/bshop/explore/recommend/fbSearch'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 解锁邮箱
   */
  getEmail (params) {
    let postUrl = process.env.DOMAIN + '/bshop/client/hunter/findemail'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 添加联系人4.0
   */
  addContact (params) {
    let postUrl = process.env.DOMAIN + '/bshop/client/contacts/add'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 屏蔽推荐公司
   */
  shieldCompany (params) {
    let postUrl = process.env.DOMAIN + '/bshop/detective/company/ignore'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 取消屏蔽推荐公司
   */
  cancelShield (params) {
    let postUrl = process.env.DOMAIN + '/bshop/detective/company/cancelIgnore'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 忽略公司列表
   */
  shieldCompanyList (params) {
    let postUrl = process.env.DOMAIN + '/bshop/detective/company/ignoreList'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 查询添加公司列表
   */
  addCompanyList (params) {
    let postUrl = process.env.DOMAIN + '/bshop/detective/company/addList'
    return HttpUtil.get(postUrl, params)
  },
  searchCompany (params) {
    let postUrl = process.env.DOMAIN + '/bshop/explore/company/list'
    return HttpUtil.get(postUrl, params)
  }
}
export default api
