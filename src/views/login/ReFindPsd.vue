<template>
  <div>
    <div class="forgot-info">
      <div class="login-logo">
        <b class="logo"></b>
      </div>
      <div class="setting-forgot">
        <!--<div class="return-login" v-if="step === 0" @click="back"><span>返回登录</span> <i class="icon-font">&#xe603;</i></div>-->
        <div class="head">重置密码</div>
        <!--<div v-if="step!==2">-->
          <!--<div class="steps">-->
            <!--<span class="big-circle"><span class="inner-circle"></span></span>-->
            <!--<span class="line"></span>-->
            <!--<span class="big-circle"><span class="inner-circle"></span></span>-->
          <!--</div>-->
          <!--<div class="steps-warn">-->
            <!--<span>验证手机号</span>-->
            <!--<span>重置密码</span>-->
          <!--</div>-->
        <!--</div>-->
        <div>
          <div :class="{'is-danger': isShow1 === 'error'}">
            <input  placeholder="请输入6-20位的密码，须同时含有数字和字母" class="input-style" v-model="passwd" @focus="isOk(1)" @blur="isNotOk(passwd, 1)">
            <p class='danger-to' v-show="isShow1 == 'error'"><i class="icon-remind"></i>请输入正确的格式</p>
          </div>
          <div style="margin-top: 20px" :class="{'is-danger': isShow || isShow2}">
            <input placeholder="请再次输入密码" class="input-style confirm-input" v-model="passwdConfirm"  @focus="isOk(2)" @blur="isNotOk(passwdConfirm, 2)">
            <p class='danger-to' v-show="isShow"><i class="icon-remind"></i>请输入正确的格式</p>
            <p class='danger-to' v-show="isShow2"><i class="icon-remind"></i>两次输入的密码不一致</p>
          </div>
          <template>
            <!--<div  :class="rePwd === 'ok' ? 'is-ok jump-to' : 'jump-to'"  @click="setPasswd" >重置密码</div>-->
            <div  class="jump-to" v-if="rePwd === 'error'">重置密码</div>
            <div  class="is-ok jump-to"  @click="setPasswd" v-if="rePwd === 'ok'">重置密码</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LoginAPI from '@/api/loginAPI'
  import mulAccountApi from '@/api/mulAccountApi'
  import '@/assets/js/security'

  export default {
    name: 'forgot',
    data () {
      return {
        step: 0,
        /**
         * rsa publickey 初始化参数
         * @type {String}
         */
        rediskey: '',
        exponent: '',
        modulus: '',
        /**
         * 用户名 密码 验证码
         * @type {String}
         */
        phoneNum: '',
        passwd: '',
        passwdConfirm: '',
        phoneVcode: '',
        error: false,
        stoped: true,
        timer: 60,
        isShow: false,
        isShow1: 'ok',
        isShow2: false,
        rePwd: 'error'
      }
    },
    components: {
    },
    watch: {
      passwd () {
        let msg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
        if (msg.test(this.passwd) === false) {
          this.rePwd = 'error'
        }
      },
      passwdConfirm () {
        let msg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
        if (msg.test(this.passwdConfirm) === false) {
          this.rePwd = 'error'
        }
      }
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
      this.checkCode()
    },
    methods: {
      isOk (val) {
        if (val === 1) {
          this.isShow1 = false
        }
        if (val === 2) {
          this.isShow = false
          this.isShow2 = false
        }
      },
      isNotOk (value, num) {
        let msg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
        if (msg.test(value) === false) {
          if (num === 1) {
            this.isShow1 = 'error'
          }
          if (num === 2) {
            this.isShow = true
          }
        } else {
          if (num === 1) {
            this.isShow1 = false
          }
          if (num === 2) {
            if (this.passwd !== this.passwdConfirm) {
              this.isShow2 = true
              this.isShow = false
            } else {
              this.isShow = false
              this.isShow2 = false
              this.rePwd = 'ok'
            }
          }
        }
      },
      /*
      * 验证重置密码链接是否可用
      * */
      checkCode () {
        let params = {
          code: this.$route.query.code
        }
        mulAccountApi.checkCode(params).then(res => {
          if (res.data.code === 0) {
            if (!res.data.data) {
              this.$message({
                message: '重置密码链接已过期',
                type: 'error'
              })
            }
          }
        })
      },
      /**
       * 设置密码
       */
      setPasswd () {
        let params = {
          'code': this.$route.query.code,
          'password': this.passwd
        }
        if (this.passwd !== this.passwdConfirm) {
          this.$message({
            message: '两次密码输入不相等',
            type: 'error'
          })
          return
        } else {
          mulAccountApi.resetPassword(params).then(res => {
            if (res.data.code === 0) {
              this.$message({
                message: '重置密码成功',
                type: 'success'
              })
              this.passwd = ''
              this.passwdConfirm = ''
              this.$router.push({ path: '/login' })
            } else {
              this.$message({
                message: res.data.message,
                type: 'error'
              })
            }
          })
        }
      },
      /**
       * rea加密
       * @param  {[type]} text [description]
       * @return {[type]}      [description]
       */
      encryptRSA (text) {
        let key = window.RSAUtils.getKeyPair(this.exponent, '', this.modulus)
        return window.RSAUtils.encryptedString(key, text)
      },
      /**
       * 前往登录页面
       * @return {[type]} [description]
       */
      back () {
        this.$router.push({ path: '/login' })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" >
  .forgot-info{
    margin-top: 110px;
    width: 100%;
    height: 100%;
    .login-logo{
      text-align: center;
      margin-bottom: 40px;
      .logo{
        display: inline-block;
        width: 300px;
        height: 75px;
        background: url("../../assets/img/login/logo-small.png") no-repeat;
        background-size: contain;
      }
    }
    .setting-forgot{
      width:398px;
      height: 398px;
      background: #FFFFFF;
      border: 1px solid #E8E8E8;
      border-radius: 4px;
      margin: 0 auto;
      padding: 24px 40px 0 40px;
      cursor: pointer;
      .return-login{
        float: right;
        margin-right: -20px;
        font-size: 14px;
        color: #7C98B6;
        padding-left: 5px;
        border-left:2px solid #ccc;
        .icon-font{
          display: inline-block;
          vertical-align: middle;
          font-size: 14.1px;
        }
      }
      .head{
        font-size: 18px;
        color: #333333;
        letter-spacing: 0;
        margin-top: 24px;
        margin-bottom: 40px;
        text-align: center;
      }
      .steps{
        padding: 0 55px;
        .big-circle{
          display: inline-block;
          width:22px;
          height: 22px;
          border-radius: 50%;
          background: #FFFFFF;
          text-align: center;
          // box-shadow: 0 0 8px 0 rgba(6,134,249,0.15);
          .inner-circle{
            margin: 3px 0 0 0px;
            background: #D5DFE4;
            // background: #5488F9;
            display: inline-block;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            vertical-align: middle;
          }
        }
        .curr-circle{
          box-shadow: 0 0 8px 0 rgba(84,134,249,0.35);
          .inner-circle{
            margin: 4px;
            background: #5488F9;
          }
        }
        .line{
          background: #D5DFE4;
          width: 231px;
          height: 2px;
          display: inline-block;
        }
        .light{
          background: #5488F9;
          width: 231px;
          height: 2px;
          display: inline-block;
        }
      }
      .steps-warn{
        font-size: 13px;
        color: #5488F9;
        margin-top: 10px;
        margin-bottom: 40px;
        span:first-child{
          padding-left: 27px;
        }
        span:last-child{
          padding-left: 207px;
        }
        .grey {
          color:#B0BEC5;
        }
      }
      .input-style {
        margin: 0 auto;
        width: 396px;
        height: 56px;
        background: #F5F8FA;
        border-radius: 4px;
        font-size: 14px;
        border: none;
        padding-left:16px;
        border:1px solid #F5F8FA;
        box-sizing: border-box;
        &.code-input{
          width: 270px;
        }
      }
      .input-style:focus{
        border:1px solid #02AAAA;
        outline: none;
      }
      .confirm-input {
        /*margin-top:20px;*/
      }
      .is-danger{
        border:1px solid #FF3B6E;
        border-radius: 4px;
      }
      .danger-to{
        font-size: 12px;
        color: #FF3B6E;
        line-height: 16px;
        padding: 5px 0 7px 10px;
        background: #ffebf0;
        i{
          color: #FF3B6E;
          margin-right: 5px;
        }
      }
      .danger-before{
        visibility: hidden;
      }
      .v-code{
        margin-top:16px;
        position: relative;
        .vcode{
          position: absolute;
          top: 0;
          height: 56px;
          width: 120px;
          right: -2px;
        }
      }
      .tel-code{
        margin-top:16px;
        position: relative;
        span{
          position: absolute;
          background: #5488F9;
          border-radius: 0 4px 4px 0;
          width: 120px;
          height: 56px;
          right: -1px;
          top: 0;
          /* vertical-align: middle; */
          text-align: center;
          line-height: 56px;
          color: #fff;
        }
      }
      .error-info{
        margin-top: 42px;
        margin-bottom: -24px;
        padding: 12px 16px;
        width:366px;
        height: 23px;
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
        margin: 40px auto 8px;
        background: #EAF0F6;
        border: 1px solid #DFE3EB;
        border-radius: 4px;
        font-size: 18px;
        color: #B0C1D4;
        text-align: center;
        /*cursor: pointer;*/
      }
      .jump-to.is-ok{
        background: #5488F9;
        color: #fff;
      }
      .reLogin{
        .img-info{
          img{
            margin-top: 90px;
            padding-left: 99px;
            margin-bottom: 15px;
          }
          p{
            text-align: center;
            font-size: 14px;
            color: #666666;
            margin-bottom: 79px;
          }
        }
        .reback{
          width:120px;
          height: 34px;
          background: #5488F9;
          border-radius: 4px;
          color: #fff;
          font-size: 14px;
          text-align: center;
          line-height: 34px;
          cursor: pointer;
          margin: 0 auto;
        }
      }
    }
  }
  .login-wraper {
    width:350px;
    margin:200px auto;
    h3{
      text-align: center;
    }
  }
</style>
