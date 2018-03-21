import HttpUtil from '@/common/HttpUtil'
import Config from '@/common/config'

const contactApi = {
  /**
   * 个人详情
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getPersonDetail (params) {
    let postUrl = Config.mock ? '../static/mock/personDetail.json' : process.env.DOMAIN + '/bshop/person/account/info'
    return HttpUtil.get(postUrl, params)
  }
}
export default contactApi
