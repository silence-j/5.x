<template>
  <div class="body-bg">
    <div class="login-to">
      <img class="bg-image" src="../../assets/img/login/register-bg.png">
      <div class="login-logo">
        <b class="logo"></b>
      </div>
      <div class="login-info">
        <div class="head">用户登录</div>
        <input name="telephone" v-validate="{ rules: { required:true} }" :class="{'is-danger': errors.has('telephone') }" placeholder="手机/邮箱" class="input-style telephone" v-model="userName" tabindex="1">
        <input name="password" v-validate="{ rules: { regex: /.{6,20}$/} }" :class="{'is-danger': errors.has('password') }" placeholder="密码" type="password" class="input-style passwd-style" v-model="passwd" tabindex="2">
        <p class="forgotpsd">
          <router-link to="forgot">
            <span>
              忘记密码
            </span>
          </router-link>
        </p>
        <div class="v-code">
          <input  name="vcode" v-validate="{ rules: { regex: /^.{4}$/} }" :class="{'is-danger': errors.has('vcode') }"  placeholder="校验码" class="input-style code" @keyup.enter="login" v-model="vCode" maxlength="4" tabindex="3">
          <img class="vcode" @click="refreshVcodeUrl" :src="vCodeUrl" alt="">
        </div>
        <div class="rempsd">
          <!--<el-checkbox>记住密码</el-checkbox>-->
        </div>
        <!--<div class="error" v-show="error"><i class="icon-font icon-error">&#xe601;</i> {{errorMsg}}</div>-->
        <template v-if="fields.fields&&fields.fields.password">
          <div :class="{'is-ok': !errors.any()&&userName&&passwd&&vCode}" class="jump-to" @click="login" tabindex="4">登录</div>
        </template>
        <p class="register">
          没有账户?<router-link to="register"><span>立即注册>></span></router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import LoginAPI from '@/api/loginAPI'
