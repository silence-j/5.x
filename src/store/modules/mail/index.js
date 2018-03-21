import {getters} from './getters'
import {actions} from './actions'
import {mutations} from './mutations'

// initial state
const state = {
  channelList: [], // 绑定账号列表
  mailPage: {
    page: 1,
    pageSize: 10,
    totalCount: 10
  } // 保存当前列表分页参数
}

export default {
  state,
  getters,
  actions,
  mutations
}
