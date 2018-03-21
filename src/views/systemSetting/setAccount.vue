<template>
  <div class="system-module">
    <headLeft></headLeft>
    <div class="right-content">
      <div class="u-right">
        <div class="top-info">
          <span class="left-image">
            <div class="avatar-uploader">
              <i class="mask-hints" @click="materialOptions.show=true"><p>修改</p></i>
              <img :src="newAvatar ? newAvatar : '/static/img/default_avatar.jpg'" class="avatar">
            </div>
          </span>
          <span class="right-desc">
            <p class="nickname">
              <span class="name">{{ loginInfo.name?loginInfo.name: companyinfo.contactName }}</span>
              <span class="edit-nameModule">
              <i class="icon-edit edit-userName" @click="userEditPOPFunc"></i>
              <!--编辑弹框start-->
                <div class="relatively-pop editname" v-if="userEditPOP">
                  <div class="title">姓名</div>
                  <div class="contact">
                    <input class="input_text" type="text" v-model="newname" />
                  </div>
                  <div class="bottom-btn">
                    <el-button type="default" class="left-true gray" v-if="newname=='' || newname==null">确定</el-button>
                    <el-button type="default" class="left-true cansub" @click="editPersonInfo('1')" v-else>确定</el-button>
                    <span class="left-cancel center" @click="userEditPOP = false">取消</span>
                  </div>
                </div>
            <!--编辑弹框end-->
                </span>
            </p>
            <p class="company-name">{{ loginInfo.shopName }}</p>
          </span>
        </div>
        <div class="set-module">
          <div class="systemsetting">
              <span class="display-desc">
                <i class="label">登录账号</i>
                <i class="display-data"  v-if="loginInfo.loginAccount">{{ loginInfo.loginAccount | nameEncrypt}}</i>
              </span>
              <el-button v-if="isFatherRight" type="default" class="btn" @click="updatePhone">修改手机号</el-button>
          </div>
          <div class="systemsetting margintop38">
            <span class="display-desc"><i class="label">密码</i><i class="display-data">********</i></span>
            <el-button type="default" class="btn" @click="editPassword = true">修改密码</el-button>
          </div>
        </div>
        <div class="set-bottm-module" >
          <div class="systemsetting">
                <span class="display-desc">
                  <i class="label">公司地址</i><i class="display-data">{{ companyinfo.provinceName }}{{ companyinfo.cityName }}{{ companyinfo.address }}</i>
                </span>
          </div>
          <div class="systemsetting">
                <span class="display-desc">
                  <i class="label">公司电话</i><i class="display-data">{{ companyinfo.contactPhone }}</i>
                </span>
          </div>
          <div class="systemsetting">
                <span class="display-desc">
                  <i class="label">公司邮箱</i><i class="display-data">{{ companyinfo.contactEmail }}</i>
                </span>
          </div>
        </div>
        <!--修改手机号验证弹框start-->
        <el-dialog title="更改手机号码" v-model="verifPhone" size="390px" custom-class="edit-verif">
          <div class="desc margintop16">
            为了保证您的账户安全，更换手机前请先进行安全认证
          </div>
          <!--没有验证展示 start-->
          <div class="title-second">验证方式</div>
          <div class="content-display">{{ loginInfo.loginAccount | nameEncrypt}}</div>
          <div class="input-verification">
              <input type="text" placeholder="短信验证码" class="input-text input-caveat" v-model="vCodeOld" v-if="verificationFailure" :readonly="isloadding" />
              <input type="text" placeholder="短信验证码" class="input-text" v-model="vCodeOld" :readonly="isloadding" v-else />
              <el-button type="default" class="hui-btn bluebg-whitefc-btn" @click="getVerificationCode(loginInfo.loginAccount,3)" v-if="!sedCodeSucess">发送验证码</el-button>
              <el-button type="default" class="hui-btn" v-else>{{ timing }}s</el-button>
          </div>
          <!--没有验证展示 end-->
          <div class="caveat-module" v-if="verificationFailure">
            <p><i class="icon-font icon-error"></i>{{ errordisplay }}</p>
          </div>
          <div slot="footer" class="dialog-footer lf-padding6" :class="{'is-ok': vCodeOld != ''}">
            <el-button type="primary" @click="verificationFunc()" v-if="!isloadding">确 定</el-button>
            <div class="loading loading-circle" v-else></div>
          </div>
        </el-dialog>
        <!--修改手机号验证弹框end-->
        <!--修改手机号弹框start-->
        <el-dialog title="更改手机号码" v-model="editPhone" size="390px" custom-class="edit-verif">
          <div class="desc lf-padding10">
           请输入您要绑定的手机号码，绑定后即可用该手机号登录
          </div>
          <!--没有验证展示 start-->
          <div class="input-verification input-verify" :class="{'input-is-danger': newphoneIsOk == 'error' || verificationFailure}">
            <input type="text" placeholder="请输入手机号" class="input-whole" v-model="newphone" name="telephone" v-validate="{ rules: { regex: /^1[0-9]{10}$/} }"  :readonly="isloadding" @blur="phoneValidation" @focus="phoneValidationRest"/>
            <div class="input-bottom-remid" :class="{'is-show': newphoneIsOk == 'error'}"><i class="icon-remind"></i>手机号码格式错误，请重新输入</div>
          </div>
          <div class="input-verification">
            <input type="text" placeholder="短信验证码" class="input-text input-caveat" v-model="vCodeNew" :readonly="isloadding" v-if="verificationFailure" >
            <input type="text" placeholder="短信验证码" class="input-text" v-model="vCodeNew" :readonly="isloadding" v-else />
            <el-button type="default" class="hui-btn" @click="getVerificationCode(newphone,4)" v-if="!sedCodeSucess" :class="{'bluebg-whitefc-btn': !errors.has('telephone') && newphone!=''}">发送验证码</el-button>
            <el-button type="default" class="hui-btn" v-else>{{ timing }}s</el-button>
          </div>
          <!--没有验证展示 end-->
          <div class="caveat-module" v-if="verificationFailure">
            <p><i class="icon-font icon-error"></i>{{ errordisplay }}</p>
          </div>
          <div slot="footer" class="dialog-footer lf-padding6" :class="{'is-ok': newphone != '' && vCodeNew != ''}">
            <el-button type="primary" @click="updateAccountFunc()" v-if="!isloadding">确 定</el-button>
            <div class="loading loading-circle" v-else></div>
            <div class="bottom-desc">
              <div class="desc">
                <i>*</i>你可以用此手机找回密码和登录
              </div>
              <div class="desc">
                <i>*</i>请勿随意泄露手机号，以防被不法分子利用，骗取账户信息
              </div>
            </div>
          </div>
        </el-dialog>
        <!--修改手机号弹框end-->
        <!--修改密码弹框start-->
        <el-dialog title="修改密码" v-model="editPassword" size="390px" custom-class="edit-verif">
          <div class="title-second lf-padding10">旧密码</div>
          <div class="input-verification">
            <input type="password" placeholder="请输入您的密码" class="input-whole" v-model="oldPassword" v-validate="{ rules: { regex: /.{6,20}$/} }" :class="{'input-caveat': errors.has('oldpassword') }" name="oldpassword" />
          </div>
          <div class="title-second lf-padding10">请输入新的密码<span class="small-btn" @click="newPasswordDisType = !newPasswordDisType"><span v-if="newPasswordDisType">隐藏</span><span v-else>显示</span>密码</span></div>
          <div class="input-verification" :class="{'input-is-danger': pwdIsOk == 'error'}">
            <input type="password" placeholder="请输入6-20位的密码，须同时含有数字和英文" class="input-whole" v-model="newPassword" v-validate="{ rules: { regex: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/} }" name="newpassword" v-if="!newPasswordDisType" maxlength="20" @blur="pwdValidation('1')" @focus="pwdValidationRest('1')"/>
            <input type="text" placeholder="请输入6-20位的密码，须同时含有数字和英文" class="input-whole" v-model="newPassword" v-validate="{ rules: { regex: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/} }" name="newpassword" maxlength="20" v-else @blur="pwdValidation" @focus="pwdValidationRest"/>
            <div class="input-bottom-remid" :class="{'is-show': pwdIsOk == 'error'}"><i class="icon-remind"></i>请输入6到20位的密码，须同时含有数字和字母</div>
          </div>
          <div class="title-second lf-padding10">请再次输入新的密码<span class="small-btn" @click="repeatPasswordDisType = !repeatPasswordDisType"><span v-if="repeatPasswordDisType">隐藏</span><span v-else>显示</span>密码</span></div>
          <div class="input-verification" :class="{'input-is-danger': repeatPwdIsOk == 'error'}">
            <input type="password" placeholder="再次输入新的登录密码" class="input-whole" v-model="repeatPassword" v-validate="{ rules: { regex: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/} }" name="repeatpassword" maxlength="20" v-if="!repeatPasswordDisType" @blur="pwdValidation('2')" @focus="pwdValidationRest('2')" />
            <input type="text" placeholder="再次输入新的登录密码" class="input-whole" v-model="repeatPassword" v-validate="{ rules: { regex: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/} }" name="repeatpassword" maxlength="20" v-else @blur="phoneValidation" @focus="pwdValidationRest" />
            <div class="input-bottom-remid" :class="{'is-show': repeatPwdIsOk == 'error'}"><i class="icon-remind"></i>请输入6到20位的密码，须同时含有数字和字母</div>
          </div>
          <div slot="footer" class="dialog-footer lf-padding6" :class="{'is-ok': !errors.any()&&oldPassword&&newPassword&&repeatPassword}">
            <el-button type="primary" @click="updatePasswordFunc()">确 定</el-button>
          </div>
        </el-dialog>
        <!--修改密码弹框end-->
        <uploadMaterial
        :options="materialOptions"
        @confirmInsert="confirmInsert"
        @cancelInsert="materialOptions.show=false"></uploadMaterial>
      </div>
    </div>
  </div>
