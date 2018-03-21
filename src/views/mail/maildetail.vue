<template>
  <div class="mailDetail-container">
    <div class="back-title" @click="backMailList">
      <span><img src="../../../src/assets/img/left.png" class="left-back" /></span>
      <span>返回收件箱</span>
    </div>
    <div class="mailDetail-section" v-if="!detailLoad">
      <div class="head-section" v-if="item.sender">
        <img v-if="!item.sender.companyId" :src="item.sender.avatar || defaultPhoto" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img v-if="item.sender.companyId" :src="item.sender.avatar || companyPhoto" onerror="javascript:this.src='/static/img/default_company.png'">
        <p class="personName" v-if="item.sender.personId" :title="item.sender.name">{{item.sender.name}}</p>
        <p class="company" v-if="item.sender.personId" :title="item.sender.companyName">{{item.sender.companyName || '-'}}</p>
        <p class="single" v-if="item.sender.companyId" :title="item.sender.companyName">{{item.sender.companyName}}</p>
        <p class="single" v-if="!item.sender.personId && !item.sender.companyId" :title="item.sender.email">{{item.sender.email}}</p>
        <p v-if="isMainAccount === 'true'">
          <el-button @click="replyMail(item)" v-if="item.sender.personId || item.sender.companyId">回复</el-button>
          <el-button @click="showAddDialog(item)" v-else><i class="icon-font">&#xe684;</i>添加</el-button>
        </p>
        <p v-if="isMainAccount === 'false'">
          <el-button @click="replyMail(item)" v-if="(item.sender.personId || item.sender.companyId) && item.sender.isAddedStatusBySubUser === 1">回复</el-button>
          <el-button  disabled v-if="(item.sender.personId || item.sender.companyId) && item.sender.isAddedStatusBySubUser === 0">团队联系人</el-button>
          <el-button @click="showAddDialog(item)" v-if="item.sender.personId === null && item.sender.companyId === null"><i class="icon-font">&#xe684;</i>添加</el-button>
        </p>
      </div>
      <div class="mail-detail">
        <b class="subject-title">{{item.subject}}</b>
        <div class="mail-item">
          <p>收件人：</p>
          <span>{{item.to}}</span>
        </div>
        <div class="mail-item" v-if="item.sentTime">
          <p>时间：</p>
          <span>{{item.sentTime | time-formater-no-second}}</span>
        </div>
        <div class="mail-item" v-if="item.cc">
          <p>抄送：</p>
          <span>{{item.cc}}</span>
        </div>
        <div class="mail-item" v-if="item.bcc">
          <p>{{item.bcc}}</p>
        </div>
        <div class="mail-item" v-if="item.withAttach">
          <p>附件：</p>
          <span v-for="attachment in attachmentList" v-if="!attachLoad">
            <!--<i class="icon-font ppt">&#xe619;</i>-->
            <i class="icon-font attach">&#xe653;</i>
            <a :href="attachment.source" target="_blank">{{attachment.filename}}</a>
          </span>
          <span class="attach-buffer" v-if="attachLoad"></span>
        </div>
      </div>
      <div class="mail-content" ref="mailContent" v-html="item.textHtml || item.textPlain || item.text"></div>
    </div>
    <div class="mailDetail-section" v-if="detailLoad">
      <div class="loading loading-circle"></div>
    </div>
    <el-dialog title="新增联系人" v-model="dialogAddPerson" class="add-dialog" @close="closeAddPerson">
      <el-form label-position="top" :model="rulePersonForm" :rules="rules" ref="rulePersonForm">
        <el-form-item label="First Name" prop="firstName">
          <el-input v-model="rulePersonForm.firstName"></el-input>
        </el-form-item>
        <el-form-item label="Last Name">
          <el-input v-model="rulePersonForm.lastName"></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="rulePersonForm.position"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="rulePersonForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="add-dialog-footer">
        <el-button type="primary" @click="addPerson" class="add-btn" :disabled="!rulePersonForm.firstName || personError">新增</el-button>
        <el-button @click="closeAddPerson" class="add-btn">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import mailApi from '@/api/mailApi'
  export default {
    name: 'mailDetail',
    data () {
      let validateFirstName = (rule, value, callback) => {
        if (value.trim() === '') {
          this.personError = false
          callback(new Error('firstName 不能为空'))
          callback()
        } else {
          this.personError = false
          callback()
        }
      }
      let validEmail = (rule, value, callback) => {
        let rule1 = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
        if (value === '') {
          this.personError = false
          callback()
        } else if (!rule1.test(value)) {
          this.personError = true
          callback(new Error('请输入正确邮箱'))
        } else {
          this.personError = false
          callback()
        }
      }
      return {
        defaultPhoto: '/static/img/default_avatar.jpg', // 保存默认头像
        companyPhoto: '/static/img/default_company.png', // 保存默认公司头像
        dialogAddPerson: false, // 保存添加联系人弹框的显示状态
        rulePersonForm: {
          firstName: '',
          lastName: '',
          position: '',
          email: ''
        }, // 保存新增联系人的表单内容
        rules: {
          firstName: [
            { required: true, message: '请输入firstName', trigger: 'blur' },
            { validator: validateFirstName, trigger: 'blur' }
          ],
          email: [{validator: validEmail, trigger: 'blur'}]
        }, // 保存新增联系人表单的验证规则
        personError: false, // 保存新增联系人表单的验证是否完全通过
        item: {}, // 保存当前邮件详情
        attachmentList: [], // 保存附件列表
        detailLoad: false, // 保存详情是否在加载
        attachLoad: false, // 保存附件是否在加载
        isMainAccount: localStorage.getItem('isMainAccount')
      }
    },
    watch: {
      item () {
        this.$nextTick(() => {
          let mailLinks = this.$refs.mailContent.getElementsByTagName('a')
          for (let i = 0; i < mailLinks.length; i++) {
            mailLinks[i].setAttribute('target', '_blank')
          }
        })
      }
    },
    mounted () {
      this.$store.dispatch('updateMailRedPoint')
      this.getMailDetail()
    },
    computed: {
      channelList () {
        return this.$store.state.mail.channelList
      }
    },
    methods: {
      /*
      * 返回邮件列表
      * */
      backMailList () {
        this.$router.push({path: '/mailList'})
      },
      /*
      * 获取邮件详情
      * */
      getMailDetail () {
        let params = {
          receiveId: this.$route.query.id
        }
        this.detailLoad = true
        mailApi.getMailDetail(params).then(res => {
          if (res.data.code === 0) {
            this.item = res.data.data
            this.detailLoad = false
            if (this.item.withAttach) {
              this.attachLoad = true
              mailApi.getAttachment(params).then(res => {
                if (res.data.code === 0) {
                  this.attachLoad = false
                  this.attachmentList = res.data.data
                }
              })
            }
          }
        })
      },
      /*
       * 回复邮件
       * */
      replyMail (item) {
        let sender = item.sender
        event.stopPropagation()
        let params = {
          contactId: '',
          actionType: -1,
          contactType: -1,
          messageType: 'mail'
        }
        if (sender.personId) {
          params.contactId = sender.personId
          params.contactType = 0
        } else {
          params.contactId = sender.companyId
          params.contactType = 1
        }
        this.$router.push({path: '/contactDetail', query: params})
      },
      /*
       * 添加联系人
       * */
      addPerson (event) {
        event.stopPropagation()
        let _this = this
        this.$refs.rulePersonForm.validate((valid) => {
          if (valid) {
            this.rulePersonForm.mails = JSON.stringify([{'type': 0, 'mail': this.rulePersonForm.email}])
            this.rulePersonForm.createSource = 'mail_inbox_create'
            mailApi.addPerson(this.rulePersonForm).then(res => {
              if (!res.data.code) {
                this.dialogAddPerson = false
                _this.$message.success('新增联系人成功')
                this.getMailDetail()
              } else {
                _this.$message.error(res.data.message)
              }
            })
          } else {
            return false
          }
        })
      },
      /*
       * 打开联系人弹框
       * */
      showAddDialog (item) {
        this.rulePersonForm.email = item.sender.email
        this.dialogAddPerson = true
      },
      /*
       * 关闭联系人弹框
       * */
      closeAddPerson () {
        this.dialogAddPerson = false
        this.rulePersonForm = {
          firstName: '',
          lastName: '',
          position: '',
          email: ''
        }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/variable';
  @import '../../assets/style/base.less';
  html body{
    padding-top: 50px;
  }
  .mailDetail-container{
    i{
      cursor: pointer;
    }
    width: 1200px;
    margin: 0 auto 30px;
    .loadAnimation(){
      background: @textBorderColor;
      .animation(loadingColor, 1s, infinite);
    }
    .back-title{
      font-size:14px;
      padding: 30px 0 16px;
      line-height: 18px;
      cursor: pointer;
      i{
        font-size: 18px;
        font-weight: bolder;
        vertical-align: text-top;
        color: @disabledColor;
      }
      span{
        font-size: 13px;
        color: @detailTextColor;
      }
    }
    .mailDetail-section{
      width: 1200px;
      padding: 30px 20px 50px;
      border-radius: 4px;
      background: @white;
      box-shadow: 0 0 8px rgba(0,0,0,.08);
      box-sizing: border-box;
      .head-section{
        overflow: hidden;
        position: relative;
        padding: 0 20px;
        img{
          float: left;
          width: 50px;
          height: 50px;
          margin-right: 8px;
          border-radius: 50%;
        }
        p{
          &.personName{
            overflow: hidden;
            line-height: 25px;
            margin-top: 1px;
            margin-bottom: 4px;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: @textColor;
            font-size: 18px;
            font-weight: bolder;
            &.hasCompany{
              margin-bottom: 0;
              line-height: 50px;
            }
          }
          &.company{
            overflow: hidden;
            line-height: 18px;
            color: @mainFontColor;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 13px;
          }
          &.single{
            font-size: 18px;
            font-weight: bolder;
            line-height: 50px;
          }
        }
        .el-button{
          position: absolute;
          top: 8px;
          right: 20px;
          width: 110px;
          height: 34px;
          line-height: 34px;
          padding: 0;
          font-size: 13px;
          font-weight: 300;
          background: @activeBlue;
          border: none;
          span {
            color: @white;
          }
          &:hover{
            background: rgb(118, 160, 250);
          }
          i{
            margin-right: 4px;
          }
        }
      }
      .mail-detail{
        margin: 16px 0 24px;
        padding: 24px 20px;
        border-top: 3px solid #DFE3EB;
        background: @loadingColor;
        .subject-title{
          line-height: 30px;
          margin-bottom: 15px;
          font-size: 22px;
          color: @textColor;
        }
        .mail-item{
          margin-top: 8px;
          font-size: 13px;
          line-height: 18px;
          color: @mainFontColor;
          p{
            display: inline-block;
            width: 53px;
          }
          i{
            font-size: 14px;
            &.attach{
              color: #FFA726;
            }
          }
          a{
            margin-right: 12px;
            color: @activeBlue;
          }
          .attach-buffer{
            display: inline-block;
            width: 200px;
            height: 18px;
            vertical-align: text-top;
            .loadAnimation()
          }
        }
      }
      .mail-content{
        line-height: 18px;
        padding: 0 20px;
        font-size: 13px;
        color: @textColor;
        img{
          max-width: 1118px;
        }
        // .reset-border-img{
        //   margin: 0 0 0 18px;
        //   width: 100%;
        //   height: 18px;
        // }
      }
      .loading{
        margin: 150px auto 130px;
      }
    }
    .add-dialog{
      .el-dialog{
        width: 500px;
      }
      .el-dialog__header{
        border: none;
        padding: 25px 20px;
        background: @activeBlue;
        span{
          color: @white;
          font-size: 20px;
        }
        .el-dialog__close{
          font-size: 16px;
          color: @white;
        }
      }
      .el-dialog__body{
        padding: 30px 40px 20px;
        .el-form-item{
          margin-bottom: 20px;
          input{
            height: 40px;
          }
        }
      }
      .el-dialog__footer{
        padding: 21px 30px 30px 40px;
        text-align: left;
        background: #F5F8FA;
        border-top: 1px solid #CBD6E2;
        .add-btn{
          padding: 16px 53px;
          span{
            font-size: 16px;
          }
        }
      }
    }
  }
</style>
