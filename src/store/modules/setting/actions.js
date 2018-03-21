import * as types from './types'
import mulAccountApi from '../../../api/mulAccountApi'

export const actions = {
  /**
   * 获取子账户列表
   * @param commit
   * @param params
   */
  getChildAccList ({ commit }, params) {
    commit(types.SETTING_CHILDACCLOAD, {childAccLoad: true})
    mulAccountApi.getChildAccList(params).then(res => {
      if (res.data.code === 0) {
        let childAccList = res.data.data
        commit(types.SETTING_CHILDACCLIST, {childAccList})
        commit(types.SETTING_CHILDACCLOAD, {childAccLoad: false})
      }
    })
  },
  /**
   * 获取功能列表
   * @param commit
   * @param params
   */
  getFuncList ({ commit }, params) {
    mulAccountApi.getFuncList(params).then(res => {
      commit(types.SETTING_ADDACC, {dialogAddAcc: true, isEdit: true})
      if (res.data.code === 0) {
        let funcList = res.data.data
        console.log('funcList')
        console.log(funcList)
        let sysPowerList = []
        // let checkedPower = []
        funcList.forEach(list => {
          if (list.code === 'G' && list.childNodes[list.childNodes.length - 1].code === 'GE') {
            list.childNodes.pop()
          }
          // sysPowerList.push(list.code)
          list.selected ? list.selected = true : list.selected = false
          list.childNodes.forEach(parentNode => {
            sysPowerList.push(parentNode.code)
            parentNode.selected ? parentNode.selected = true : parentNode.selected = false
            // parentNode.selected && checkedPower.push(parentNode.code)
            if (parentNode.childNodes.length > 0) {
              parentNode.childNodes.forEach(childNode => {
                sysPowerList.push(childNode.code)
                childNode.selected ? childNode.selected = true : childNode.selected = false
                // childNode.selected && checkedPower.push(childNode.code)
              })
            }
          })
        })
        commit(types.SETTING_ALLSYSPOWER, {allSysPower: sysPowerList})
        commit(types.SETTING_FUNCLIST, {funcList})
      }
    })
  }
}
