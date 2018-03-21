import {getters} from './getters'
import {actions} from './actions'
import {mutations} from './mutations'

// initial state
const state = {
  isAddExtension: false,
  isAddImgExtension: false,
  isMoveDialogVisible: false,
  isAddSuccess: false,
  sendData: [],
  sendDatas: [],
  sendType: -1,
  isEditExtension: false,
  isEditSuccess: false,
  detail: {},
  bindingList: [],
  boardList: [],
  bindingListNew: [],
  channelType: '',
  contactId: '',
  accountId: '',
  companyId: '',
  tradeCompanyId: '',
  searchPage: 1,
  sendInfo: {},
  ismDirty: false,
  keyWord: '',
  emailContentList: '[]',
  isTiming: '',
  ismenuclick: false,
  // 存储交易记录的列表长度，以决定右侧联系人模块长度（外贸侦探详情）
  recordLength: 0,
  activityContentList: '[]',
  activitySendInfo: {
    first: {},
    second: '',
    third: {},
    four: {}
  },
  previewTable: ''
}

export default {
  state,
  getters,
  actions,
  mutations
}
