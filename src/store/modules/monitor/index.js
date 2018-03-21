import {getters} from './getters'
import {actions} from './actions'
import {mutations} from './mutations'

// initial state
const state = {
  textContent: '',
  socialMediaCompanyInfo: {},
  isLimit: false,
  index: 0,
  bindingList: [],
  opportunityType: '6;4;5;9;10;7',
  bindingMail: {},
  timerMonitor: 0,
  mindex: -1
}

export default {
  state,
  getters,
  actions,
  mutations
}
