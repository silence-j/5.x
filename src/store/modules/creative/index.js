import * as types from '../../mutation-types'

const state = {
  fromIntellAuthor: false // 是否从智能作家来
}

const getters = {
  fromIntellAuthor: state => state.fromIntellAuthor
}

const mutations = {
  [types.FROMAUTHOR] (state, fromIntellAuthor) {
    state.fromIntellAuthor = fromIntellAuthor
  }
}
const actions = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
