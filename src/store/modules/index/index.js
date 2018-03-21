import * as types from '../../mutation-types'
import IndexAPI from '../../../api/indexAPI'
const SET_ALL_RIGHTS = 'SET_ALL_RIGHTS'
const SET_AVAILABLE_TOP_NAV = 'SET_AVAILABLE_TOP_NAV'
const SET_RED_POINT = 'SET_RED_POINT'
// const ADSENTER = 'ADSENTER'

const state = {
  firstNav: '', // 一级菜单选中
  mailRedPoint: false,
  availableTopNav: [],
  allRights: '',
  adsEnter: false,
  adsBar: false
}

const getters = {
  firstNav: state => state.firstNav,
  mailRedPoint: state => state.mailRedPoint,
  allRights: state => state.allRights,
  availableTopNav: state => state.availableTopNav,
  adsEnter: state => state.adsEnter,
  adsBar: state => state.adsBar
}

const mutations = {
  [types.FIRSTNAV] (state, { rec }) {
    state.firstNav = rec
  },
  [SET_RED_POINT] (state, mailFlag) {
    state.mailRedPoint = mailFlag
  },
  [SET_ALL_RIGHTS] (state, { allrights }) {
    state.allRights = allrights
  },
  [SET_AVAILABLE_TOP_NAV] (state, nav) {
    state.availableTopNav = nav
  },
  [types.ADSENTER] (state, { adsEnter }) {
    state.adsEnter = adsEnter
  },
  [types.ADSBAR] (state, { adsBar }) {
    state.adsBar = adsBar
  }
}

const actions = {
  setNavIndex ({ commit }, rec) {
    commit(types.FIRSTNAV, { rec })
  },
  /**
   * 收件箱 红点
   * @param {[type]} options.commit [description]
   */
  updateMailRedPoint ({ commit }) {
    IndexAPI.getMailAmount().then(res => {
      if (res.data.data === 0) {
        commit(SET_RED_POINT, false)
      } else {
        commit(SET_RED_POINT, true)
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
