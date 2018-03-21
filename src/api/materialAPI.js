import HttpUtil from '@/common/HttpUtil'

const materialAPI = {
  getDirTree (params) {
    let url = process.env.DOMAIN + '/bshop/fodder/manager/getDirTree'
    return HttpUtil.get(url, params)
  },
  createDir (params) {
    let url = process.env.DOMAIN + '/bshop/fodder/manager/createDir'
    return HttpUtil.post(url, params)
  },
  getFileList (params) {
    let url = process.env.DOMAIN + '/bshop/fodder/manager/getDir'
    return HttpUtil.get(url, params)
  },
  moveDir (params) {
    let url = process.env.DOMAIN + '/bshop/fodder/manager/move'
    return HttpUtil.post(url, params)
  },
  deleteFile (params) {
    let url = process.env.DOMAIN + '/bshop/fodder/manager/delete'
    return HttpUtil.post(url, params)
  },
  renameFile (params) {
    let url = process.env.DOMAIN + '/bshop/fodder/manager/rename'
    return HttpUtil.post(url, params)
  },
  getStorage (params) {
    let url = process.env.DOMAIN + '/bshop/fodder/manager/getStorage'
    return HttpUtil.get(url, params)
  },
  downloadFile (params) {
    let url = process.env.DOMAIN + '/bshop/fodder/download'
    return HttpUtil.get(url, params)
  },
  uploadImg (params) {
    let url = process.env.DOMAIN + '/bshop/fodder/addFile'
    return HttpUtil.post(url, params)
  },
  searchImg (params) {
    let url = process.env.DOMAIN + '/bshop/image/search'
    return HttpUtil.get(url, params)
  },
  saveImg (params) {
    let url = process.env.DOMAIN + '/bshop/image/save'
    return HttpUtil.get(url, params)
  }
}

export default materialAPI
