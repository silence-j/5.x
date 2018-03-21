<template>
  <div>
    <div class="forgot-info">
      <div class="login-logo">
        <b class="logo"></b>
      </div>
      <div class="setting-forgot">
        <div class="return-login" v-if="step === 0" @click="back"><span>返回登录</span> <i class="icon-font">&#xe603;</i></div>
        <div class="head">找回密码</div>
        <div v-if="step!==2">
          <div class="steps">
            <!-- <span class="big-circle"><span class="inner-circle"></span></span>
            <span class="line" :class="step==1?'light':''"></span>
            <span class="big-circle"><span class="inner-circle circle-last" :class="step==1?'light-circle':''"></span></span> -->
            <span class="big-circle curr-circle"><span class="inner-circle"></span></span>
            <span class="line" :class="step==1?'light':''"></span>
            <span class="big-circle" :class="step==1?'curr-circle':''"><span class="inner-circle"></span></span>
          </div>
          <div class="steps-warn">
            <span>验证手机号</span>
            <span :class="step===0? 'grey': ''">重置密码</span>
          </div>
        </div>
        <div v-if="step === 0">
          <input name="telephone" v-validate="{ rules: { regex: /^1[0-9]{10}$/} }" :class="{'is-danger': errors.has('telephone') }" placeholder="手机号码" class="telphone input-style" v-model="phoneNum" >
          <div class="v-code">
            <input name="vcode" v-validate="{ rules: { regex: /^.{4}$/} }" :class="{'is-danger': errors.has('vcode') }"  placeholder="校验码" class="code-input input-style" v-model="vCode">
            <img class="vcode" @click="refreshVcodeUrl" :src="vCodeUrl" alt="">
          </div>
          <div class="tel-code">
            <input name="phoneVcode" v-validate="{ rules: { regex: /^.{4}$/} }" :class="{'is-danger': errors.has('phoneVcode') }" placeholder="手机验证码" class="phone-code-input input-style" v-model="phoneVcode">
            <span @click="getPhoneVcode" v-show="stoped">获取验证码</span>
            <span v-show="!stoped">{{timer + '秒后可重新发送'}}</span>
          </div>
          <div class="error-info" v-show="error"><i class="icon-font icon-error">&#xe601;</i> 您输入的用户名或验证码错误</div>
          <template v-if="fields.fields.telephone">
            <div :class="{'is-ok': !errors.any()&&!fields.fields.telephone.clean&&!fields.fields.phoneVcode.clean&&!fields.fields.vcode.clean&&phoneNum&&vCode&&phoneVcode}"  class="jump-to" @click="next">找回密码</div>
          </template>
        </div>
        <div v-if="step === 1">
          <div :class="{'is-danger': pwdIsOk == 'error' }" >
            <input name="password" v-validate="{ rules: { regex: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/} }" type="password"  placeholder="请输入6到20位的新密码，须同时含有数字和字母" class="input-style" v-model="passwd" @blur="pwdValidation('1')" @focus="pwdValidationRest('1')">
            <div class="input-bottom-remid" v-show="pwdIsOk == 'error'"><i class="icon-remind"></i>请输入6到20位的密码，须同时含有数字和字母</div>
          </div>
          <div :class="{'is-danger': repeatPwdIsOk == 'error' }" class="confirm-input">
            <input name="password2" v-validate="{ rules: { regex: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/} }" type="password"  placeholder="请再次输入密码" class="input-style" v-model="passwdConfirm" @blur="pwdValidation('2')" @focus="pwdValidationRest('2')">
            <div class="input-bottom-remid" v-show="repeatPwdIsOk == 'error'"><i class="icon-remind"></i>请输入6到20位的密码，须同时含有数字和字母</div>
          </div>
          <template v-if="fields.fields.password">
            <div :class="{'is-ok': !errors.any()&&!fields.fields.password2.clean&&!fields.fields.password.clean&&(passwd===passwdConfirm)&&passwd&&passwdConfirm}" class="jump-to" @click="setPasswd">找回密码</div>
          </template>
        </div>
        <div class="reLogin" v-if="step === 2">
          <div class="img-info">
            <img src="../../assets/img/login/icon.png" alt="">
            <p>新密码设置成功!</p>
          </div>
          <div class="reback" @click="back">去登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginAPI from '@/api/loginAPI'
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
      vCode: '',
      vCodeUrl: process.env.DOMAIN + '/bshop/forget/captcha/get',
      phoneVcode: '',
      error: false,
      stoped: true,
      timer: 60,
      pwdIsOk: 'ok',
      repeatPwdIsOk: 'ok'
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
  },
  methods: {
    // 密码验证
    pwdValidation (type) {
      let msg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      if (type === '1') {
        if (msg.test(this.passwd) === false) {
          this.pwdIsOk = 'error'
        } else {
          this.pwdIsOk = 'ok'
        }
      } else {
        if (msg.test(this.passwdConfirm) === false) {
          this.repeatPwdIsOk = 'error'
        } else {
          this.repeatPwdIsOk = 'ok'
        }
      }
    },
    // 密码验证重置
    pwdValidationRest (type) {
      if (type === '1') {
        this.pwdIsOk = ''
      } else {
        this.repeatPwdIsOk = ''
      }
    },
    /**
     * 设置密码
     */
    setPasswd () {
      if (!(!this.errors.any() && !this.fields.fields.password2.clean && !this.fields.fields.password.clean && (this.passwd === this.passwdConfirm) && this.passwd && this.passwdConfirm)) {
        console.log('前端输入验证不通过，点击按钮无效！')
        return
      }
      let postObj = {
        'loginAccount': this.phoneNum,
        'code': this.phoneVcode,
        'password': this.passwd,
        'rPassword': this.passwdConfirm,
        'captcha': this.vCode
      }
      if (this.passwd !== this.passwdConfirm) {
        this.$message({
          message: '两次密码输入不相等',
          type: 'error'
        })
        return
      } else {
        LoginAPI.setNewPwd(postObj).then(res => {
          if (res.data.code === 0) {
            this.step = 2
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
     * 获取手机验证码
     * @return {[type]} [description]
     */
    getPhoneVcode () {
      let postObj = {
        'type': 2,
        'captcha': this.vCode,
        'mobile': this.phoneNum
      }
      LoginAPI.getPhoneVcode(postObj).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.stoped = false
          this.timer = 60
          let time = setInterval(() => {
            this.timer--
            if (this.timer < 1) {
              clearInterval(time)
              this.stoped = true
            }
          }, 1000)
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    /**
     * 下一步按钮，进行短信验证，进入重置密码界面
     * @return {Function} [description]
     */
    next () {
      if (!(!this.errors.any() && !this.fields.fields.telephone.clean && !this.fields.fields.phoneVcode.clean && !this.fields.fields.vcode.clean && this.phoneNum && this.vCode && this.phoneVcode)) {
        console.log('前端输入验证不通过，点击按钮无效！')
        return
      }
      let postObj = {
        'loginAccount': this.phoneNum,
        'code': this.phoneVcode,
        'captcha': this.vCode
      }
      console.log(postObj)
      LoginAPI.validatePhoneVcode(postObj).then((res) => {
        if (res.data.code === 0) {
          this.step = 1
        } else {
//          this.$message({
//            message: res.data.message,
//            type: 'error'
//          })
          this.error = true
        }
      })
    },
    /**
     * 刷新验证码
     * @return {[type]} [description]
     */
    refreshVcodeUrl () {
      this.vCodeUrl = process.env.DOMAIN + '/bshop/forget/captcha/get?v=' + new Date().getTime()
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
    margin-top: 30px;
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
      height: 534px;
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
            margin: 3px 0 0 -15px;
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
        width: 100%;
        height: 56px;
        background: #F5F8FA;
        border-radius: 4px;
        font-size: 14px;
        // color: #7C98B6;
        border: none;
        border:1px solid #F5F8FA;
        box-sizing: border-box;
        text-indent:16px;
       &.code-input{
         width: 270px;
       }
      }
      .input-style:focus{
        border:1px solid #02AAAA;
        outline: none;
      }
      .confirm-input {
        margin-top:16px;
      }
      .input-bottom-remid{
        font-size: 12px;
        color: #FF3B6E;
        line-height: 16px;
        padding: 5px 0 7px 10px;
        background: #ffebf0;
      }
      .is-danger{
        border-radius: 4px;
        border:1px solid #FF3B6E
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
        cursor: pointer;
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
