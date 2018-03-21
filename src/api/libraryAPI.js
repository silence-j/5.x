import HttpUtil from '@/common/HttpUtil'

const libraryApi = {
  /**
   * 更新博客
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getImgUrl (params) {
    let API_KEY = '7763095-cae316d630980904e6557f440'
    let imgUrl = 'https://pixabay.com/api/?key=' + API_KEY + '&q=' + encodeURIComponent('cups')
    return HttpUtil.get(imgUrl)
  }
}
export default libraryApi