import '@/assets/js/security'
import Util from '@/common/Util'
export default {
  name: 'login',
  data () {
    return {
      /**
       * rsa publickey 初始化参数
       * @type {String}
       */
      rediskey: '',
      exponent: '',
      modulus: '',
      vCodeUrl: process.env.DOMAIN + '/bshop/login/captcha/get',
      /**
       * 用户名 密码 验证码
       * @type {String}
       */
      userName: '',
      passwd: '',
      vCode: '',
      errorMsg: '',
      error: false,
      linkUrl: ''
    }
  },
  components: {
  },
  mounted: function () {
    /**
     * 初始化公钥
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    LoginAPI.getRSAPublicKey().then(res => {
      if (res.data.code === 0) {
        let callbackData = res.data.data
        this.rediskey = callbackData.rediskey
        this.exponent = callbackData.exponent
        this.modulus = callbackData.modulus
      } else {
        console.log('初始化公钥失败')
      }
    })
    // this.linkUrl = this.$route.query.callback
    this.linkUrl = decodeURIComponent(window.location.hash).split('callback=')[1]
    if (this.linkUrl) {
      LoginAPI.getLoginToken().then(res => {
        if (res.data.data) {
          let token = res.data.data
          if (this.linkUrl.indexOf('?') !== -1) {
            window.location.href = 'http://' + this.linkUrl + '&token=' + token
          } else {
            window.location.href = 'http://' + this.linkUrl + '?token=' + token
          }
        }
      })
    }
  },
  methods: {
    /**
     * 把后台提供的权限转化成我自己需要的 权限数组
     * @param  {[type]} json [description]
     * @return {[type]}      [description]
     */
    rightJsonFormator (json, subuid, uid) {
      let rightsArray = []
      /**
       * 主账号 则有所有权限
       * 子账号，则从后台读取权限
       * @param  {[type]} subuid [description]
       * @return {[type]}        [description]
       */
      if (subuid === uid) {
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
    /**
     * 刷新验证码
     * @return {[type]} [description]
     */
    refreshVcodeUrl () {
      this.vCodeUrl = process.env.DOMAIN + '/bshop/login/captcha/get?v=' + new Date().getTime()
    },
    /**
     * 加密验证码
     * @param  {[type]} text [description]
     * @return {[type]}      [description]
     */
    encryptRSA (text) {
      var key = window.RSAUtils.getKeyPair(this.exponent, '', this.modulus)
      return window.RSAUtils.encryptedString(key, text)
    },
    /**
     * 登录按钮
     * @return {[type]} [description]
     */
    login () {
      if (!(!this.errors.any() && this.userName && this.passwd && this.vCode)) {
        console.log('前端输入验证不通过，点击按钮无效！')
        return
      }
      let postObj = {
        'loginAccount': this.userName,
        'password': this.encryptRSA(this.passwd),
        'captcha': this.vCode,
        'rediskey': this.rediskey
      }
      LoginAPI.login(postObj).then(res => {
        if (res.data.code === 0) {
          // this.linkUrl = this.$route.query.callback
          this.linkUrl = decodeURIComponent(window.location.hash).split('callback=')[1]
          let shopStatus = res.data.data.shopStatus
          window.localStorage.ppp = res.data.data.trialTime
          if (this.linkUrl && (shopStatus !== 0) && (shopStatus !== 1) && (shopStatus !== 3) && (shopStatus !== 5) && (shopStatus !== 7)) {
            LoginAPI.getLoginToken().then(response => {
              if (response.data.data) {
                let token = response.data.data
                if (this.linkUrl.indexOf('?') !== -1) {
                  window.location.href = 'http://' + this.linkUrl + '&token=' + token
                } else {
                  window.location.href = 'http://' + this.linkUrl + '?token=' + token
                }
              }
            })
          } else {
            let user = res.data.data
            window.localStorage.shopId = user.shopId
            window.localStorage.userId = user.userId
            window.localStorage.avatr = user.avatar
            window.localStorage.serverLevel = user.serverLevel
            window.localStorage.user = JSON.stringify(user)
            if (!user.parentUserId) {
              window.localStorage.isMainAccount = true
            } else {
              window.localStorage.isMainAccount = false
            }
            /**
             * 权限字段赋值
             * @type {[type]}
             */
            // functions 刚注册:null 主账号:[]
            window.localStorage.functions = null
            if (user.functions) {
              let formatedFunctions = this.rightJsonFormator(user.functions, user.userId, user.subUserId)
              window.localStorage.functions = JSON.stringify(formatedFunctions)
            }
            window.localStorage.isAds = 'show'
            window.localStorage.isProbation = 'false'
            this.$store.commit('SET_USER_INFO', user)
            if (shopStatus === 4) {
              window.localStorage.probation = res.data.data.trialTime
              window.localStorage.isProbation = 'true'
            }
            switch (shopStatus) {
              case 0:
                this.$router.push('/CreateShop')
                break
              case 1:
                this.$router.push('/certify')
                break
              case 2:
                this.$router.push('/certify')
                break
              case 3:
                this.$router.push('/certify')
                break
              case 4:
                this.$router.push('/index')
                break
              case 5:
                this.$router.push('/certify')
                break
              case 6:
                this.$router.push('/index')
                break
              case 7:
                this.$message.error('运营到期已关闭')
                break
              default:
                this.$router.push('/index')
                break
            }
          }
        } else {
          this.refreshVcodeUrl()
          this.errorMsg = res.data.message
          this.error = true
        }
      })
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  html,body{
    height: 100%;
  }
  .body-bg{
    width:100%;
    height: 100%;
    /*height: 960px;*/
    overflow-y: auto;
    /*overflow: hidden;*/
    .login-to{
      position: relative;
      margin-top: 30px;
      width: 100%;
      padding-bottom: 74px;
      /*height: 100%;*/
      // -moz-background-size: cover;
      // -webkit-background-size:cover;
      // background-image: url('../../assets/img/login/register-bg.png');
      .login-logo{
        text-align: center;
        margin-bottom: 36px;
        .logo{
          display: inline-block;
          width: 300px;
          height: 75px;
          background: url("../../assets/img/login/logo-small.png") no-repeat;
          background-size: contain;
        }
      }
      .bg-image{
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -9;
        // .animation(bgSlideIn,3s,0s,1,none);
      }
      .login-info{
        width:398px;
        background: #FFFFFF;
        border: 1px solid #E8E8E8;
        border-radius: 4px;
        margin: 0 auto;
        padding: 48px 40px 40px 40px;
        .head{
          text-align: center;
          font-size: 18px;
          color: #33475B;
          letter-spacing: 0;
          margin-bottom: 40px;
        }
        .input-style {
          width: 400px;
          height: 56px;
          background: #F5F8FA;
          border-radius: 4px;
          margin: 0 auto;
          font-size: 14px;
          color: #7C98B6;
          border: none;
          padding-left:16px;
          border:1px solid #F5F8FA;
          box-sizing: border-box;
          &.code{
            width: 268px;
          }
        }
        .input-style:focus{
          border:1px solid #02AAAA;
          outline: none;
        }
        .passwd-style {
          margin-top:16px;
        }
        .is-danger{
          border:1px solid #FF3B6E
        }
        .v-code{
          position: relative;
          .code{
            .el-input__inner{
              margin-bottom: 8px;
            }
          }
          .vcode{
            position: absolute;
            top: 1px;
            height: 54px;
            width: 120px;
            right: 0px;
          }
        }
        .forgotpsd{
          width: 400px;
          font-size: 14px;
          color: #33475B;
          text-align: right;
          padding: 8px 0 8px 0;
          margin: 0 auto;
          text-decoration: underline;
          a{
            color: #33475B;
            // span{
            //   color: #33475B;
            // }
          }
          a:hover{
            color: #5488f9;
          }
        }
        .rempsd{
          width: 400px;
          margin: 16px auto;
          .el-checkbox__inner{
            border: 2px solid #CBD6E3;
            border-radius: 2px;
          }
        }
        .error{
          margin-top: 42px;
          margin-bottom: -24px;
          padding: 12px 16px;
          width:366px;
          line-height: 23px;
          background: #ffebf0;
          border: 1px solid #FF3B6E;
          /*border: 1px solid rgba(255,255,255,0.80);*/
          border-radius: 4px;
          font-size: 14px;
          color: #FF3B6E;
          .icon-error{
            color: #FF3B6E;
          }
        }
        .jump-to{
          width:400px;
          height: 56px;
          line-height: 56px;
          margin: 40px auto 16px;
          border: 1px solid #DFE3EB;
          border-radius: 4px;
          font-size: 18px;
          text-align: center;
          cursor: pointer;
          color: #B0C1D4;
          background: #EAF0F6;
        }
        .jump-to.is-ok{
          background: #5488F9;
          color: #fff;
        }
        .register{
          width:270px;
          padding-left: 130px;
          font-size: 14px;
          color: #666666;
          span:last-child{
            color: #5488f9;
            &:hover{
              text-decoration: underline;
            }
          }
        }
      }
  }

    /*.login-wraper {*/
      /*width:350px;*/
      /*margin:200px auto;*/
      /*.vcode{*/
        /*cursor: pointer;*/
      /*}*/
      /*h3{*/
        /*text-align: center;*/
      /*}*/
    /*}*/
  }
</style>
