/**
 * Created by admin on 2017/4/12.
 */
import HttpUtil from '@/common/HttpUtil'

const websiteStyleAPI = {
  /**
   * 获取官网风格列表
   */
  getTemplateList () {
    let postUrl = process.env.DOMAIN + '/bshop/config/template/list'
    return HttpUtil.get(postUrl)
  },
  /**
   * 获取官网风格列表
   */
  templateSave (parame) {
    let postUrl = process.env.DOMAIN + '/bshop/templaterela/save'
    return HttpUtil.post(postUrl, parame)
  }
}
export default websiteStyleAPI

