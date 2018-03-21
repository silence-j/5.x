/**
 * Created by admin on 2017/4/12.
 */
import HttpUtil from '@/common/HttpUtil'

const fileUploadAPI = {
  /**
   * 联系人导入记录
   */
  getImportRecord (params) {
    let postUrl = process.env.DOMAIN + '/bshop/contacts/import/record/page'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 联系人导入记录下载
   */
  fileDownload (params) {
    let postUrl = process.env.DOMAIN + '/bshop/contacts/import/record/download'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 联系人导入
   */
  fileImport (params) {
    let postUrl = process.env.DOMAIN + '/bshop/contacts/import/execute'
    return HttpUtil.post(postUrl, params)
  }
}
export default fileUploadAPI
