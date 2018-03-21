import actApi from '../../../api/activityApi'
import * as types from '../../mutation-types'

const state = {
  activitytList: [],
  upstatus: 0,
  copyActivity: {},
  sublist: [],
  actloading: true,
  addactivity: {},
  updateactivity: {}
}

const getters = {
  activitytList: state => state.activitytList,
  sublist: state => state.sublist,
  upstatus: state => state.upstatus,
  copyActivity: state => state.copyActivity,
  actloading: state => state.actloading,
  actmodelList: state => state.actmodelList,
  addactivity: state => state.addactivity,
  updateactivity: state => state.updateactivity
}

const mutations = {
  [types.ACTIVITYS] (state, { rec }) {
    state.activitytList = rec
  },
  [types.SUBLIST] (state, {sublist}) {
    state.sublist = sublist
  },
  [types.UPDATESTATUS] (state, {upstatus}) {
    state.upstatus = upstatus
  },
  [types.COPYACTIVITY] (state, {copyActivity}) {
    state.copyActivity = copyActivity
  },
  [types.ACT_LOAD] (state, {actloading}) {
    state.actloading = actloading
  },
  [types.ACTMODELLIST] (state, {actmodelList}) {
    state.actmodelList = actmodelList
  },
  [types.ADDACTIVITY] (state, {addactivity}) {
    state.addactivity = addactivity
  },
  [types.UPDATEACTIVITY] (state, {updateactivity}) {
    state.updateactivity = updateactivity
  }
}
const actions = {
  getActivityList ({ commit }, params) {
    actApi.getactList(params).then(res => {
      let rec = res.data.data
      if (rec) {
        for (var i = 0; i < rec.records.length; i++) {
          if (rec.records[i].activityStatus === 1) {
            rec.records[i].activityStatus = true
          } else {
            rec.records[i].activityStatus = false
          }
        }
        commit(types.ACTIVITYS, { rec })
        commit(types.ACT_LOAD, {actloading: false})
      } else {
        commit(types.ACT_LOAD, {actloading: false})
      }
    })
  },
  getSubuser ({ commit }) {
    actApi.getSubuser().then(res => {
      commit(types.SUBLIST, { res })
    })
  },
  updateStatus ({ commit }) {
    actApi.updateStatus().then(res => {
      commit(types.UPDATESTATUS, { res })
    })
  },
  copyActivity ({ commit }) {
    actApi.copyActivity().then(res => {
      commit(types.COPYACTIVITY, { res })
    })
  },
  getActmodelList ({ commit }) {
    actApi.getActmodelList().then(res => {
      commit(types.ACTMODELLIST, { res })
    })
  },
  addActivity ({ commit }) {
    actApi.addActivity().then(res => {
      commit(types.ADDACTIVITY, { res })
    })
  },
  updateActivity ({ commit }) {
    actApi.addActivity().then(res => {
      commit(types.UPDATEACTIVITY, { res })
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
