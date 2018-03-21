<template>
  <div>
    <div class="topMenu">
      <div class="top-title">全网监控</div>
      <ul class="menu">
        <router-link  v-for="(mItem,mindex) in menuList" :to="{ path: mItem.url}" :key="mindex">
            <li v-if="mItem.url !== '/groupMedia'" :class="{curr:mindex===selectedSubNav}" @click="changeMenu(mindex)" v-html="mItem.title">
 <!-- v-if="(mItem.url!=='/mailMonitor' || serverLevel !== '0')" -->
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
      serverLevel: 1,
      timerMonitor: 0,
      menuListCopy: [],
      menuList: [
        {
          title: '<i class="icon-font">&#xe668;</i>官网监控',
          url: '/homeMonitor',
          code: 'CC'
        },
        {
          title: '<i class="icon-font">&#xe67c;</i>社交监控',
          url: '/socialMonitor',
          code: 'CA'
        },
        {
          title: '<i class="icon-font">&#xe68b;</i>邮件监控',
          url: '/mailMonitor',
          code: 'CB'
        },
        {
          title: '<i class="icon-font">&#xe6af;</i>社媒雷达',
          url: '/socialMedia',
          code: 'CD'
        },
        {
          title: '<i class="icon-font">&#xe6d9;</i>群组监控 <span class="beta">Beta</span>',
          url: '/groupMedia',
          code: 'CE'
        }
      ]
    }
  },
  components: {},
  computed: {
    ...mapGetters(['allRights'])
  },
  watch: {
    allRights: function () {
      this.rightCompute(this.menuListCopy)
      /**
       * 判断在没有权限的情况下 手动输入路由
       */
      this.isRouterInRightArray()
    }
  },
  mounted () {
    this.menuListCopy = this.menuList
     /**
     * 权限模块
     * 普通 0
     * 引航版/普及版2
     * 超级盈店1
     * 如果 是普通用户 ，点击客户开发直接跳转到的是 社交推广tab,(客户开发tab被隐藏)
     * @type {[type]}
     */
    this.serverLevel = +window.localStorage.serverLevel
    this.rightCompute(this.menuList)
  },
  methods: {
    // 普通/引航/超级 店铺分权限
    getMenuRight () {
      let menu = ''
      if (this.serverLevel === 0) { // 普通
        menu = 'CB,CD'
      } else if (this.serverLevel === 2) { // 引航
        menu = 'CD'
      }
      return menu
    },
    /**
     * 【当前页面被取消了权限，刷新当前页面，这时候弹出到工作台页面】
     * @return {Boolean} [description]
     * fullPath => path  解决路由带search参数的问题
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
      for (let menu in avaiableTopMenue) {
        if (avaiableTopMenue[menu].title === '全网监控') {
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
      let menuRight = this.getMenuRight()
      let myRights = JSON.parse(localStorage.functions)
      let newMenuList = []
      for (let i in mlist) {
        if (this.isInRightArray(mlist[i], myRights)) {
          if (menuRight.indexOf(mlist[i].code) === -1) {
            newMenuList.push(mlist[i])
          }
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
      this.timerMonitor++
      this.$store.commit('MONITOR_TIMERMONITOR', { timerMonitor: this.timerMonitor, mindex: mindex })
    }
  }
}
</script>
<style lang='less'>
@import '../../assets/style/nav/subNav.less';
</style>
