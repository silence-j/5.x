const Util = {
  getAllPermissions () {
    let permissions = JSON.parse('[{"name":"我的官网","code":"A"},{"name":"页面管理","code":"AA"},{"name":"官网风格管理","code":"AB"},{"name":"官网统计","code":"AC"},{"name":"分组管理","code":"AD"},{"name":"产品管理","code":"AE"},{"name":"查看产品","code":"AEA"},{"name":"新增产品","code":"AEB"},{"name":"删除产品","code":"AEC"},' +
    '{"name":"客户开发","code":"B"},{"name":"社交搜索","code":"BA"},{"name":"社交推广","code":"BB"},{"name":"邮件营销","code":"BC"},{"name":"外贸侦探","code":"BD"},{"name":"商机推荐","code":"BE"},{"name":"询盘池","code":"BF"},' +
    '{"name":"全网监控","code":"C"},{"name":"社交监控","code":"CA"},{"name":"邮件监控","code":"CB"},{"name":"询盘监控","code":"CC"},{"name":"社媒雷达","code":"CD"},{"name":"群组监控","code":"CE"},' +
    '{"name":"联系人管理","code":"D"},{"name":"联系人","code":"DA"},{"name":"查看联系人","code":"DAA"},{"name":"删除联系人","code":"DAB"},{"name":"联系人分组","code":"DAC"},{"name":"联系人导入","code":"DAD"},{"name":"导出联系人","code":"DAE"},{"name":"公司","code":"DB"},{"name":"查看公司","code":"DBA"},{"name":"删除公司","code":"DBB"},{"name":"导入公司","code":"DBC"},{"name":"导出公司","code":"DBD"},' +
    '{"name":"订单物流","code":"E"},{"name":"订单管理","code":"EA"},{"name":"物流管理","code":"EB"},{"name":"询盘管理","code":"EC"},' + '{"name":"统计报表","code":"H"},' +
    '{"name":"创意中心","code":"F"},{"name":"智能作家","code":"FA"},{"name":"Blog","code":"FB"},{"name":"新增Blog","code":"FBA"},{"name":"删除Blog","code":"FBB"},{"name":"图源搜索","code":"FD"},{"name":"素材库","code":"FC"},{"name":"删除素材","code":"FCA"},' +
    '{"name":"其他设置","code":"G"},{"name":"关键字设置","code":"GA"},{"name":"绑定账号","code":"GB"},{"name":"跟踪代码管理","code":"GC"},{"name":"收件箱","code":"GD"},{"name":"Messagenger管理","code":"GE"}]')
    /**
     * 非超级盈店权限店铺
     */
    let permissionsServerLeverNot1 = JSON.parse('[{"name":"我的官网","code":"A"},{"name":"页面管理","code":"AA"},{"name":"官网风格管理","code":"AB"},{"name":"官网统计","code":"AC"},{"name":"分组管理","code":"AD"},{"name":"产品管理","code":"AE"},{"name":"查看产品","code":"AEA"},{"name":"新增产品","code":"AEB"},{"name":"删除产品","code":"AEC"},' +
    '{"name":"客户开发","code":"B"},{"name":"社交搜索","code":"BA"},{"name":"社交推广","code":"BB"},{"name":"邮件营销","code":"BC"},{"name":"外贸侦探","code":"BD"},{"name":"商机推荐","code":"BE"},' +
    '{"name":"全网监控","code":"C"},{"name":"社交监控","code":"CA"},{"name":"邮件监控","code":"CB"},{"name":"询盘监控","code":"CC"},{"name":"群组监控","code":"CE"},' + // 雷达
    '{"name":"联系人管理","code":"D"},{"name":"联系人","code":"DA"},{"name":"查看联系人","code":"DAA"},{"name":"删除联系人","code":"DAB"},{"name":"联系人分组","code":"DAC"},{"name":"联系人导入","code":"DAD"},{"name":"导出联系人","code":"DAE"},{"name":"公司","code":"DB"},{"name":"查看公司","code":"DBA"},{"name":"删除公司","code":"DBB"},{"name":"导入公司","code":"DBC"},{"name":"导出公司","code":"DBD"},' +
    '{"name":"订单物流","code":"E"},{"name":"订单管理","code":"EA"},{"name":"物流管理","code":"EB"},{"name":"询盘管理","code":"EC"},' + '{"name":"统计报表","code":"H"},' +
    '{"name":"智能作家","code":"FA"},{"name":"Blog","code":"FB"},{"name":"新增Blog","code":"FBA"},{"name":"删除Blog","code":"FBB"},{"name":"图源搜索","code":"FD"},{"name":"素材库","code":"FC"},{"name":"删除素材","code":"FCA"},' + // 创意中心
    '{"name":"其他设置","code":"G"},{"name":"关键字设置","code":"GA"},{"name":"绑定账号","code":"GB"},{"name":"跟踪代码管理","code":"GC"},{"name":"收件箱","code":"GD"},{"name":"Messagenger管理","code":"GE"}]')
    return window.localStorage.serverLevel === '1' ? permissions : permissionsServerLeverNot1
  },
  checkUrl: function (url) {
    if (url) {
      if (url.substr(0, 8).toLowerCase() !== 'https://') {
        return url.substr(0, 7).toLowerCase() === 'http://' ? url : 'http://' + url
      } else {
        return url
      }
    } else {
      return ''
    }
  },
   /**
   * 当前权限是否在权限数组里
   * @param  {[type]}  thisRight  [description]
   * @param  {[type]}  rightArray [description]
   * @return {Boolean}            [description]
   */
  hasRightByCode: function (code) {
    let rightArray = JSON.parse(localStorage.functions)
    let isIn = rightArray.some(function (it) {
      return it.code === code
    })
    /**
     * 如果 thisRight.code 是空  【工作台的code为空】，默认显示
     * @param  {[type]} thisRight.code [description]
     * @return {[type]}                [description]
     */
    if (code === '') {
      return true
    } else {
      return isIn
    }
  }
}
export default Util
