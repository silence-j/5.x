import HttpUtil from '@/common/HttpUtil'

const chanceRecommedApi = {
  /**
   * 加载商机列表
   * @param {[type]} params [description]
   */
  getChanceList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/client/commercial/opportunity/inquiry/page'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 加载商机列表
   * @param {[type]} params [description]
   */
  addPerson (params) {
    let getUrl = process.env.DOMAIN + '/bshop/contacts/person/add'
    return HttpUtil.post(getUrl, params)
  }
}
export default chanceRecommedApi
