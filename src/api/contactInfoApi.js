/**
 * @author monkeywang
 * Date: 17/4/22
 */
import HttpUtil from '@/common/HttpUtil'
let configDomain = process.env.DOMAIN
const contactInfoApi = {
  /**
   * 获取联系人列表接口
   * @param params
   */
  getContactPersonList (params) {
    return HttpUtil.get(configDomain + '/bshop/contacts/list', params)
  },
  /**
   * 拿系统头像
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getAdv (params) {
    return HttpUtil.get(configDomain + '/bshop/channel/getAvatars', params)
  },
  /**
   * 获取赞的状态
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getZanStatus (params) {
    return HttpUtil.get(configDomain + '/bshop/opportunity/getStatus', params)
  },
  /**
   * 标记/取消标记 为重要接口
   * @param params
   */
  contactsMajor (params) {
    return HttpUtil.get(configDomain + '/contacts/update/major', params)
  },
  /**
   * 获取公司列表
   * @param params
   */
  getContactCompanyList (params) {
    // return HttpUtil.get('../static/mock/linker.json', params)
    return HttpUtil.get(configDomain + '/bshop/contacts/company/list', params)
  },
  /**
   * 联系人时间线-访问记录详情
   * @param params
   */
  getFootprintDetail (params) {
    return HttpUtil.get(configDomain + '/bshop/contacts/timeline/footprint/detail', params)
  },
  /**
   * 获取联系人详细信息
   * @param params
   */
  getPersonDetail (params) {
    return HttpUtil.get(configDomain + '/bshop/contacts/person/detail', params)
  },
  /**
   * 获取公司详细信息
   * @param params
   */
  getCompanyDetail (params) {
    return HttpUtil.get(configDomain + '/bshop/contacts/company/detail', params)
  },
  /**
   * 时间线取消置顶
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  cancelTop (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/timeline/cancelStick', params)
  },
  /**
   * 删除联系人
   * @param params
   */
  deletePersonList (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/person/delete', params)
  },
  /**
   * 删除公司
   * @param params
   */
  deleteCompanyList (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/company/delete', params)
  },
  /**
   * 更新联系人重要接口
   * @param params
   */
  updatePersonMajor (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/person/updatemajor', params)
  },
  /**
   * 更新公司重要接口
   * @param params
   */
  updateCompanyMajor (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/company/updatemajor', params)
  },
  /**
   * 获取标签集合
   * @param params
   */
  getTags (params) {
    return HttpUtil.get(configDomain + '/bshop/contacts/tag/list', params)
  },
  /**
   * 获取联系人基本信息接口
   * @param params
   */
  getBasicInfo (params) {
    return HttpUtil.get(configDomain + '/bshop/contacts/show/list', params)
  },
  /**
   * 新增联系人
   */
  addPerson (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/person/add', params)
  },
  /**
   * 新增公司
   */
  addComp (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/company/add', params)
  },
  /**
   * 删除联系人标签接口
   * @param params
   */
  deletePersonTags (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/persontag/delete', params)
  },
  /**
   * 增加联系人标签
   * @param params
   * @returns {*|AxiosPromise}
   */
  addPersonTags (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/persontag/add', params)
  },
  /**
   * 删除显示属性
   * @param params
   * @returns {*|AxiosPromise}
   */
  deleteParams (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/show/delete', params)
  },
  /**
   * 排序显示属性
   * @param params
   * @returns {*|AxiosPromise}
   */
  sortParams (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/show/update', params)
  },
  /**
   * 查询全部可用字段
   * @param params
   * @returns {*|AxiosPromise}
   */
  getAllParams (params) {
    return HttpUtil.get(configDomain + '/bshop/contacts/show/query', params)
  },
  /**
   * 获取联系TimeLine
   * @param params
   */
  getContactTimeLine (params) {
    return HttpUtil.get(configDomain + '/bshop/contacts/timeline/list', params)
  },
  /**
   * 更新联系人信息
   * @param params
   */
  contactPersonUpdate (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/person/update', params)
  },
  /**
   * 更新公司信息
   * @param params
   */
  contactCompanyUpdate (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/company/update', params)
  },
  /**
   * 添加联系备注
   * @param params
   */
  contactCommentAdd (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/comment/add', params)
  },
  /**
   * 合并联系人
   * @param params
   */
  mergePerson (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/person/merge', params)
  },
  /**
   * 添加联系人标签
   * @param params
   * @returns {*|AxiosPromise}
   */
  personTagAdd (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/persontag/add', params)
  },
  /**
   * 用户发消息接口
   * @param params
   * @returns {*|AxiosPromise}
   */
  socialUserSend (params) {
    return HttpUtil.post(configDomain + '/bshop/scrm/message/twitter/add', params)
  },
  /**
   * 渠道列表接口
   * @param params
   * @returns {*|AxiosPromise}
   */
  channelShopList (params) {
    return HttpUtil.get(configDomain + '/bshop/channel/shop/list', params)
  },
  /**
   * 添加显示属性
   * @param params
   */
  queryShowAdd (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/show/add', params)
  },
  /**
   * 公司添加标签
   * @param params
   */
  companyTagAdd (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/company/addtag', params)
  },
  /**
   * 修改备注
   * @param params
   */
  commentUpdate (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/comment/update', params)
  },
  /**
   * 修改备注
   * @param params
   */
  commentDelete (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/comment/delete', params)
  },
  /**
   * 发送邮件
   */
  sendMail (params) {
    return HttpUtil.post(configDomain + '/channel/mail/send', params)
  },
  /**
   * 发送邮件新
   */
  sendMailNew (params) {
    return HttpUtil.post(configDomain + '/bshop/mail/send/send', params)
  },
  /**
   * 文件上传接口
   */
  fileUpload (params) {
    return HttpUtil.post(configDomain + '/bshop/config/file/upload', params, true)
  },
  /**
   * 导入联系人
   */
  importContact (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/import', params)
  },
  /**
   * 上传头像
   */
  uploadAvatar (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/avatar/update', params, true)
  },
  /**
   * 添加员工
   */
  addCompanyPerson (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/company/addemployee', params)
  },
  /**
   * 为员工添加公司
   */
  addPersonCompany (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/person/updateCompany', params)
  },
  /**
   * 检查官网是否已经存在
   * @param params
   */
  checkCompanyUrl (params) {
    return HttpUtil.get(configDomain + '/bshop/contacts/company/checkurl', params)
  },
  /**
   * 删除公司标签接口
   */
  deleteCompanyTag (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/tag/contacts/delete', params)
  },
  /**
   * 回复推特
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  replyTwitter (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/social/reply', params)
  },
  /**
   * 转发推特
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  reTwitter (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/social/share', params)
  },
  /**
   * 回复推特私信
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  replyChatingTwitter (params) {
    return HttpUtil.post(configDomain + '/bshop/scrm/message/add', params)
  },
  /**
   * 点赞接口
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  zanTwitter (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/social/content/like', params)
  },
  emailUpload (params) {
    return HttpUtil.post('https://fs.onloon.co/upload/simple', params)
  },
  // 添加分组
  addGroup (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/group/add', params)
  },
  // 删除分组
  deleteGroup (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/group/delete', params)
  },
  // 查询分组
  getGroupList () {
    return HttpUtil.get(configDomain + '/bshop/contacts/group/list')
  },
  // 修改分组
  updateGroup (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/group/updateName', params)
  },
  // 修改联系人所在分组
  updateContactGroup (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/group/item/update', params)
  },
  // 查询联系人所有国家
  getAllCountry () {
    return HttpUtil.get(configDomain + '/bshop/contacts/person/getAllCountry')
  },
  // 查询联系人所有国家
  getAllCountryTwo () {
    return HttpUtil.get(configDomain + '/bshop/contacts/company/getAllCountry')
  },
  // 公司分配
  distribCompany (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/company/subuser/assign', params)
  },
  // 联系人分配
  distribLinker (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/person/subuser/assign', params)
  },
  // 阶段字典
  stageList () {
    return HttpUtil.get(configDomain + '/bshop/contacts/dict/item/list?dictCode=contacts_stage')
  },
  // 修改阶段
  stageModify (params) {
    return HttpUtil.post(configDomain + '/bshop/contacts/stage/update', params)
  },
  // 根据userId获取头像 名字
  getUserInfo (params) {
    return HttpUtil.get(configDomain + '/bshop/person/getUserById', params)
  },
  // 导出联系人
  exportLinker (params) {
    console.log(params)
    window.location.href = configDomain + '/bshop/contacts/excel/export' + params
  },
  // 导出公司
  exportComp (params) {
    console.log(params)
    window.location.href = configDomain + '/bshop/contacts/company/excel/export' + params
  }
}
export default contactInfoApi
