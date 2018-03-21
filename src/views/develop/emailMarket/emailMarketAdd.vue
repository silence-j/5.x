<template>
    <div class="emailmAdd-container">
      <div class="emailmAdd-write">
        <el-form label-width="107px" :rules="rules" ref="form" :model="form">
          <el-form-item label="邮件推广名称:" prop="title">
            <el-input :maxlength=100 v-model="form.title" @change="formchange" placeholder="请输入推广名称 例“春季欧洲客户新品营销”"></el-input>
            <span class="word-num"><i>{{form.title.length}}</i>/100</span>
          </el-form-item>
          <el-form-item label="发件人:">
            <label class="form-text">{{senderName}} <em>&lt;{{form.sender}}&gt;</em></label>
          </el-form-item>
          <el-form-item label="邮件标题:" prop="subject" id="email-subject">
            <el-input v-model="form.subject" @change="formchange" placeholder="请输入邮件标题例 “ Hi Ms.green we have something for you”"></el-input>
            <!-- <div contenteditable v-model="form.productName2"></div> -->
            <!-- <span class="button" v-for="k in featureArr">k</span> -->
          </el-form-item>
          <el-button type="primary" class="btn-feature" @click="featureModel=true"><i class="icon-user2"></i>特征词</el-button>
        </el-form>
      </div>
      <div class="emailmAdd-desc">
        <h3>跟踪</h3>
        <p>跟踪用户是否打开邮件</p>
        <p class="desc-small">我们将会在邮件中嵌入用户不可见的控件，用来了解谁打开您的营销邮件</p>
        <p>跟踪用户是否点击邮件中的链接</p>
        <p class="desc-small">我们将会在邮件中嵌入用户不可见的控件，用来了解谁点击了您的营销邮件中的链接</p>
      </div>
      <el-dialog title="特征词" v-model="featureModel" class="feature-model">
        <el-select v-model="featureGroup" placeholder="选择特征词">
          <el-option label="First Name" value="First Name"></el-option>
          <el-option label="Last Name" value="Last Name"></el-option>
            <!-- <el-option
              v-for="item in group.subGroup"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option> -->
        </el-select>
        <div class="confirm-btn">
          <el-button type="primary" class="confirm" @click="featureOk">确定</el-button>
          <el-button class="close"  @click="featureModel = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import emailmApi from '@/api/emailMarketApi'
  // import Vue from 'vue'
  export default{
    name: 'emailMarketAdd',
    data () {
      let vblank = (rule, value, callback) => {
        let rule1 = /^\s+$/
        if (value === '') {
          callback()
        } else if (rule1.test(value)) {
          if (rule.field === 'title') {
            callback(new Error('请输入邮件推广名称！'))
          } else {
            callback(new Error('请输入邮件标题！'))
          }
        } else {
          this.validError = false
          callback()
        }
      }
      return {
        form: {
          subject: '',
          subprefix: '',
          subsuffix: '',
          title: '',
          senderName: '',
          sender: '' // 发件人邮箱
        },
        featureModel: false,
        featureGroup: '',
        rule: /^\s+$/,
        // featureArr: [],
        valid: false,
        // senderEmail: '',
        senderName: '', // 发送人
        rules: {
          title: [
            { required: true, message: '!请输入邮件推广名称', trigger: 'blur' },
            { validator: vblank, trigger: 'blur' }
          ],
          subject: [
            { required: true, message: '请输入邮件标题！', trigger: 'blur' },
            { validator: vblank, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters({
        sendInfo: 'sendInfo',
        isDirty: 'isDirty'
      })
    },
    watch: {
      featureModel () {
        if (this.featureModel && this.form.subject) {
          const subtext = document.getElementById('email-subject').querySelector('input[type="text"]')
          let cursurPosition = -1
          if (subtext.selectionStart) { // 非IE浏览器
            cursurPosition = subtext.selectionStart
          } else { // IE
            var range = document.selection.createRange()
            range.moveStart('character', -subtext.value.length)
            cursurPosition = range.text.length
          }
          this.form.subprefix = this.form.subject.substring(0, cursurPosition)
          this.form.subsuffix = this.form.subject.substring(cursurPosition, this.form.subject.length)
          // alert(cursurPosition)
        }
        return this.featureModel
      },
      senderName () {
        this.form.senderName = this.senderName
      }
    },
    mounted () {
      let isEdit = this.$route.query.id
      // 之前有填写的
      if (this.$store.getters.ismenuclick) {
        let info = this.$store.getters.sendInfo
        if (info.first && JSON.stringify(info.first) !== '{}') {
          // this.$emit('addValid', true)
          this.form.subject = info.first.subject
          this.form.title = info.first.title
          this.form.sender = info.first.sender
          this.form.senderName = info.first.senderName
          this.validAdd()
        }
        this.getSender()
      } else {
        if (isEdit) {
          emailmApi.getMarketDetail({mailMarketingId: isEdit}).then(res => {
            if (!res.data.code) {
              let editData = res.data.data
              console.log(editData)
              // 编辑草稿需要second,其他不需要second
              let second = {}
              // query.edit 暂时不用
              // if (this.$route.query.edit) {
              //   second = {contactsIds: editData.receivers, contactsGroupIds: editData.groupReceivers}
              // }
              this.$store.commit('DEVELOP_SENDINFO', { first: editData, second, third: editData.content, four: {}, tmplId: editData.tmplId || '' })
              this.$store.commit('DEVELOP_EMAILCONTENTLIST', editData.contentArr)
              this.$emit('addValid', true)
              this.$emit('schTime', res.data.data.scheduleTime)
              Object.assign(this.form, editData)
              this.form.subprefix = ''
              this.form.subsuffix = ''
              this.getSender()
              this.validAdd()
              // if (this.$route.query.edit) {
              //   let step = 0
              //   if ((editData.receivers && editData.receivers.length) || (editData.groupReceivers && editData.groupReceivers.length)) {
              //     step = 1
              //     if (editData.content) {
              //       step = 3
              //     } else {
              //       // step = 2
              //     }
              //   }
              //   this.$emit('changeMenu', step)
              // }
            }
          })
        // from 联系人页面
        } else if (this.sendInfo.second && this.sendInfo.second.contactsIds && this.sendInfo.second.contactsIds.length) {
          console.log(2)
          this.getSender()
        } else {
          this.getSender()
        }
      }
      // this.getSenderName()
    },
    created () {
    },
    methods: {
      // 发件人
      getSender () {
        if (!this.form.sender) {
          emailmApi.channelShopList().then(res => {
            if (!res.data.code) {
              res.data.data.forEach((obj, i) => {
                if (obj.channelId === 'MAIL' && obj.emailAddress) {
                  Object.assign(this.form, {sender: obj.emailAddress})
                  // Vue.set(this.form, 'sender', obj.emailAddress)
                }
              })
            }
          })
        }
        this.form.senderName = JSON.parse(localStorage.user).name
        if (!this.form.senderName) {
          emailmApi.getContact().then(res => {
            if (!res.data.code) {
              this.senderName = res.data.data.contactName
              this.form.senderName = res.data.data.contactName
              this.$store.commit('DEVELOP_SENDINFO', { first: this.form })
            }
          })
        } else {
          this.senderName = this.form.senderName
          this.$store.commit('DEVELOP_SENDINFO', { first: this.form })
        }
      },
      formchange () {
        this.judgeValid()
      },
      /**
       * 选择特征词
       */
      featureOk () {
        if (this.featureGroup) {
          this.form.subject = this.form.subprefix + '$' + this.featureGroup + '$' + this.form.subsuffix
          // this.featureArr.push(this.featureGroup)
          this.judgeValid()
        }
        this.featureModel = false
      },
      /**
       * 存提交的数据
       */
      judgeValid () {
        this.$store.commit('DEVELOP_SETDIRTY', true)
        this.$store.commit('DEVELOP_SENDINFO', { first: this.form })
        this.validAdd()
      },
      validAdd () {
        this.form.subprefix = ''
        this.form.subsuffix = ''
        if (this.form.title && this.form.subject && !this.rule.test(this.form.title) && !this.rule.test(this.form.subject)) {
          this.$emit('addValid', true)
        } else {
          this.$emit('addValid', false)
        }
      }
    },
    components: {
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
.emailmAdd-container{
  margin: 0 auto;
  width: 800px;
  .form-text{
    em{
      font-weight: bold;
    }
  }
  .feature-model{
    .el-dialog{
      width: 460px;
    }
    .el-dialog__header{
      padding: 18px 18px 18px 20px;
      border-bottom: 1px solid #DFE3EB;
    }
    .el-dialog__body{
      padding: 25px 40px 30px 40px;
    }
    .el-select{
      margin-bottom: 20px;
      width: 100%;
      .el-input__inner{
        height: 28px;
      }
    }
  }
  .el-form-item.is-required .el-form-item__label:before{
    display: none;
  }
}
.emailmAdd-write, .emailmAdd-desc{
  margin-bottom: 20px;
  background: white;
  box-shadow: 0 0 8px rgba(0,0,0,.08);
  border-radius: 4px;
}
.emailmAdd-desc{
  height: 159px;
  padding: 31px 28px 28px 29px;
  h3{
    margin-bottom: 18px;
    font-size: 18px;
    font-weight: bold;
  }
  p{
    line-height: 25px;
    font-size: 13px;
  }
  .desc-small{
    margin-bottom: 23px;
    color: #4F6D95;
  }
}
.emailmAdd-write{
  height: 183px;
  padding: 29px 28px 28px 22px;
  .el-input{
    width: 86%;
  }
  .el-form-item{
    margin-bottom: 10px;
  }
  .el-button{
    .icon-user2{
      margin-right: 5px;
    }
  }
}
.btn-feature{
  margin: 10px 0 0 109px;
  width: 110px;
  padding: 8px 15px 9px 15px;
}
.word-num{
  position: absolute;
  // left: 76%;
  right: 15%;
  top: 3px;
  top: 3px\8\0;
  padding-left: 3px;
  // min-width: 40px;
  height: 31px;
  line-height: 31px;
  font-size: 13px;
  color: #CBD6E2;
  background: #fff;
  // i{
  //   color: #5488F9;
  // }
}
</style>
