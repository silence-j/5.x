import * as types from './types'

export const mutations = {
  [types.SETTING_ADDACC] (state, { dialogAddAcc, isEdit }) {
    state.dialogAddAcc = dialogAddAcc
    // state.isEdit = isEdit
    if (!dialogAddAcc) {
      setTimeout(() => {
        state.isEdit = isEdit
      }, 200)
    } else {
      state.isEdit = isEdit
    }
  },

  [types.SETTING_SELECTPOWER] (state, { isSelectPower }) {
    state.isSelectPower = isSelectPower
  },

  [types.SETTING_FUNCLIST] (state, { funcList }) {
    state.funcList = funcList
  },

  [types.SETTING_ALLSYSPOWER] (state, { allSysPower }) {
    state.allSysPower = allSysPower
  },

  [types.SETTING_DELETEACCOUNT] (state, { dialogDeleteAcc }) {
    state.dialogDeleteAcc = dialogDeleteAcc
  },

  [types.SETTING_RESETPASSWORD] (state, { dialogResetPwd }) {
    state.dialogResetPwd = dialogResetPwd
  },

  [types.SETTING_CHILDACCLOAD] (state, { childAccLoad }) {
    state.childAccLoad = childAccLoad
  },

  [types.SETTING_CHILDACCLIST] (state, { childAccList }) {
    state.childAccList = childAccList
  }
}
