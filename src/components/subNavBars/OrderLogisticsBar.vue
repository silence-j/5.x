<template>
  <div>
    <div class="topMenu">
      <div class="top-title">订单物流</div>
      <ul class="menu">
        <router-link  v-for="(mItem,mindex) in menuList" :to="{ path: mItem.url}" :key="mindex">
            <li :class="{curr:mindex===selectedSubNav}" @click="changeMenu(mindex)" v-html="mItem.title">
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
          title: '<i class="icon-menuorder"></i>订单管理',
          url: '/order',
          code: 'EA'
        },
        // {
          // title: '<svg class="icon icon-active" abase.lessria-hidden="true"> <use xlink:href="#icon-wuliu"></use> </svg><svg class="icon icon-unactive" abase.lessria-hidden="true"> <use xlink:href="#icon-wuliu1"></use> </svg>评论管理',
          // url: '/order'
        // },
        {
          title: '<span class="icon-font">&#xe66c;</span>物流管理',
          url: '/logisticsManagement',
          code: 'EB'
        },
        {
          title: '<span class="icon-font">&#xe693;</span>资金管理',
          url: '/fundsManagement',
          code: 'EC'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['allRights'])
  },
  watch: {
    '$route' (to, from) {
      if (to.path.indexOf('order') > 0) {
        this.selectedSubNav = 0
      }
    },
    allRights: function () {
      console.log('allRights变了')
      this.rightCompute(this.menuListCopy)
      /**
       * 判断在没有权限的情况下 手动输入路由
       */
      this.isRouterInRightArray()
    }
  },
  mounted () {
    this.menuListCopy = this.menuList
    this.rightCompute(this.menuList)
  },
  components: {},
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
      /**
       * 从编辑产品 窗口跳到 增加运费模板界面
       * @param  {[type]} !isHasRight &&            thisRouterPath ! [description]
       * @return {[type]}             [description]
       */
      if (!isHasRight && thisRouterPath !== '/logisticsSetAddress') {
        this.$router.push({ path: '/index' })
      }
    },
     /**
     * 根据路由 设置selectedSubNav
     */
    setSelectedTab () {
      // 选中一级菜单
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
        if (avaiableTopMenue[menu].title === '订单物流') {
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
  }
}
</script>
<style lang='less'>
@import '../../assets/style/nav/subNav.less';
</style>
