import * as types from './types'

export const mutations = {
  [types.MAIL_CHANNELLIST] (state, { channelList }) {
    state.channelList = channelList
  },

  [types.MAIL_MAILPAGE] (state, { mailPage }) {
    state.mailPage = mailPage
  }
}
