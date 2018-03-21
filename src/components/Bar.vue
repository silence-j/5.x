<template>
  <div>
    <div class="bar">
      <div class="logo">
        <img src="../assets/img/logo.svg" width="99">
      </div>
      <ul>
        <li v-for="(bar,barIndex) in navbarList" @click="changeBar(barIndex)" :class="{selected:firstNav?firstNav===barIndex:showNav===barIndex}">
          <router-link :to="bar.url" :class="title==bar.title? 'active': ''" v-html="bar.title"></router-link>
        </li>

      </ul>
      <div class="bar-right">
        <template v-if="mailRight()">
          <el-tooltip class="item" effect="dark" content="收件箱" placement="top">
           <span  style="position:relative;display:inline-block;margin-right: 23px;width: 20px;" v-show="probationEmail">
             <span class="icon email-enter" @click="linkToMail">&#xe614;</span>
            <!--<svg class="icon email-enter" aria-hidden="true" @click="linkToMail">-->
              <!--<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-xiaoxi"></use>-->
            <!--</svg>-->
            <span class="mail-red-point" v-show="mailRedPoint"></span>
          </span>
          </el-tooltip>
          <!-- <a href="" target="_blank" class="helper-down">
            <img src="../assets/img/index/helper.png" alt="">
          </a> -->
        </template>
        <el-dropdown @command="handleCommand" class="barDrop">
          <span class="el-dropdown-link">
          <div class="head-img">
            <img v-if="src" :src="`${src}?x-oss-process=image/resize,h_32`" alt="">
            <img v-else src="../assets/img/default_avatar.jpg" alt="">
          </div>
            <i class="el-icon-caret-bottom el-icon--right" style="font-size:10px;"></i>
           </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="set">设置</el-dropdown-item>
            <el-dropdown-item command="exit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </div>
    </div>
  </div>
