import {getters} from './getters'
import {actions} from './actions'
import {mutations} from './mutations'

// initial state
const state = {
  dialogAddAcc: false, // 绑定新增子账号dialog
  isSelectPower: false, // 是否是新增第二步或编辑
  isEdit: false, // 是否是编辑按钮进入dialog
  dialogDeleteAcc: false, // 绑定删除子账号dialog
  dialogResetPwd: false, // 绑定重置子账号密码dialog
  childAccLoad: false, // 保存子账号列表是否需要加载
  childAccList: [], // 保存子账号列表
  funcList: [], // 保存功能列表
  allSysPower: [] // 保存所有权限code
}

export default {
  state,
  getters,
  actions,
  mutations
}
