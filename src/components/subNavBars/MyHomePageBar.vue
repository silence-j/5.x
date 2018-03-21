<template>
  <div class="ui-website">
    <div class="topMenu">
      <div class="top-title">
        我的官网
        <span class="down-line"></span>
        <el-select v-model="value" placeholder="" @change="changeDomain" style="vertical-align: bottom;">
          <!--<el-option
            v-for="item in companyDomain"
            key="domain"
            :label="item.label"
            :value="item.value">
          </el-option>-->
          <el-option
            key="domain"
            :label="domainInfo.subdomain+apiHost"
            :value="domainInfo.subdomain" v-if="domainInfo.subdomain != '' && domainInfo.subdomain != 'null' && domainInfo.subdomain != null">
          </el-option>
          <el-option
            key="domain"
            :label="domainInfo.topdomain"
            :value="domainInfo.topdomain" v-if="domainInfo.topdomain != '' && domainInfo.topdomain != 'null' && domainInfo.topdomain != null">
          </el-option>
        </el-select>
        <el-popover
          ref="popover5"
          placement="bottom"
          trigger="hover" popper-class="domain-pop">
          <div class="qrcode-display">
            <p class="title">手机扫描访问</p>
            <p><img :src="qrcodeImg" alt="" /></p>
            <p class="opaction"><span class="opaction-one" @click="copyLink">复制页面链接</span><textarea id="copyLinkUrl" style="opacity: 0;position: absolute;top:0">{{ linkDomainUrl }}</textarea><a :href="linkDomainUrl" target="_blank"><span class="opaction-two">电脑上查看</span></a></p>
          </div>
        </el-popover>
        <el-button type="primary" class="over-webset" v-popover:popover5>访问官网</el-button>
        <el-button type="primary" @click="editDomainPop()" class="pop-Setting">域名设置</el-button>
      </div>
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
    <!--域名设置弹框start-->
    <el-dialog title="域名设置" v-model="editDomain" custom-class="edit-domain">
      <div class="desc">
        您可以直接使用盈店通给您免费提供的站点域名作为您的官网地址，或者绑定已有的一级域名作为官网地址，二者选其一即可，也可以同时使用
      </div>
      <div class="domainEdit">
        <div class="edit">
          <p v-if="!updateDomain && domainInfo.subdomain != ''"><span class="domain-display">盈店通站点域名：{{ domainInfo.subdomain }}.onloon.cc</span>
            <el-button type="default" class="canncel" @click="updateDomain = true">更改前缀</el-button>
          </p>
          <p v-else><span class="domain-display">盈店通站点域名：</span><input type="text" class="domain-input" v-model="secondDomain" placeholder="6-15位英文或数字" />.onloon.cc
            <el-button type="primary" class="sure-btn" @click="updateDomainFunc('2')">确定</el-button>
            <el-button type="default" class="canncel" @click="cancelFunc()" v-if="domainInfo.subdomain != ''">取消</el-button>
          </p>
          <p v-if="secondeError != ''" class="error-prompt"><i class="icon-prompt"></i>{{ secondeError }}</p>
        </div>
        <div class="binddomain">
          <p class="title">绑定一级域名（请先CNAME解析至cname.onloon.cc）</p>
          <p class="prompt">提示：请填写需要绑定的域名，比如域名为www.test.com，在此处需填写www.test.com</p>
          <p class="bind"><input placeholder="输入我的一级域名" type="text" class="domain-input" v-model="indepDomain" />
            <el-button type="primary" class="sure-btn" @click="updateDomainFunc('1')">绑定</el-button>
          </p>
          <p v-if="indepError != ''" class="error-prompt"><i class="icon-prompt"></i>{{ indepError }}</p>
        </div>
      </div>
      <div class="help">
        <i class="icon-quest operating-help"></i>
        <p class="title">如何在您的域名提供商处添加域名解析</p>
        <ul class="operating-step">
          <li>1、根据域名服务商提供的账号及密码登录到域名服务商提供的管理后台；</li>
          <li>2、点击“域名管理”；</li>
          <li>3、找到需要设置的域名；</li>
          <li>4、点击“域名解析”；</li>
          <li>
            5、添加一条域名解析记录，主机名（host）为请自主填写，建议填写www，解析类型选择CNAME（别名），记录值填写cname.onloon.cc；
            <div class="note">
              注：若您的域名解析配置中已经存在主机名为www的解析记录，请输入其他host，再行步骤5；若您任然需要使用之前的www解析记录解析到您已有的网站而不能删除，建议您注册新的域名来绑定盈店通，或者也可以将您不带www的域名解析到您原来的网站而将带www的域名解析到盈店通
            </div>
          </li>
          <li>
            6、保存后等待解析生效即可，最长解析时间不超过72小时
            <div class="note">
              以上参考仅为参考，具体操作以注册商提供的方式为准
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
    <!--域名设置弹框end-->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import myWebSiteApi from '../../../src/api/myWebSiteApi'
