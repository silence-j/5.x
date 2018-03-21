import HttpUtil from '@/common/HttpUtil'

const blogApi = {
  /**
   * 新增博客
   * @param {[type]} params [description]
   */
  addBlog (params) {
    let getUrl = process.env.DOMAIN + '/bshop/blog/save'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 更新博客
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  updateBlog (params) {
    let getUrl = process.env.DOMAIN + '/bshop/blog/update'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 删除博客
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  deleteBlog (params) {
    let getUrl = process.env.DOMAIN + '/bshop/blog/delete'
    return HttpUtil.post(getUrl, params)
  },
  batchDeleteBlog (params) {
    let getUrl = process.env.DOMAIN + '/bshop/blog/batchdelete'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 查询博客
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getDetail (params) {
    let getUrl = process.env.DOMAIN + '/bshop/blog/find'
    return HttpUtil.get(getUrl, params)
  },
  /**
   * 博客列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getBlogList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/blog/page'
    return HttpUtil.get(getUrl, params)
  }
}
export default blogApi
