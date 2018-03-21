<template>
  <div>
    <div class="topMenu">
      <div class="top-title">客户开发</div>
      <ul class="menu">
        <router-link  v-for="(mItem,mindex) in menuList" :to="{ path: mItem.url}" :key="mindex" v-if="mItem.url !== '/develop' || serverLevel!==0">
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
      serverLevel: 1,
      menuList: [
        {
          title: '<i class="icon-font">&#xe6ae;</i>外贸侦探',
          url: '/tradeDetect',
          code: 'BD'
        },
        {
          title: '<i class="icon-font">&#xe668;</i>询盘池',
          url: '/enquiriesIndex',
          code: 'BF'
        },
        {
          title: '<i class="icon-font">&#xe690;</i>社交搜索',
          url: '/develop',
          code: 'BA'
        },
        {
          title: '<i class="icon-font">&#xe67e;</i>社交推广',
          url: '/extension',
          code: 'BB'
        },
        {
          title: '<i class="icon-font">&#xe6e9;</i>活动营销',
          url: '/Activitymarketing',
          code: 'BE'
        },
        {
          title: '<i class="icon-font">&#xe6c2;</i>邮件营销',
          url: '/emailmarketing',
          code: 'BC'
        }
      ],
      pageName: this.$route.path,
      menuRight: ''
    }
  },
  mounted () {
    this.serverLevel = +window.localStorage.serverLevel
    this.menuListCopy = this.menuList
    this.rightCompute(this.menuList)
  },
  computed: {
    ...mapGetters(['allRights'])
  },
  methods: {
    // 普通/引航/超级 店铺分权限
    getMenuRight () {
      let menu = ''
      if (this.serverLevel === 0) { // 普通
        menu = 'BA,BC,BF,BE' // ,CB,CD
      } else if (this.serverLevel === 2) { // 引航
        menu = 'BF' // ,CD
      }
      return menu
    },
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
      if (this.$route.path.indexOf('emailmarket') > 0) {
        this.selectedSubNav = 5
      }
      /**
       * 设置一级菜单
       * @type {[type]}
       */
      let usid = localStorage.userId
      let avaiableTopMenue = JSON.parse(localStorage['topBar' + usid])
      // console.log(avaiableTopMenue)
      for (let menu in avaiableTopMenue) {
        if (avaiableTopMenue[menu].title === '客户开发') {
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
          /**
           * 邮件营销 serverLevel!=0显示
           * @param  {[type]} mlist[i].code [description]
           * @return {[type]}               [description]
           */
          // if (mlist[i].code === 'BC') {
          //   if (this.serverLevel !== 0) {
          //     newMenuList.push(mlist[i])
          //   }
          // } else {
          //   newMenuList.push(mlist[i])
          // }
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
      this.$store.commit('DEVELOP_KEYWORD', {keyWord: ''})
      this.selectedSubNav = mindex
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path.indexOf('emailmarketing') > 0) {
        this.isShowSearch = true
      } else {
        this.isShowSearch = false
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
