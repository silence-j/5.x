import * as types from './types'
import Vue from 'vue'
let vm = new Vue()
export const mutations = {
  [types.CONTACT_PERSON_LIST] (state, { contactPersonList }) {
    state.contactPersonList = contactPersonList
  },

  [types.CONTACT_PERSON_TOTALPAGE] (state, { totalCount }) {
    state.contactPersonCount = totalCount
  },
  [types.FILTER_TYPE] (state, { filterType }) {
    state.filterType = filterType
  },
  [types.CONTACT_COMPANY_LIST] (state, { contactCompanyList }) {
    state.contactCompanyList = contactCompanyList
  },

  [types.CONTACT_COMPANY_TOTALPAGE] (state, { totalCount }) {
    state.contactCompanyCount = totalCount
  },

  [types.CONTACT_TYPE] (state, { contactType }) {
    state.contactType = contactType
  },
  // 详情标签
  [types.CONTACT_DETAIL_DESC] (state, { desc, contactTags }) {
    state.contactTags = contactTags
    state.desc = desc
  },

  [types.CONTACT_DETAIL_BASICINFO] (state, { basicInfo, type }) {
    type ? state.companyBasicInfo = basicInfo : state.personBasicInfo = basicInfo
  },

  [types.CONTACT_DETAIL_PARAMS] (state, { contactId, detailType }) {
    state.contactId = contactId
    state.detailType = detailType
  },
  // 列表所有标签
  [types.CONTACT_TAGS] (state, { tags }) {
    state.tags = tags
  },

  [types.CONTACT_DETAIL] (state, { detail }) {
    state.contactDetail = detail
  },

  [types.CONTACT_ALL_PARAMS] (state, { allParams }) {
    state.allParams = allParams
  },

  [types.CONTACT_TIME_LINE] (state, { timeLine }) {
    state.timeLine = timeLine
  },

  [types.SET_TIMELINE_PAGE] (state, { data }) {
    console.log(data)
    state.timeLinePage.totalPages = data.totalPages
    state.timeLinePage.page = data.page
  },

  [types.ADD_CONTACT_TIME_LINE] (state, { timeLine }) {
    state.timeLine = state.timeLine.concat(timeLine)
  },
  [types.CONTACT_EDITOR_PERSON] (state, { editorPerson }) {
    state.editorPerson = editorPerson
  },

  [types.CONTACT_EDITOR_COMPANY] (state, { editorCompany }) {
    state.editorCompany = editorCompany
  },

  [types.CONTACT_TAGS_CHANGE] (state, { index, active }) {
    vm.$set(state.tags[index], 'active', active)
  },

  [types.CONTACT_COMPANY_DETAIL] (state, { detail }) {
    state.companyDetail = detail
  },

  [types.CONTACT_LOADING_TABLE] (state, { loading }) {
    state.loadingTable = loading
  },

  [types.CONTACT_BASIC_LOADING] (state, { loading }) {
    state.basicLoading = loading
  },

  [types.CONTACT_CMPBC_LOADING] (state, { loading }) {
    state.cmpBcLoading = loading
  },

  [types.CONTACT_DESC_LOADING] (state, { loading }) {
    state.descLoading = loading
  },

  [types.CONTACT_TAG_LOADING] (state, { loading }) {
    state.tagLoading = loading
  },

  [types.CONTACT_RECORD_LOADING] (state, { loading }) {
    state.recordLoading = loading
  },
  // 详情标签修改
  [types.CONTACT_DETAIL_TAG_CHANGE] (state, { tags }) {
    let arrstr = ''
    state.contactTags.forEach((item) => {
      arrstr += item.tag + ';'
    })
    tags.forEach((tag) => {
      if (!arrstr.includes(tag + ';')) {
        state.contactTags.push({tag: tag})
      }
    })
  },

  [types.CONTACT_IS_ADDED] (state, { type }) {
    state.isAdded = type
  },

  [types.CONTACT_FILTER_TEXT] (state, { filterText }) {
    state.filterText = filterText
  },

  [types.CONTACT_ISEDITOVER] (state, { isEditOver }) {
    state.isEditOver = isEditOver
  },
  [types.LINKER_TO_MAIL] (state, {linkerToMail}) {
    state.linkerToMail = linkerToMail
  },
  [types.STAGE_LIST] (state, {stageList}) {
    state.stageList = stageList
  },
  [types.STAGE_MAP] (state, {stageMap}) {
    state.stageMap = stageMap
  },
  [types.ADD_COMPANY] (state, { type }) {
    state.addCompany = type
  },
  [types.ADD_ORNOT] (state, { type }) {
    state.addOrNot = type
  },
  [types.ADD_COMPANYID] (state, { id }) {
    state.addCompanyId = id
  },
  [types.USER_INFO_MAP] (state, {userInfoMap}) {
    state.userInfoMap = userInfoMap
  }
  // [types.USER_INFO_MAP] (state, {userInfoMap}) {
  //   for (let key in userInfoMap) {
  //     state.userInfoMap[key] = userInfoMap[key]
  //   }
  // }
}
