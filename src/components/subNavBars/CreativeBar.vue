<template>
  <div>
    <div class="topMenu">
      <div class="top-title">创意中心</div>
      <ul class="menu">
        <router-link  v-for="(mItem,mindex) in menuList" :to="{ path: mItem.url, query: { type: mItem.type}}" :key="mindex">
            <li :class="{curr:mindex===selectedSubNav}" @click="changeMenu(mindex, mItem.type)" v-html="mItem.title">
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

export default {
  data () {
    return {
      selectedSubNav: 0,
      menuListCopy: [],
      menuList: [
        {
          title: '<i class="icon-font">&#xe68a;</i>智能作家',
          url: '/intellAuthor',
          code: 'FA'
        },
        {
          title: '<i class="icon-font">&#xe659;</i>Blog',
          url: '/blog',
          code: 'FB'
        },
        {
          title: '<i class="icon-font">&#xe6c8;</i>图源搜索',
          url: '/searchList',
          code: 'FD'
        },
        {
          title: '<i class="icon-font">&#xe6ac;</i>素材库',
          url: '/material',
          code: 'FC'
        }
      ]
    }
  },
  mounted () {
    this.menuListCopy = this.menuList
    this.rightCompute(this.menuList)
    // this.isBindEmail()
  },
  computed: {
    ...mapGetters(['allRights'])
  },
  methods: {
    /**
     * 【当前页面被取消了权限，刷新当前页面，这时候弹出到工作台页面】
     * @return {Boolean} [description]
     */
    isRouterInRightArray () {
      let thisRouterPath = this.$router.currentRoute.path
      let isHasRight = this.menuList.some(function (it) {
        return it.url === thisRouterPath
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
      for (let menuIndex in this.menuList) {
        if (this.$route.path === this.menuList[menuIndex].url) {
          this.selectedSubNav = parseInt(menuIndex)
        }
      }
      /**
       * 设置一级菜单
       * @type {[type]}
       */
      let usid = localStorage.userId
      let avaiableTopMenue = JSON.parse(localStorage['topBar' + usid])
      console.log(avaiableTopMenue)
      for (let menu in avaiableTopMenue) {
        if (avaiableTopMenue[menu].title === '创意中心') {
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
    changeMenu (mindex) {
      this.selectedSubNav = mindex
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path.indexOf('intellAuthor') > 0) {
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
  }
}
</script>
<style lang='less'>
@import '../../assets/style/nav/subNav.less';
 .topMenu{
   .menu li{
     position: relative;
     .mark{
       position: absolute;
       right: -27px;
       top: 2px;
       background: #FF3B6E;
       color: #fff;
       font-size: 12px;
       padding: 2px 3px;
       border-radius: 2px;
       transform: scale(0.75);
     }
   }
 }
</style>
