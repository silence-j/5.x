import * as types from './types'
import contactInfoApi from '../../../api/contactInfoApi'
export const actions = {
  /**
   * 获取联系人列表
   * @param commit
   * @param params
   */
  getContactPersonList ({ commit }, params) {
    contactInfoApi.getContactPersonList(params).then((res) => {
      if (!res.data.code) {
        let contactPersonList = res.data.data.records
        let totalCount = res.data.data.totalCount
        contactPersonList.forEach((item, index) => {
          let rt = 0
          let val = +item.score
          if (val) {
            if (val < 50) {
              rt = 3.6 * val
            } else {
              rt = 3.6 * (val - 50)
            }
          }
          item.score = +item.score
          item.scoreDeg = rt
        })
        commit(types.CONTACT_PERSON_LIST, {contactPersonList})
        commit(types.CONTACT_PERSON_TOTALPAGE, {totalCount})
        commit(types.CONTACT_LOADING_TABLE, {loading: false})
      }
    })
  },
  getPersonTotalCount ({ commit }, params) {
    commit(types.CONTACT_LOADING_TABLE, {loading: true})
    contactInfoApi.getContactPersonList(params).then((res) => {
      if (!res.data.code) {
        let totalCount = res.data.data.totalCount
        commit(types.CONTACT_PERSON_TOTALPAGE, {totalCount})
        commit(types.CONTACT_LOADING_TABLE, {loading: false})
      }
    })
  },
  /**
   * 获取公司列表
   * @param commit
   * @param params
   */
  getContactCompanyList ({ commit }, params) {
    if (!params.stage && params.stage !== undefined) {
      delete params.stage
    }
    contactInfoApi.getContactCompanyList(params).then((res) => {
      if (!res.data.code) {
        let contactCompanyList = res.data.data.records
        let totalCount = res.data.data.totalCount
        // 处理评分的角度
        contactCompanyList.forEach((item, index) => {
          let rt = 0
          let val = +item.score
          if (val) {
            if (val < 50) {
              rt = 3.6 * val
            } else {
              rt = 3.6 * (val - 50)
            }
          }
          item.score = +item.score
          item.scoreDeg = rt
        })
        commit(types.CONTACT_COMPANY_LIST, {contactCompanyList})
        commit(types.CONTACT_COMPANY_TOTALPAGE, {totalCount})
        commit(types.CONTACT_LOADING_TABLE, {loading: false})
      }
    })
  },
  getCompanyTotalCount ({ commit }, params) {
    commit(types.CONTACT_LOADING_TABLE, {loading: true})
    contactInfoApi.getContactCompanyList(params).then((res) => {
      if (!res.data.code) {
        let totalCount = res.data.data.totalCount
        commit(types.CONTACT_COMPANY_TOTALPAGE, {totalCount})
        commit(types.CONTACT_LOADING_TABLE, {loading: false})
      }
    })
  },
  /**
   * 获取联系人或公司列表
   * @param dispatch
   * @param state
   * @param params
   */
  getContactList ({ dispatch, commit, state }, params) {
    commit(types.CONTACT_LOADING_TABLE, {loading: true})
    if (Object.keys(state.stageMap).length) { // 阶段已存
      state.contactType ? dispatch('getContactCompanyList', params) : dispatch('getContactPersonList', params)
    } else {
      dispatch('getStageList', () => {
        state.contactType ? dispatch('getContactCompanyList', params) : dispatch('getContactPersonList', params)
      })
    }
  },
  getPersonDetail ({ commit }, params) {
    commit(types.CONTACT_DESC_LOADING, {loading: true})
    commit(types.CONTACT_TAG_LOADING, {loading: true})
    contactInfoApi.getPersonDetail(params).then(res => {
      if (!res.data.code) {
        let base = res.data.data.base
        let desc = {
          avatar: base.avatar,
          name: base.firstName + (base.lastName || ''),
          firstName: base.firstName,
          lastName: base.lastName,
          describe: base.position
        }
        let buyerId = base.buyerId
        sessionStorage.setItem('buyerId', buyerId)
        if (base.companyId) {
          contactInfoApi.getCompanyDetail({companyId: base.companyId, isCheckCompany: 0}).then(resCp => {
            if (!resCp.data.code) {
              for (let key in resCp.data.data) {
                if (!resCp.data.data[key]) {
                  resCp.data.data[key] = []
                }
              }
              commit(types.CONTACT_COMPANY_DETAIL, {detail: resCp.data.data})
            }
          })
        } else {
          commit(types.CONTACT_COMPANY_DETAIL, {detail: {base: {}, social: [], contact: []}})
        }
        for (let key in res.data.data) {
          if (!res.data.data[key]) {
            res.data.data[key] = []
          }
        }
        commit(types.CONTACT_DETAIL, {detail: res.data.data})
        commit(types.CONTACT_DETAIL_DESC, {desc, contactTags: res.data.data.tagList || []})
        commit(types.CONTACT_DESC_LOADING, {loading: false})
        commit(types.CONTACT_TAG_LOADING, {loading: false})
      }
    })
  },
  getCompanyDetail ({ commit }, params) {
    commit(types.CONTACT_DESC_LOADING, {loading: true})
    Object.assign(params, {isCheckCompany: 1})
    contactInfoApi.getCompanyDetail(params).then(res => {
      if (!res.data.code) {
        let base = res.data.data.base
        let desc = {
          avatar: base.avatar,
          name: base.name,
          describe: base.url
        }
        let buyerId = base.buyerId
        sessionStorage.setItem('buyerId', buyerId)
        for (let key in res.data.data) {
          if (!res.data.data[key]) {
            res.data.data[key] = []
          }
        }
        commit(types.CONTACT_DETAIL_DESC, {desc, contactTags: res.data.data.tagList || []})
        commit(types.CONTACT_COMPANY_DETAIL, {detail: res.data.data})
        commit(types.CONTACT_DESC_LOADING, {loading: false})
      }
    })
  },
  getBasicInfo ({ commit, state }) {
    commit(types.CONTACT_BASIC_LOADING, {loading: true})
    commit(types.CONTACT_CMPBC_LOADING, {loading: true})
    contactInfoApi.getBasicInfo({type: 0}).then(res => {
      if (!res.data.code) {
        let basicInfo = res.data.data
        commit(types.CONTACT_DETAIL_BASICINFO, {basicInfo, type: 0})
        commit(types.CONTACT_BASIC_LOADING, {loading: false})
      }
    })
    contactInfoApi.getBasicInfo({type: 1}).then(res => {
      if (!res.data.code) {
        let basicInfo = res.data.data
        commit(types.CONTACT_DETAIL_BASICINFO, {basicInfo, type: 1})
        commit(types.CONTACT_CMPBC_LOADING, {loading: false})
      }
    })
  },
  /**
   * 获取联系人或公司详情
   * @param dispatch
   * @param state
   * @param params
   */
  getContactDetail ({ dispatch, state }, params) {
    parseInt(state.detailType) === 0 ? dispatch('getPersonDetail', {personId: params.contactId}) : dispatch('getCompanyDetail', {companyId: params.contactId})
  },
  /**
   * 获取标签接口
   * @param commit
   * @param params
   */
  getTags ({ commit, state }, params = {}) {
    contactInfoApi.getTags({
      contactType: parseInt(state.contactType)
    }).then(res => {
      if (!res.data.code) {
        commit(types.CONTACT_TAGS, {tags: res.data.data})
      }
    })
  },
  /**
   * 获取所有属性
   * @param commit
   * @param state
   */
  getAllParams ({ commit, state }) {
    contactInfoApi.getAllParams({
      type: parseInt(state.detailType)
    }).then(res => {
      if (!res.data.code) {
        let allParams = res.data.data
        let filterArray = res.data.data
        if (allParams) {
          filterArray = []
          allParams.forEach(params => {
            if (params.descrption.indexOf(state.filterText) !== -1) {
              filterArray.push(params)
            }
          })
          commit(types.CONTACT_ALL_PARAMS, {allParams: filterArray})
        }
      }
    })
  },
  /**
   * 获取timeLine
   * @param commit
   * @param state
   * @param params
   */
  getTimeLine ({ commit, state }, params) {
    commit(types.CONTACT_RECORD_LOADING, {loading: true})
    contactInfoApi.getContactTimeLine(params).then(res => {
      if (!res.data.code) {
        res.data.data.records.forEach((record, i) => {
          record.socialContent = JSON.parse(record.socialContent)
        })
        commit(types.CONTACT_TIME_LINE, {timeLine: res.data.data.records})
        commit(types.SET_TIMELINE_PAGE, {data: res.data.data})
        commit(types.CONTACT_RECORD_LOADING, {loading: false})
      }
    })
  },
  /**
   * 翻页
   * @param  {[type]} options.commit [description]
   * @param  {[type]} options.state  [description]
   * @param  {[type]} params         [description]
   * @return {[type]}                [description]
   */
  appendTimeLine ({ commit, state }, params) {
    if (state.timeLinePage.page < state.timeLinePage.totalPages) {
      params.page = state.timeLinePage.page + 1
      commit(types.CONTACT_RECORD_LOADING, {loading: true})
      contactInfoApi.getContactTimeLine(params).then(res => {
        if (!res.data.code) {
          res.data.data.records.forEach((record, i) => {
            record.socialContent = JSON.parse(record.socialContent)
          })
          commit(types.ADD_CONTACT_TIME_LINE, {timeLine: res.data.data.records})
          commit(types.SET_TIMELINE_PAGE, {data: res.data.data})
          commit(types.CONTACT_RECORD_LOADING, {loading: false})
        }
      })
    } else {
      console.log('已经是最后一页了')
    }
  },
  /**
   * 阶段
   */
  getStageList ({ commit, state }, func) {
    contactInfoApi.stageList().then(res => {
      if (!res.data.code) {
        let list = res.data.data
        let stageMap = {}
        list.forEach((item) => {
          stageMap[item.dictItemCode] = item.dictItemName
        })
        commit(types.STAGE_LIST, {stageList: res.data.data})
        commit(types.STAGE_MAP, {stageMap: stageMap})
        if (func) {
          func()
        }
      }
    })
  },
  /**
   * 获取用户信息
   */
  getUserMap ({ commit, state }) {
    let user = JSON.parse(localStorage.getItem('user'))
    let map = {}
    let list = []
    // 子账号/父账号
    if (user.parentUserId) {
      list = user.broUserList
    } else {
      list = user.subUserList
    }
    list.forEach(item => {
      item.name = item.name || item.loginAccount
      map[item.id] = item
    })
    if (!user.parentUserId) {
      map[user.userId] = {avatar: user.avatar, name: user.name || user.loginAccount}
    }
    commit(types.USER_INFO_MAP, {userInfoMap: map})
  }
  // getUserInfo ({ commit, state }, params) {
  //   contactInfoApi.getUserInfo(params).then(res => {
  //     if (!res.data.code) {
  //       let resp = res.data.data
  //       let map = {}
  //       if (resp) {
  //         map[resp.id] = resp
  //         commit(types.USER_INFO_MAP, {userInfoMap: map})
  //       }
  //     }
  //   })
  // }

}