</template>
<script>
import systemSettingAPI from '@/api/systemSettingAPI'
import headLeft from './systemIndex'
import uploadMaterial from '@/components/uploadMaterial'
export default {
  name: 'setAccount',
  data () {
    return {
      companyinfo: {},
      loginInfo: {},
      email: '未绑定',
      password: '',
      selectType: 1,
      dialogFormVisible: true,
      userEditPOP: false,  // 用户名编辑弹框
      verifPhone: false,  // 验证弹框
      editPhone: false,     // 修改手机号弹框
      editPassword: false,  //  修改密码弹框
      newname: '',    // 用户新昵称
      newAvatar: '', // 用户新头像
      vCodeOld: '',  // 旧账号验证码
      vCodeNew: '',  // 新账号验证码
      verificationFailure: false,      // 原手机验证是否失败
      sedCodeSucess: false,     // 验证码发送成功
      timing: 60,
      newphone: '', // 新手机号
      oldPassword: '',  // 旧密码
      newPassword: '',  // 新密码
      repeatPassword: '', // 重复密码
      newPasswordDisType: false,    // 1表示新密码明文显示
      repeatPasswordDisType: false,    // 1表示重复密码明文显示
      errordisplay: '',
      isloadding: false,
      domain: process.env.IMG_DOMAIN,
      newphoneIsOk: '',
      pwdIsOk: '', // 密码验证是否可以
      repeatPwdIsOk: '',
      /**
       * 是否是主账号
       * @type {Boolean}
       */
      isFatherRight: true,
      countdown: '',
      materialOptions: {
        multiple: false,
        size: 10,
        type: 'img',
        show: false,
        reload: true
      }
    }
  },
  components: {
    headLeft,
    systemSettingAPI,
    uploadMaterial
  },
  filters: {
    nameEncrypt: function (value) {
      let str = '' + value
      if (str !== '' && str !== undefined && str !== null) {
        let midelstr = str.substring('3', '7')
        let newvalue = str.replace(midelstr, '****')
        return newvalue
      }
    }
  },
  watch: {
    verifPhone: function () {
      if (!this.verifPhone && this.countdown !== '') {
        clearTimeout(this.countdown)
      }
    },
    timing: function () {
      if (this.timing < 60 && this.timing >= 0) {
        this.countdown = setTimeout(() => {
          this.timing = this.timing - 1
          // console.log(this.timing)
          if (this.timing === 0) {
            this.sedCodeSucess = false
            clearTimeout(this.countdown)
          }
        }, 1000)
      }
    }
  },
  methods: {
    // 密码验证
    pwdValidation (type) {
      let msg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      if (type === '1') {
        if (msg.test(this.newPassword) === false) {
          this.pwdIsOk = 'error'
        } else {
          this.pwdIsOk = 'ok'
        }
      } else {
        if (msg.test(this.repeatPassword) === false) {
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
    // 修改用户名弹框
    userEditPOPFunc () {
      if (this.userEditPOP) {
        this.userEditPOP = false
      } else {
        this.userEditPOP = true
        this.newname = this.loginInfo.name
      }
    },
    // 手机号验证
    phoneValidation () {
      let msg = /^1[0-9]{10}$/
      if (msg.test(this.newphone) === false) {
        this.newphoneIsOk = 'error'
      } else {
        this.newphoneIsOk = 'ok'
      }
    },
    // 手机号验证重置
    phoneValidationRest () {
      this.newphoneIsOk = ''
      this.verificationFailure = false
    },
    confirmInsert (file) {
      this.newAvatar = file.src
      this.loginInfo.avatar = this.newAvatar
      this.editPersonInfo('2')
      this.materialOptions.show = false
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt10M
    },
    updatePhone () {
      this.verifPhone = true
      this.editPhone = false
      this.errordisplay = ''
      this.sedCodeSucess = false
      this.timing = 60
      this.verificationFailure = false
      this.newphoneIsOk = ''
    },
    // 修改个人头像或名称
    editPersonInfo (type) {
      if (type === '1' && this.newname === '') {
        return
      }
      this.userEditPOP = false
      let senddata
      if (type === '1') {   // 修改昵称
        if (this.newname.length > 10) {
          this.$message.error('最长输入10字符')
          return
        }
        if (this.newname === '' || this.newname === null) {
          return
        }
        let re = new RegExp('^[ ]+$')
        if (re.test(this.newname)) {
          this.$message.error('不能全为空格')
          return
        }
        senddata = {
          name: this.newname,
          avatar: this.loginInfo.avatar
        }
      } else {    // 修改头像
        senddata = {
          name: this.loginInfo.name,
          avatar: this.newAvatar
        }
      }
      systemSettingAPI.updatePersonInfo(senddata).then(res => {
        let code = res.data.code
        if (code === 0) {
          if (type === '1') {
            this.loginInfo.name = this.newname
            this.userEditPOP = false
          }
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取验证码
    getVerificationCode (account, type) {
      let senddata = {
        mobile: account,
        type: type,
        captcha: 'yanz'
      }
      this.timing = 60
      systemSettingAPI.smsSend(senddata).then(res => {
        if (res.data.code === 0) {
          this.sedCodeSucess = true
          this.timing = this.timing - 1
          this.$message({
            message: '短信验证码发送成功',
            type: 'success'
          })
        } else {
          this.verificationFailure = true  // 错误提示显示
          this.errordisplay = res.data.message      // 错误提示显示
        }
      })
    },
    // 原手机验证
    verificationFunc () {
      if (this.vCodeOld === '') {
        console.log('无法提交')
        return
      }
      this.isloadding = true
      this.timing = 60
      clearTimeout(this.countdown)
      let senddata = {
        loginAccount: this.loginInfo.loginAccount,
        code: this.vCodeOld
      }
      systemSettingAPI.accountVerification(senddata).then(res => {
        this.isloadding = false
        this.sedCodeSucess = false
        if (res.data.code === 0) {
          this.editPhone = true    // 设置验证通过，二次验证弹框
          this.verificationFailure = false
          this.verifPhone = false
        } else {
          this.verificationFailure = true
          this.errordisplay = res.data.message
        }
      })
    },
    // 修改手机号
    updateAccountFunc () {
      if (this.errors.any() || this.newphone === '' || this.vCodeNew === '') {
        console.log('无法提交')
        return
      }
      this.isloadding = true
      clearTimeout(this.countdown)
      let senddata = {
        loginOriAccount: this.loginInfo.loginAccount,
        loginNewAccount: this.newphone,
        codeOld: this.vCodeOld,
        codeNew: this.vCodeNew
      }
      systemSettingAPI.updateAccount(senddata).then(res => {
        this.isloadding = false
        if (res.data.code === 0) {
          this.editPhone = false
          this.loginInfo.loginAccount = this.newphone
          this.timing = 60
          this.$message({
            message: '修改手机号成功',
            type: 'success'
          })
        } else {
          this.verificationFailure = true
          this.sedCodeSucess = false
          this.errordisplay = res.data.message
          this.timing = 60
        }
      })
    },
    // 修改密码提交
    updatePasswordFunc () {
      if (!(!this.errors.any() && this.newPassword && this.repeatPassword && this.oldPassword)) {
        console.log('前端输入验证不通过，点击按钮无效！')
        return
      }
      if (this.newPassword !== this.repeatPassword) {
        this.$message.error('二次输入密码不一致')
      } else {
        let senddata = {
          oldpwd: this.oldPassword,
          newpwd: this.newPassword
        }
        systemSettingAPI.updatePassword(senddata).then(res => {
          if (res.data.code === 0) {
            this.editPassword = false
            this.$message({
              message: '修改新密码成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    }
  },
  created () {
    this.isFatherRight = window.localStorage.subUserId === window.localStorage.userId
    systemSettingAPI.selectInfo().then(res => {
      this.companyinfo = res.data.data
    })
    systemSettingAPI.accountInfo().then(res => {
      this.loginInfo = res.data.data
      this.newAvatar = res.data.data.avatar
      this.newname = res.data.data.name
    })
  }
}
</script>
<style lang="less" rel="stylesheet/less">
  @c-border:#dfe3eb;
  .margintop16{
    margin-top:16px;
  }
  .left-image{
    position: relative;
    .avatar{
      height:80px;
      width:80px;
      border-radius: 40px;
    }
  }
  .left-image:hover{
    .mask-hints{
      cursor: pointer;
      display:block;
    }
  }
  .mask-hints{
    background: #000;
    width: 80px;
    height: 80px;
    position: absolute;
    border-radius: 40px;
    opacity: 0.3;
    display:none;
    p{
      color:#fff;
      position: absolute;
      bottom: 33px;
      left: 28px;
    }
  }
  .edit-userName{
    font-size:15px;
    color:#B0C1D4;
    position: relative;
  }
  .is-danger{
    border:1px solid #FF3B6E;
    border-radius:4px;
  }
  .right-desc{
    width:80%;
    .nickname{
      .edit-nameModule{
        position: relative;
        margin-left:8px;
        i{
          cursor: pointer;
        }
      }
    }
  }
  .lf-padding6{
    padding:0 6px;
  }
  .lf-padding10{
    padding:0 10px;
  }
  .relatively-pop{
    position:absolute;
    border:1px solid @c-border;
    border-radius: 4px;
    background: #fff;
  }
  .editname{
    padding:19px 16px 8px 16px;
    left: -16px;
    top: 34px;
  .input_text{
      margin-top:10px;
      border-radius: 2px;
      height:28px;
    }
    .bottom-btn{
      margin-top:15px;
      .left-true{
        cursor: pointer;
        font-size: 13px;
        line-height: 18px;
        padding:5px 9px;
        border-radius: 4px;
        color:#fff;
      }
      .cansub{
        background:#5488F9;
      }
      .cansub:hover{
        opacity: 0.7;
      }
      .gray{
        background: #EAF0F6;
        border: 1px solid #DFE3EB;
      }
      .left-cancel{
        cursor: pointer;
        margin-left:10px;
        padding:5px 9px;
        font-size: 13px;
        line-height: 18px;
        border:none;
      }
    }
  }
  .editname:before{
    content: " ";
    position: absolute;
    right: 10px;
    width: 10px;
    height: 10px;
    border: @c-border solid 1px;
    border-left: 0;
    border-bottom: 0;
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
    top: -5px;
    left:12px;
    background: #fff;
  }

  /*弹框*/
  .el-dialog__wrapper{
    .el-dialog{
      width:none;
    }
  }
  .edit-verif{
    .el-dialog__body{
      padding:0px 16px 0px 16px;
      overflow: hidden;
      .hui-btn{
        width: 107px;
        padding: 10px 0;
        text-align: center;
        vertical-align: top;
        cursor: pointer;
        margin-left:10px;
        background:#EAF0F6;
        border: 1px solid #DFE3EB;
        border-radius: 4px;
        color: #B0C1D4;
        display:inline-block;
      }
      .desc{
        font-size: 12px;
        color: #7C98B6;
        line-height: 18px;
      }
      .title-second{
        font-size: 14px;
        color: #33475B;
        line-height: 20px;
        margin-top:8px;
        .small-btn{
          float:right;
          font-size: 12px;
          color: #5488F9;
          line-height: 16px;
          cursor: pointer;
        }
      }
      .content-display{
        font-size: 18px;
        color: #33475B;
        line-height: 25px;
        text-align: center;
        padding:8px 0 14px 0;
      }
      .input-verification{
        margin:10px 10px 0 10px;
        .input-text{
          width: 210px;
          padding: 9px 0;
          text-indent: 8px;
          font-size: 13px;
        }
        .input-whole{
          width: 336px;
          padding: 9px 0;
          text-indent: 8px;
          font-size: 13px;
        }
        .bluebg-whitefc-btn{
          background:#5488F9;
          color:#fff;
          border-radius: 4px;
        }
        .bluebg-whitefc-btn:hover{
          opacity: 0.7;
        }
      }
      .caveat-module{
        margin:16px 10px 0 10px;
        color: #FF3B6E;
        line-height: 16px;
        font-size: 12px;
        padding:9px 10px;
        background: #ffebf0;
        border: 1px solid #FF3B6E;
        border-radius:4px;
      }
    }
    .el-dialog__footer{
      padding: 16px 20px 28px;
      .dialog-footer{
        .el-button{
          width:100%;
          background:#EAF0F6;
          border: 1px solid #DFE3EB;
          color: #B0C1D4;
        }
      }
      .bottom-desc{
        margin-top:10px;
        .desc{
          font-size: 12px;
          color: #7C98B6;
          line-height: 18px;
          text-align: left;
        }
      }
      .desc:first-child{
        margin-top:10px;
      }
      .is-ok{
        .el-button{
          background: #5488F9;
          border:none;
          color: #fff;
        }
        .el-button:hover{
          opacity: 0.7;
        }
      }
    }
  }

</style>

