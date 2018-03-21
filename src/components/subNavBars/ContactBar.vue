<template>
  <div>
     <div class="topMenu">
      <div class="top-title">联系人管理</div>
      <ul class="menu">
        <router-link  v-for="(mItem,mindex) in menuList" :to="{ path: mItem.url, query: { type: mItem.type}}" :key="mindex">
            <li :class="{curr:mindex===selectedSubNav}" @click="changeMenu(mindex, mItem.type)" style="min-width: 104px;">
              <span v-html="mItem.title"></span>&nbsp
              <span v-if="mItem.code=='DA' && selectedSubNav==0" class="person-count">
                <span v-if="personTotalCount > 100 || contactPersonCount > 100">
                  <span v-if="personTotalCount > 100">
                    ({{contactPersonCount==-1?'99+':contactPersonCount}})
                  </span>
                  <span v-if="contactPersonCount > 100">
                    ({{contactPersonCount==-1?personTotalCount:'99+'}})
                  </span>
                  <!--({{contactPersonCount==-1?personTotalCount + '+':contactPersonCount + '+'}})-->
                </span>
                <span v-else="">({{contactPersonCount==-1?personTotalCount:contactPersonCount}})</span>
              </span>
              <span v-else-if="mItem.code=='DB' && selectedSubNav==1">
                <span v-if="companyTotalCount > 100 || contactCompanyCount > 100">
                  <span v-if="companyTotalCount > 100">
                    ({{contactCompanyCount==-1?'99' + '+':contactCompanyCount}})
                  </span>
                  <span v-if="contactCompanyCount > 100">
                    ({{contactCompanyCount==-1?companyTotalCount:'99' + '+'}})
                  </span>
                  <!--({{contactCompanyCount==-1?companyTotalCount:contactCompanyCount}})-->
                </span>
                <span v-else="">({{contactCompanyCount==-1?companyTotalCount:contactCompanyCount}})</span>
              </span>
            </li>
        </router-link>
      </ul>
    </div>
    <div class="router-view">
      <router-view></router-view>
    </div>
  </div>

</template>
<script>
import { mapGetters } from 'vuex'
// import contactInfoApi from '../../../src/api/contactInfoApi'
export default {
  data () {
    return {
      selectedSubNav: 0,
      menuListCopy: [],
      personTotalCount: 0,
      companyTotalCount: 0,
      menuList: [
        {
          title: '<i class="icon-font">&#xe689;</i>联系人',
          url: '/contact',
          type: 0,
          code: 'DA'
        },
        {
          title: '<i class="icon-font">&#xe638;</i>公司',
          url: '/contact',
          type: 1,
          code: 'DB'
        }
      ]
    }
  },
  mounted () {
    this.menuListCopy = this.menuList
    this.rightCompute(this.menuList)
  },
  computed: {
    ...mapGetters(['allRights']),
    contactCompanyCount () {
      return this.$store.getters.contactCompanyCount
    },
    contactPersonCount () {
      return this.$store.getters.contactPersonCount
    }
  },
  watch: {
    $route () {
      if (parseInt(this.$route.query.type) === 1) {
        this.selectedSubNav = 1
      } else {
        this.selectedSubNav = 0
      }
      /**
       * 当只有一个tab的时候，第一个tab被选中
       * @param  {[type]} this.menuList.length [description]
       * @return {[type]}                      [description]
       */
      if (this.menuList.length === 1) {
        this.selectedSubNav = 0
      }
    },
    allRights: function () {
      this.rightCompute(this.menuListCopy)
      /**
       * 判断在没有权限的情况下 手动输入路由
       */
      this.isRouterInRightArray()
    }
  },
  methods: {
     /**
     * 【当前页面被取消了权限，刷新当前页面，这时候弹出到工作台页面】
     * @return {Boolean} [description]
     */
    isRouterInRightArray () {
      let thisRouterPath = this.$router.currentRoute.path
      /**
       *  联系人这边 实现有点不一样
       *  判断  url  是 /contact 并且 是联系人
       * @param  {[type]} it) {                   return (it.url [description]
       * @return {[type]}     [description]
       */
      let isHasRight = this.menuList.some(function (it) {
        return (it.url === thisRouterPath && it.type === 0) || ((it.url + '?type=' + it.type) === thisRouterPath)
      })
      if (!isHasRight) {
        this.$router.push({ path: '/index' })
      }
    },
    /**
     * 根据路由 设置selectedSubNav
     */
    setSelectedTab () {
      this.$store.dispatch('setNavIndex', '')
      if (parseInt(this.$route.query.type) === 1) {
        this.selectedSubNav = 1
      } else {
        this.selectedSubNav = 0
      }
      /**
       * 当只有一个tab的时候，第一个tab被选中
       * @param  {[type]} this.menuList.length [description]
       * @return {[type]}                      [description]
       */
      if (this.menuList.length === 1) {
        this.selectedSubNav = 0
      }
      /**
       * 设置一级菜单
       * @type {[type]}
       */
      let usid = localStorage.userId
      let avaiableTopMenue = JSON.parse(localStorage['topBar' + usid])
      for (let menu in avaiableTopMenue) {
        if (avaiableTopMenue[menu].title === '联系人管理') {
          // 选中一级菜单
          this.$store.dispatch('setNavIndex', parseInt(menu))
        }
      }
    },
    /**
     * 权限重新计算
     * @return {[type]} [description]
     */
    rightCompute (mlist) {
      if (!localStorage.functions) {
        return
      }
      let myRights = JSON.parse(localStorage.functions)
      let newMenuList = []
      for (let i in mlist) {
        if (this.isInRightArray(mlist[i], myRights)) {
          newMenuList.push(mlist[i])
        }
      }
      this.menuList = newMenuList
      this.setSelectedTab()
    },
    /**
     * 当前权限是否在权限数组里
     * @param  {[type]}  thisRight  [description]
     * @param  {[type]}  rightArray [description]
     * @return {Boolean}            [description]
     */
    isInRightArray (thisRight, rightArray) {
      let isIn = rightArray.some(function (it) {
        return it.code === thisRight.code
      })
      return isIn
    },
    changeMenu (mindex, type) {
      this.selectedSubNav = mindex
      this.$store.commit('CONTACT_TYPE', {contactType: type})
      // 变更菜单时获取联系人或者公司列表
      this.$store.dispatch('getContactList', {companyId: '', size: 10, page: 1, filter: -1})
      this.$store.commit('FILTER_TYPE', {filterType: -1})
    }
  }
}
</script>
<style lang='less'>
@import '../../assets/style/nav/subNav.less';
</style>
