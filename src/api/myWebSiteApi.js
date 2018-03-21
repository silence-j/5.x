/**
 * @author monkeywang
 * Date: 17/4/25
 */
import HttpUtil from '@/common/HttpUtil'
let configDomain = process.env.DOMAIN
let imgDomain = process.env.IMG_DOMAIN
const myWebSiteApi = {
  /**
   * 预览提交
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  commit (params) {
    return HttpUtil.post(configDomain + '/bshop/preview/commit', params)
  },
  clean (params) {
    return HttpUtil.get(configDomain + '/bshop/preview/clean', params)
  },
  /**
   * 轮播图
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  saveCarousel (params) {
    return HttpUtil.post(configDomain + '/bshop/shop/banner/update', params)
  },
  /**
   * 设置产品到首页
   * @param {[type]} params [description]
   */
  setProductToIndex (params) {
    return HttpUtil.post(configDomain + '/bshop/product/toindex', params)
  },
  /**
   * 广告位编辑
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  saveAdv (params) {
    return HttpUtil.post(configDomain + '/bshop/shop/advert/update', params)
  },
  /**
   * 产品位编辑
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  saveProduct (params) {
    return HttpUtil.post(configDomain + '/bshop/product/position/save', params)
  },
  /**
   * 保存底部导航
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  saveFoot (params) {
    return HttpUtil.post(configDomain + '/bshop/aboutus/save', params)
  },
  /**
   * 设置公司
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  saveAbout (params) {
    return HttpUtil.post(configDomain + '/bshop/company/desc/modify', params)
  },
  /**
   * 产品列表
   * @param  {[type]} parmas [description]
   * @return {[type]}        [description]
   */
  getProductList (parmas) {
    return HttpUtil.get(configDomain + '/bshop/product/position/list', parmas)
  },
  /**
   * 公司描述
   * @param  {[type]} parmas [description]
   * @return {[type]}        [description]
   */
  // getCompanyDesc (parmas) {
  //   return HttpUtil.get(configDomain + '/bshop/aboutus/desc/detail', parmas)
  // },
  sortProductList (parmas) {
    return HttpUtil.get(configDomain + '/bshop/product/sort', parmas)
  },
  /**
   * 位置code。轮播图："BANNAER"； 背景图："BACKGROUND"； 广告位："AD"；Contacts页背景图："CONTACTS"。
   * @param  {[type]} parmas [description]
   * @return {[type]}        [description]
   */
  getAdvert (parmas) {
    return HttpUtil.get(configDomain + '/bshop/shop/guide/show', parmas)
  },
  getProfile (params) {
    return HttpUtil.get(configDomain + '/buyer/aboutus/company/find', params)
  },
  /**
   * [店铺信息查询接口（店铺logo，底部导航信息） description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getCompanyDetail (params) {
    return HttpUtil.get(configDomain + '/bshop/aboutus/contact/detail', params)
  },
  getContactImg (params) {
    return HttpUtil.get(configDomain + '/bshop/shop/guide/show', params)
  },
  /**
   * 上传头像
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  uploadLogo (params) {
    return HttpUtil.post(imgDomain + '/bshop/config/pic/upload', params, true)
  },
  /**
   * 保存图
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  changeLogo (params) {
    return HttpUtil.post(configDomain + '/bshop/company/logo/modify', params)
  },
  /**
   * 获取用户域名信息
   * @param params
   * @returns {*|AxiosPromise}
   */
  getCompanyDomain () {
    return HttpUtil.get(configDomain + '/bshop/config/domain/get')
  },
  /**
   * contacts背景图编辑接口
   * @param params
   * @returns {AxiosPromise|*}
   */
  contactBanner (params) {
    return HttpUtil.post(configDomain + '/bshop/shop/contactsbg/update', params)
  },
  /**
   * 保存博客背景图
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  saveBlogBanner (params) {
    return HttpUtil.post(configDomain + '/bshop/shop/blog/banner/update', params)
  },
  /**
   * products背景图编辑接口
   */
  productBanner (params) {
    return HttpUtil.post(configDomain + '/bshop/shop/background/update', params)
  },
  /**
   * 得到店铺域名设置信息接口
   */
  getDomain () {
    return HttpUtil.get(configDomain + '/bshop/config/domain/get')
  },
  /**
   * 修改域名
   */
  updateDomain (params) {
    return HttpUtil.post(configDomain + '/bshop/config/domain/update', params)
  },
  /**
   * company背景图编辑接口
   */
  companyBanner (params) {
    return HttpUtil.post(configDomain + '/bshop/company/background/modify', params)
  },
  /**
   * company简介编辑
   */
  updateDesc (params) {
    return HttpUtil.post(configDomain + '/bshop/company/desc/modify', params)
  },
  /**
   * company信息查询
   */
  companydetail (params) {
    return HttpUtil.get(configDomain + '/bshop/company/business/detail', params)
  },
  /**
   * company页简介查询（背景图，图片，描述）
   */
  findCompanyPage () {
    return HttpUtil.get(configDomain + '/bshop/shop/company/find')
  },
  /**
   * company信息修改
   */
  updateInfo (params) {
    return HttpUtil.post(configDomain + '/bshop/company/business/update', params)
  },
  /**
   * company资质列表
   */
  getCertList () {
    return HttpUtil.get(configDomain + '/bshop/company/cert/list')
  },
  /**
   * company资质编辑（暂时不用）
   */
  updateCertModify (params) {
    return HttpUtil.post(configDomain + '/bshop/company/cert/modify', params)
  },
  /**
   * company资质新增（暂时不用）
   */
  addCertModify (params) {
    return HttpUtil.post(configDomain + '/bshop/company/cert/create', params)
  },
  /**
   * 保存资质修改
   */
  saveCertOrder (params) {
    return HttpUtil.post(configDomain + '/bshop/company/cert/save', params)
  },
  /**
   * 获取币种列表
   */
  getCurrencyList () {
    return HttpUtil.get(configDomain + '/bshop/config/currency/list')
  },
  /**
   * 支付方式列表
   */
  getPayList () {
    return HttpUtil.get(configDomain + '/bshop/config/pay/listall')
  },
  /**
   * 下载文件列表
   */
  getFileList (param) {
    return HttpUtil.get(configDomain + '/bshop/content/file/list', param)
  },
  /**
   * 下载文件列表操作保存
   */
  saveFileList (param) {
    return HttpUtil.post(configDomain + '/bshop/content/file/add', param)
  },
  /**
   * 删除下载列表
   */
  removeFile (param) {
    return HttpUtil.get(configDomain + '/bshop/content/file/delete', param)
  },
  /**
   * 上传文件保存
   */
  saveUploadFile (param) {
    return HttpUtil.post(configDomain + '/bshop/content/file/add', param)
  },
  /**
   * 查询TDK
   */
  getTdk (param) {
    return HttpUtil.get(configDomain + '/bshop/seo/query', param)
  },
  /**
   * 保存TDK
   */
  saveTdk (param) {
    return HttpUtil.post(configDomain + '/bshop/seo/save', param)
  },
  /**
   * 修改保存TDK
   */
  updateTdk (param) {
    return HttpUtil.post(configDomain + '/bshop/seo/update', param)
  }
}
export default myWebSiteApi