</template>
<script>
import LoginAPI from '@/api/loginAPI'
import IndexAPI from '@/api/indexAPI'
// import router from '@/router'
import { mapGetters } from 'vuex'
import Util from '@/common/Util'
export default {
  name: 'bar',
  data () {
    return {
      probationEmail: false,
      adsToken: '',
      adsUrl: process.env.ADS_DOMAIN + '/account?token=',
      title: '工作台',
      showNav: 0,
      serverLevel: '1',
      src: '',
      isMain: window.localStorage.getItem('isMainAccount'),
      navbarList: [
        {
          title: '工作台',
          url: '/index',
          code: ''
        },
        {
          title: '我的官网',
          url: '/pageManagement',
          code: 'A'
        },
        {
          title: '客户开发',
          url: '/tradeDetect',
          code: 'B'
        },
        {
          title: '创意中心',
          url: '/intellAuthor',
          code: 'F'
        },
        {
          title: '全网监控',
          url: '/homeMonitor',
          code: 'C'
        },
        {
          title: '联系人管理',
          url: '/contact',
          code: 'D'
        },
        {
          title: '订单物流',
          url: '/order',
          code: 'E'
        },
        {
          title: '统计报表',
          url: '/form',
          code: 'H'
        }
      ]
    }
  },
  mounted: function () {
    if (this.isMain === 'false') {
      this.navbarList = this.navbarList.slice(0, 7)
    }
    this.$store.dispatch('updateMailRedPoint')
    this.isAdsBar({'dictCode': 'SWITCH'})
    this.getAdsToken()
    /**
     * 初始化 每个 一级tab 的链接
     */
    this.initCorrectUrlOfBar()
    /**
     * 权限模块
     * 普通 0
     * 引航版/普及版2
     * 超级盈店1
     * 如果 是普通用户 ，点击客户开发直接跳转到的是 社交推广tab,(客户开发tab被隐藏)
     * @type {[type]}
     */
    this.serverLevel = window.localStorage.serverLevel
    //    是否是试用账号，邮箱是否隐藏
    this.isHideEmail()
    if (this.serverLevel === '0') {
      this.navbarList[2].url = '/tradeDetect'
      this.navbarList[4].url = '/homeMonitor'    // 设置第5个菜单选项跳转指定页面
    }
    /**
     * 为 整个nabbar弄一个原始副本
     * @type {[type]}
     */
    let navBarListCopy = this.navbarList
    /**
     * 先初始化一次权限[这次权限是之前缓存的] 为了防止出现  每次刷新菜单跳动
     * 如果权限不变，页面就不变，如果权限增加，页面仔请求回调里会增加
     * 如果没有这个函数，那 每次初始化的时候都是满的权限，然后再请求完后得到最新权限（这个体验不好）
     */
    this.rightCompute(navBarListCopy)
    LoginAPI.accountInfo().then(res => {
      if (res.data.code === 0) {
        this.src = res.data.data.avatar
        window.localStorage.serverLevel = res.data.data.serverLevel
        /**
         * 重新获取权限 数组
         * @type {[type]}
         * @subUserId => parentUserId
         */
        let formatedFunctions = this.rightJsonFormator(res.data.data.functions, res.data.data.userId, res.data.data.parentUserId)
        window.localStorage.functions = JSON.stringify(formatedFunctions)
        this.$store.commit('SET_ALL_RIGHTS', {allrights: JSON.stringify(formatedFunctions)})
        /**
         *重新根据最新权限计算
         */
        this.rightCompute(navBarListCopy)
      }
    })
  },
  watch: {
  },
  computed: {
    ...mapGetters(['firstNav', 'mailRedPoint'])
  },
  methods: {
    /**
     * 最外层 是否有邮箱权限
     * 第二层是 判断是否是试用期
     * @return {[type]} [description]
     */
    mailRight () {
      return Util.hasRightByCode('GD')
    },
    isHideEmail () {
      let sLever = parseInt(window.localStorage.serverLevel)
      if (window.localStorage.isProbation === 'false' && sLever !== 0) {
        this.probationEmail = true
      } else {
        this.probationEmail = false
      }
    },
//    bar ads
    isAdsBar (param) {
      IndexAPI.isAds(param).then(res => {
        if (!res.data.code) {
          if (res.data.data[0].dictdataCode === '1' && window.localStorage.isProbation === 'false') {
            this.$store.commit('ADSBAR', {adsBar: true})
          }
        }
      })
    },
    /**
     * 初始化每个一级菜单点击后的 正确链接 （原本的第一个二级菜单可能会被隐藏）
     * @return {[type]} [description]
     */
    initCorrectUrlOfBar () {
      /**
       * sessionStorage失效的时候（新打开tab）, 直接跳转到登录页面进行重新登录
       * @type {Array}
       */
      let myRights = []
      if (localStorage.functions) {
        myRights = JSON.parse(localStorage.functions)
      }
      // 二级菜单
      let homePageTab = [ {title: '页面管理', url: '/pageManagement', code: 'AA'}, {title: '官网风格', url: '/websiteStyle', code: 'AB'}, {title: '分组管理', url: '/Group', code: 'AD'}, {title: '产品列表', url: '/product', code: 'AE'}, {title: '官网统计', url: '/webCount', code: 'AC'} ]
      let customerPageTab = [{title: '外贸侦探<p class="mark">Beta</p>', url: '/tradeDetect', code: 'BD'}, {title: '询盘池', url: '/enquiriesIndex', code: 'BD'}, {title: '发现客户', url: '/develop', code: 'BA'}, {title: '社交推广', url: '/extension', code: 'BB'}, {title: '邮件营销', url: '/emailmarketing', code: 'BC'}]
      let creativePageTab = [ {title: '智能作家', url: '/intellAuthor', code: 'FA'}, {title: 'Blog', url: '/blog', code: 'FB'}, {title: '图源搜索', url: '/searchList', code: 'FD'}, {title: '素材库', url: '/material', code: 'FC'} ]
      let monitorPageTab = [ {title: '官网监控', url: '/homeMonitor', code: 'CC'}, {title: '社交监控', url: '/socialMonitor', code: 'CA'}, {title: '邮件监控', url: '/mailMonitor', code: 'CB'}, {title: '社媒监控', url: '/socialMedia', code: 'CD'} ]
      let contactPageTab = [ {title: '联系人', url: '/contact', type: 0, code: 'DA'}, {title: '公司', url: '/contact?type=1', type: 1, code: 'DB'} ]
      let orderLogisticPageTab = [ {title: '订单管理', url: '/order', code: 'EA'}, {title: '物流管理', url: '/logisticsManagement', code: 'EB'}, {title: '资金管理', url: '/fundsManagement', code: 'EC'} ]
      let formPageTab = [ {title: '统计报表', url: '/form', code: 'H'} ]
      // let homePageTab = [ {title: '<span class="icon-font">&#xe671;</span>页面管理', url: '/pageManagement', code: 'AA'}, {title: '<span class="icon-font">&#xe69f;</span>官网风格', url: '/websiteStyle', code: 'AB'}, {title: '<i class="icon-font">&#xe664;</i>分组管理', url: '/Group', code: 'AD'}, {title: '<i class="icon-font">&#xe687;</i>产品列表', url: '/product', code: 'AE'}, {title: '<i class="icon-font">&#xe6cf;</i>官网统计', url: '/webCount', code: 'AC'} ]
      // let customerPageTab = [{title: '<i class="icon-font">&#xe689;</i>外贸侦探<p class="mark">Beta</p>', url: '/tradeDetect', code: 'BD'}, {title: '<i class="icon-font">&#xe668;</i>询盘池', url: '/enquiriesIndex', code: 'BD'}, {title: '<i class="icon-font">&#xe690;</i>发现客户', url: '/develop', code: 'BA'}, {title: '<i class="icon-font">&#xe67e;</i>社交推广', url: '/extension', code: 'BB'}, {title: '<i class="icon-font">&#xe6c2;</i>邮件营销', url: '/emailmarketing', code: 'BC'}]
      // let creativePageTab = [ {title: '<i class="icon-font">&#xe68a;</i>智能作家', url: '/intellAuthor', code: 'FA'}, {title: '<i class="icon-font">&#xe659;</i>Blog', url: '/blog', code: 'FB'}, {title: '<i class="icon-font">&#xe6c8;</i>图源搜索', url: '/searchList', code: 'FD'}, {title: '<i class="icon-font">&#xe690;</i>素材库', url: '/material', code: 'FC'} ]
      // let monitorPageTab = [ {title: '<i class="icon-font">&#xe668;</i>官网监控', url: '/homeMonitor', code: 'CC'}, {title: '<i class="icon-font">&#xe67c;</i>社交监控', url: '/socialMonitor', code: 'CA'}, {title: '<i class="icon-font">&#xe68b;</i>邮件监控', url: '/mailMonitor', code: 'CB'}, {title: '<i class="icon-font">&#xe6af;</i>社媒监控', url: '/socialMedia', code: 'CD'} ]
      // let contactPageTab = [ {title: '<i class="icon-font">&#xe689;</i>联系人', url: '/contact', type: 0, code: 'DA'}, {title: '<i class="icon-font">&#xe638;</i>公司', url: '/contact?type=1', type: 1, code: 'DB'} ]
      // let orderLogisticPageTab = [ {title: '<i class="icon-menuorder"></i>订单管理', url: '/order', code: 'EA'}, {title: '<span class="icon-font">&#xe66c;</span>物流管理', url: '/logisticsManagement', code: 'EB'}, {title: '<span class="icon-font">&#xe693;</span>资金管理', url: '/fundsManagement', code: 'EC'} ]
      // let formPageTab = [ {title: '<i class="icon-font">&#xe6de;</i>统计报表', url: '/form', code: 'H'} ]
      for (let tab of homePageTab) {
        if (this.isInRightArray(tab, myRights)) {
          this.navbarList[1].url = tab.url
          break
        }
      }
      for (let tab of customerPageTab) {
        if (this.isInRightArray(tab, myRights)) {
          this.navbarList[2].url = tab.url
          break
        }
      }
      for (let tab of creativePageTab) {
        if (this.isInRightArray(tab, myRights)) {
          this.navbarList[3].url = tab.url
          break
        }
      }
      for (let tab of monitorPageTab) {
        if (this.isInRightArray(tab, myRights)) {
          this.navbarList[4].url = tab.url
          break
        }
      }
      for (let tab of contactPageTab) {
        if (this.isInRightArray(tab, myRights)) {
          this.navbarList[5].url = tab.url
          break
        }
      }
      for (let tab of orderLogisticPageTab) {
        if (this.isInRightArray(tab, myRights)) {
          this.navbarList[6].url = tab.url
          break
        }
      }
      if (this.isMain !== 'false') {
        for (let tab of formPageTab) {
          if (this.isInRightArray(tab, myRights)) {
            this.navbarList[7].url = tab.url
            break
          }
        }
      }
    },
     /**
     * 权限重新计算
     * @return {[type]} [description]
     */
    rightCompute (fullNavBarList) {
      if (!localStorage.functions) {
        return
      }
      let myRights = JSON.parse(localStorage.functions)
      let newMenuList = []
      /**
       * 本地 维护一个新的 navbarList变量
       * 因为需要多次请求权限，第一次请求之后会改变全局navbarList
       * @type {Array}
       */
      for (let i in fullNavBarList) {
        if (this.isInRightArray(fullNavBarList[i], myRights)) {
          newMenuList.push(fullNavBarList[i])
        }
      }
      this.navbarList = newMenuList
      let usid = localStorage.userId
      localStorage['topBar' + usid] = JSON.stringify(newMenuList)
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
      /**
       * 如果 thisRight.code 是空  【工作台的code为空】，默认显示
       * @param  {[type]} thisRight.code [description]
       * @return {[type]}                [description]
       */
      if (thisRight.code === '') {
        return true
      } else {
        return isIn
      }
    },
     /**
     * 把后台提供的权限转化成我自己需要的 权限数组
     * @param  {[type]} json [description]
     * @return {[type]}      [description]
     */
    rightJsonFormator (json, uid, parentId) {
      let rightsArray = []
      /**
       * 主账号 则有所有权限
       * 子账号，则从后台读取权限
       * @param  {[type]} parentId [description]
       * @return {[type]}        [description]
       */
      if (!parentId) {
        rightsArray = Util.getAllPermissions()
      } else {
        pushRightOfThisLayer(json)
      }
      function pushRightOfThisLayer (layerJson) {
        for (let righta of layerJson) {
          if (righta.selected === 1) {
            rightsArray.push({name: righta.name, code: righta.code})
          }
          if (righta.childNodes.length) {
            pushRightOfThisLayer(righta.childNodes)
          }
        }
      }
      return rightsArray
    },
    getAdsToken () {
      LoginAPI.getLoginToken().then(res => {
        if (res.data.data) {
          this.adsToken = res.data.data
        }
      })
    },
    changeBar: function (bindex) {
      this.firstNav = bindex
      this.showNav = bindex
    },
    handleCommand (command) {
      if (command === 'exit') {     // 退出
        let param = {}
        LoginAPI.logOut(param).then((res) => {
          let code = res.data.code
          if (code === 0) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            this.$router.push({path: '/login'})
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
      // 去设置 一级菜单全不选
      if (command === 'set') {
        this.$store.dispatch('setNavIndex', 'noMenuChecked')
        this.$router.push({path: '/setAccount'})
      }
    },
    linkToMail () {
      this.$store.dispatch('setNavIndex', 'noMenuChecked')
      this.$router.push({path: '/mailList'})
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less" scoped>
  .bar{
    position: fixed;
    top: 0;
    width: 100vw;
    min-width:1200px;
    height: 59px;
    background: #FFFFFF;
    border-bottom: #DFE3EB 1px solid;
    overflow: hidden;
    z-index: 2000;
    .logo{
      display: inline-block;
      vertical-align: top;
      line-height: 59px;
      margin:0 15px 0 30px;
      img{
        vertical-align: middle;
      }
    }
    .bar-right {
        float: right;
        position: relative;
        margin-right:50px;
        .mail-red-point{
          position: absolute;
          right:-1px;
          top:-12px;
          display: inline-block;
          width:6px;
          height: 6px;
          background: red;
          border-radius: 50%;
        }
        .ads-enter{
         font-size: 18px;
         position: relative;
         top: -8px;
         margin-right: 25px;
        }
        .helper-down{
          display: inline-block;
          margin: 5px 15px 28px 0;
          vertical-align: middle;
        }
        .email-enter{
          width: 1.5em;
          height: 1.5em;
          margin-right: 25px;
          position: relative;
          top:-12px;
          font-size: 19px;
          color: #7C98B6;
          cursor: pointer;
        }
        .head-img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-top: 14px;
          margin-right: 26px;
          display: inline-block;
          overflow: hidden;
          img{
            width:32px;
            height: 32px;
          }
        }
        .el-icon--right{
          position: absolute;
          top:23px;
          right: 0;
        }
      }
    ul{
      display: inline-block;
      li.selected{
        a {
          color: #33475B;
          font-weight: bolder;
        }
      }
      li{
        height: 59px;
        line-height: 59px;
        display: inline-block;
        margin-right: 31px;
        vertical-align: top;
        &:hover{
          a{
            color: #33475B;
          }
        }
        a{
          font-size: 14px;
          letter-spacing: 0;
          line-height: 50px;
          color: #4F6D95;
          cursor: pointer;
        }
        a:active{
          border-bottom: 4px solid #5488F9;
          padding-bottom: 20px;
        }
        a:hover{
          border-bottom: 4px solid #5488F9;
          padding-bottom: 23px;
        }
      }
    }
  }
  .el-dropdown-menu{
    background: #FFFFFF;
    border: 1px solid #CBD6E2;
    box-shadow: 0 2px 4px 0 rgba(51,71,91,0.20);
    border-radius: 8px;
  }
  .el-dropdown-menu__item{
    font-size: 13px;
    color: #33475B;
    letter-spacing: 0;
  }
  .el-dropdown-menu__item:not(.is-disabled):hover{
    background: #F4F6F8;
  }

</style>
