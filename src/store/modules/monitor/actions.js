import * as types from './types'
import socialMediaAPI from '../../../api/socialMedia'

export const actions = {
  getCompanyInfo ({ commit }, params) {
    socialMediaAPI.getFbAbout(params).then((res) => {
      if (!res.data.code) {
        let info = res.data.data || {}
        console.log(info)
        commit(types.SET_SOCIALMEDIA_COMPANYINFO, info)
      }
    })
  }
}