export default {
  data () {
    return {
      value: '',
      selectedSubNav: 0,
      qrcodeImg: '',
      linkDomainUrl: '',
      editDomain: false,
      updateDomain: false,
      domainInfo: {
        topdomain: '',
        subdomain: ''
      },  // 域名信息
      secondDomain: '', // 二级域名
      apiHost: process.env.API_HOST,
      secondeError: '', // 修改二级域名错误提示
      indepDomain: '', // 独立域名
      indepError: '', // 修改独立域名错误提示
      menuListCopy: [],
      menuList: [
        {
          title: '<span class="icon-font">&#xe671;</span>页面管理',
          url: '/pageManagement',
          code: 'AA'
        },
        {
          title: '<span class="icon-font">&#xe69f;</span>官网风格',
          url: '/websiteStyle',
          code: 'AB'
        },
        {
          title: '<i class="icon-font">&#xe664;</i>分组管理',
          url: '/Group',
          code: 'AD'
        },
        {
          title: '<i class="icon-font">&#xe687;</i>产品列表',
          url: '/product',
          code: 'AE'
        },
        {
          title: '<i class="icon-font">&#xe6cf;</i>官网统计',
          url: '/webCount',
          code: 'AC'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['allRights'])
  },
  mounted () {
    this.menuListCopy = this.menuList
    this.rightCompute(this.menuList)
    /**
     * 获取域名
     */
    myWebSiteApi.getCompanyDomain().then(res => {
      if (!res.data.code) {
        if (res.data.data !== '' && res.data.data !== null && res.data.data !== undefined) {
          this.domainInfo = res.data.data
          this.domainInfo.subdomain = res.data.data.subdomain
          this.secondDomain = res.data.data.subdomain
          this.indepDomain = res.data.data.topdomain
        } else {
          this.domainInfo.topdomain = ''
          this.domainInfo.subdomain = ''
          this.secondDomain = ''
          this.indepDomain = ''
        }
        this.setDefaultDomain(this.domainInfo)
        this.$store.commit('DOMAIN_COMPANY', res.data.data)
        if (this.indepDomain !== '' && this.indepDomain !== null) {
          this.$store.commit('SELECT_DOMAIN', this.indepDomain)
        } else {
          this.$store.commit('SELECT_DOMAIN', 'https://' + this.secondDomain + this.apiHost)
        }
      }
    })
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
        /**
         * 详情页面刷新 也要考虑进去
         * @param  {[type]} thisRouterPath.indexOf('/ProductModify') !             [description]
         * @return {[type]}                                          [description]
         */
        if (thisRouterPath.indexOf('/ProductModify') !== -1) {
          return true
        } else {
          return it.url === thisRouterPath
        }
      })
      if (!isHasRight) {
        this.$router.push({ path: '/index' })
      }
    },
    /**
     * 根据路由 设置selectedSubNav
     */
    setSelectedTab () {
       // 选中一级菜单
      this.$store.dispatch('setNavIndex', '')
      let path = this.$route.path
      for (let menuIndex in this.menuList) {
        if (path === this.menuList[menuIndex].url) {
          this.selectedSubNav = parseInt(menuIndex)
        }
      }
      // 分类，编辑产品页面的二级菜单
      if (path.includes('/category') || path.includes('/ProductModify')) {
        for (let menuIndex in this.menuList) {
          if (this.menuList[menuIndex].url === '/product') {
            this.selectedSubNav = parseInt(menuIndex)
          }
        }
      }
      /**
       * 设置一级菜单
       * @type {[type]}
       */
      let usid = localStorage.userId
      let avaiableTopMenue = JSON.parse(localStorage['topBar' + usid])
      for (let menu in avaiableTopMenue) {
        if (avaiableTopMenue[menu].title === '我的官网') {
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
    // 设置默认选中域名
    setDefaultDomain (domain) {
      let contentdomain = process.env.HOMEPAGE
      let url = `${contentdomain}${this.$store.getters.editorMenu}?shopId=${window.localStorage.shopId}`
      if (domain.topdomain !== '' && domain.topdomain !== null && domain.topdomain !== 'null') { // 判断独立域名
        let topmain = domain.topdomain
        url = 'http://' + topmain
        this.value = topmain
      } else {
        url = 'http://' + domain.subdomain + process.env.API_HOST
        this.value = domain.subdomain + process.env.API_HOST
      }
      this.getQrcodeFunc(url)
    },
    // 变更域名
    changeDomain () {
      // let contentdomain = process.env.HOMEPAGE
      // let url = `${contentdomain}${this.$store.getters.editorMenu}?shopId=${window.localStorage.shopId}`
      let url = ''
      if (this.value === this.secondDomain) {  // 二级域名
        url = 'https://' + this.domainInfo.subdomain + process.env.API_HOST
      } else if (this.value === this.indepDomain) {  // 一级域名
        url = 'http://' + this.domainInfo.topdomain
      } else {
        // url = `${contentdomain}?shopId=${window.localStorage.shopId}`
        url = 'https://' + this.domainInfo.subdomain + process.env.API_HOST
      }
      this.getQrcodeFunc(url)
      this.$store.commit('SELECT_DOMAIN', url)
      // this.$store.commit('DOMAIN_COMPANY', url)
    },
    // 获取二维码方法
    getQrcodeFunc (contentdomain) {
      this.linkDomainUrl = contentdomain
      this.qrcodeImg = process.env.DOMAIN + '/bshop/index/getqrcode?content=' + contentdomain
    },
    changeMenu (mindex) {
      this.selectedSubNav = mindex
    },
    // 域名设置弹框
    editDomainPop () {
      this.editDomain = true
      if (this.domainInfo !== '' && this.domainInfo !== null && this.domainInfo !== undefined) {
        this.secondDomain = this.domainInfo.subdomain
        this.indepDomain = this.domainInfo.topdomain
      } else {
        this.secondDomain = ''
        this.indepDomain = ''
      }
      this.secondeError = ''
      this.indepError = ''
    },
    // 设置二级域名取消
    cancelFunc () {
      this.updateDomain = false
      if (this.domainInfo !== '' && this.domainInfo !== null && this.domainInfo !== undefined) {
        this.secondDomain = this.domainInfo.subdomain
      }
    },
    // 修改二级域名
    updateDomainFunc (type) {
      this.secondeError = ''
      this.indepError = ''
      let senddata
      let reg = /^[0-9A-Za-z]{6,15}$/
      let regdomain = /(([A-Za-z0-9-~]+)\.[A-Za-z]+)+$/
      if (type === '2') {   // 二级域名设置
        if (this.secondDomain === '' || this.secondDomain === null || this.secondDomain === undefined) {
          this.secondeError = '绑定失败，二级域名不能为空'
          return false
        } else {
          if (this.secondDomain.match(reg) === null) {
            this.secondeError = '绑定失败，二级域名请输入正常格式，6-15位的英文或数字'
            return false
          } else {
            senddata = {
              subdomain: this.secondDomain
            }
          }
        }
      } else {  // 独立域名设置
        if (this.indepDomain === '' || this.indepDomain === null || this.indepDomain === undefined) {
          this.indepError = '绑定失败，独立域名不能为空'
          return false
        } else {
          if (this.indepDomain.match(regdomain) === null) {
            this.indepError = '绑定失败，请输入正确的域名格式'
            return false
          } else {
            senddata = {
              topdomain: this.indepDomain
            }
          }
        }
      }
      myWebSiteApi.updateDomain(senddata).then(res => {
        if (res.data.code === 0) {
          if (type === '2') {
            this.updateDomain = false
            this.domainInfo.subdomain = this.secondDomain
            this.setDefaultDomain(this.domainInfo)
            this.$message({
              message: '修改二级域名成功',
              type: 'success'
            })
          } else {
            this.domainInfo.topdomain = this.indepDomain
            this.setDefaultDomain(this.domainInfo)
            this.$message({
              message: '修改独立域名成功',
              type: 'success'
            })
          }
        } else {
          if (res.data.data === '') {
            if (type === '2') {
              this.secondeError = '修改二级域名失败'
            } else {
              this.indepError = '修改独立域名失败'
            }
          } else {
            if (type === '2') {
              this.secondeError = res.data.message
            } else {
              this.indepError = res.data.message
            }
          }
        }
      })
    },
    // 复制链接
    copyLink () {
      let Url2 = document.getElementById('copyLinkUrl')
      Url2.select()    // 选择对象
      document.execCommand('Copy', false, null)     // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    }
  },
  watch: {
    '$route' (to, from) {
      // 分类，编辑产品页面的二级菜单
      if (to.path.includes('/category') || to.path.includes('/ProductModify')) {
        for (let menuIndex in this.menuList) {
          if (this.menuList[menuIndex].url === '/product') {
            this.selectedSubNav = parseInt(menuIndex)
          }
        }
      }
      if (to.path.indexOf('pageManagement') > 0) {
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
<style lang='less' rel="stylesheet/less">
  @import "../../assets/style/variable.less";
  @import '../../assets/style/nav/subNav.less';
  .el-popover.domain-pop{
    padding:10px;
    border: 1px solid rgb(209, 213, 229);
  }
  .qrcode-display{
    .title{
      text-align: center;
      margin-top:10px
    }
    img{
      width:180px;
    }
    .opaction{
      overflow: hidden;
      span{
        cursor: pointer;
        text-decoration:underline;
        color: #33475B;
      }
      span:hover{
        color: #5488F9;
      }
      .opaction-one{
        float:left;
        margin-left:15px;
      }
      .opaction-two{
        float:right;
        margin-right:15px;
      }
    }
  }
  .ui-website{
    .router-view{
      /*width: calc(~'100% - 200px');*/
    }
    .topMenu{
      /*width: calc(~'100% - 200px');*/
      .menu{
        border-bottom: #DFE3EB;
      }
      .down-line{
        display: inline-block;
        height: 30px;
        background: #CAD6E2;
        width: 1px;
        vertical-align: middle;
        margin: 0 14px;
      }
      .el-button:first-child{
        margin-left: 14px;
      }
      .el-button{
        padding: 10px 21px;
        margin-left: 4px;
      }
      .over-webset{
        margin-left: 8px;
      }
      .el-select{
        .el-input{
          input{
            height: 34px;
            width: 208px;
          }
        }
      }
    }
  }
.lf-padding20{
  padding:0 20px;
}
.edit-domain{
  border-radius: 4px;
  min-width: 769px;
  .el-dialog__header{
    padding:11px 16px 14px 16px;
    border-radius: 4px 4px 0 0;
    border: 1px solid #DFE3EB;
  }
  .el-dialog__body{
    padding:16px 40px 30px 40px;
  }
  .desc{
    font-size: 13px;
    color: #33475B;
    line-height: 21px;
  }
  .domainEdit{
    background: #EBF0F6;
    margin:16px 0px;
    padding:0 16px;
    .error-prompt{
      font-size: 13px;
      color: #F86563;
      line-height: 22px;
      margin-top: 18px;
      i{
        font-size: 20px;
        margin-right:16px;
      }
    }
    .edit{
      padding:11px 0 18px 0;
      border-bottom:1px solid #DFE3EB;
      .domain-display{
        font-size: 14px;
        color: #33475B;
        line-height: 33px;
        font-weight: 600;
      }
      .sure-btn{
        padding: 8px 25px;
        margin-left:23px;
      }
      .canncel{
        padding: 8px 25px;
        margin-left:16px;
      }
      .domain-input{
        border: 1px solid #CBD6E3;
        border-radius: 4px;
        font-size:13px;
        padding:4px 0;
        text-indent: 19px;
        line-height: 21px;
      }
      .btn{
        border-radius: 4px;
        font-size: 13px;
        line-height: 21px;
        padding:7px 14px;
        margin-left:16px;
        cursor: pointer;
        background: #FFFFFF;
        border: 1px solid #CBD6E3;
        color: #4F6D95;
      }
      .can-submit{
        background: #5488F9;
        color: #fff;
        border:#5488F9;
      }
    }
    .binddomain{
      padding:16px 0;
      .title{
        font-size: 14px;
        color: #33475B;
        line-height: 22px;
        font-weight: 600;
      }
      .prompt{
        margin-top:5px;
        font-size: 13px;
        color: #7D98B6;
        line-height: 22px;
      }
      .bind{
        margin-top:16px;
        .bold-desc{
          font-size: 14px;
          color: #33475B;
          line-height: 22px;
          margin-right:13px;
          font-weight: 600;
        }
        .sure-btn{
          border-radius: 4px;
          color: #FFFFFF;
          padding:9px 27px;
          margin-left:16px;
          cursor: pointer;
        }
        .domain-input{
          padding:7px 0;
          font-size: 13px;
          line-height: 18px;
          text-indent: 16px;
          border-radius: 4px;
          border: 1px solid #CBD6E3;
          width: 380px;
          outline: none;
        }
      }
    }
  }
  .help{
    background: #ffeee6;
    border: 1px solid #feddcc;
    border-radius: 4px;
    padding:16px 18px 16px 52px;
    position:relative;
    .operating-help{
      position: absolute;
      top:18px;
      left:16px;
      font-size: 20px;
      color: #F86563;
    }
    .title{
      font-size: 14px;
      color: #404040;
      letter-spacing: 0;
      line-height: 21px;
    }
    .operating-step{
      margin-top:2px;
      font-size: 13px;
      color: #666666;
      letter-spacing: 0;
      line-height: 21px;
      .note{
        font-size: 12px;
        color: #979797;
        letter-spacing: 0;
        line-height: 21px;
        margin-top:2px;
      }
    }
  }
}
</style>
