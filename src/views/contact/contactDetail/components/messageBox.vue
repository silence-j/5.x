<template>
  <div class="message-box"
       :style="
       record!==''&&activeName=='first'||
       message!==''&&activeName=='third'||
       mailContext!==''&&activeName=='second'?'margin-bottom: 68px': ''">
       <!-- 素材库弹窗 -->
     <uploadMaterial
     :options="materialOptions"
     @confirmInsert="confirmInsert"
     @cancelInsert="materialOptions.show=false"></uploadMaterial>
    <el-tabs v-model="activeName" class="message-menu">
      <el-tab-pane name="first">
        <span slot="label" class="tab-item"><i class="icon-font icon-remark-i"></i>备注</span>
        <el-input placeholder="请输入备注" type="textarea" :rows="7" class="record-input" v-model="record"></el-input>
      </el-tab-pane>
      <el-tab-pane name="second" v-if="serverLevel!=='0'">
        <span slot="label" class="tab-item"><i class="icon-font icon-mail"></i>邮件</span>
        <div v-if="contactDetail.contact.mail&&hiddenEmail" class="email-container">
          <div class="email-input">
            <!-- {{contactDetail.contact}} -->
            <span class="mail-title">收件人</span>
            {{desc.name}}
            <em style="background: #fff" :disabled="true" v-text="'<'+contactDetail.contact.mail+'>'"></em>
            <span class="email-link">
              <span @click="copySend=!copySend">抄送</span>
              <span @click="secretSend=!secretSend">密送</span>
            </span>
          </div>
          <div class="email-input" v-show="copySend">
            <span class="mail-title">抄送</span>
            <span v-for="(val, index) in linkerList" class="address-remove">
              <em v-if="val.name">{{val.name}}</em>
              <em v-else>{{val.mail}}</em>
              <em v-if="val.name&&val.mail" :disabled="true" v-text="'<'+val.mail+'>'"></em>;
              <i class="icon-remove2" @click="delCopy(index)"></i>
            </span>
            <el-autocomplete
              v-if = "linkerList.length < 10"
              v-model="mailForm.copyerInput"
              :fetch-suggestions="queryCopyer"
              placeholder="多个地址按';'分割，最多输入10个"
              @select="handleSelect"
            ></el-autocomplete>
            <!-- <textarea placeholder="请输入邮箱地址，多个地址按';'分割，最多输入10个" v-model="mailForm.copyerId"></textarea> -->
          </div>
          <div class="email-input" v-show="secretSend">
            <span class="mail-title">密送</span>
            <span v-for="(val, index) in linker2List"  class="address-remove">
              <em v-if="val.name">{{val.name}}</em>
              <em v-else>{{val.mail}}</em>
              <em v-if="val.name&&val.mail" :disabled="true" v-text="'<'+val.mail+'>'"></em>;
              <i class="icon-remove2" @click="delSecret(index)"></i>
            </span>
            <!-- <textarea placeholder="请输入邮箱地址，多个地址按';'分割，最多输入10个" v-model="mailForm.secreterId"></textarea> -->
            <el-autocomplete
              v-if = "linker2List.length < 10"
              v-model="mailForm.secreterInput"
              :fetch-suggestions="querySecreter"
              placeholder="多个地址按';'分割，最多输入10个"
              @select="handleSelect2"
            ></el-autocomplete>
          </div>
          <div class="email-input">
            <span class="mail-title">发件人</span>
            {{senderName}}
            <em style="background: #fff" :disabled="true" v-text="'<'+userEmail+'>'" ></em>
          </div>
          <div class="email-input">
            <span class="mail-title">主题</span>
            <input type="text" placeholder="请输入主题" v-model="mailFormNew.subject">
          </div>
          <div class="file-input">
            <el-upload
              class="upload-file"
              :on-success="fileSuccess"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              :data="data"
              name="file"
              :disabled="true"
              :file-list="fileList"
              :action="fileOnload">
              <el-button
                size="small" type="text">点击上传附件(10M以内文件)</el-button>
            </el-upload>
          </div>
          <!-- <editor @getValue="getEmailContext" ref="simditor" placeholder="请输入正文" v-model="mailFormNew.text"></editor> -->
          <editor class="mail-editor"
          :content="mailFormNew.text"
          :imgList="imgList"
          @change="getEmailContext"
          @errmessage="tipErr"
          @sucmessage="tipSuc"
          @showmaterial="materialOptions.show=true"></editor>
        </div>
        <div class="none-social" v-if="!contactDetail.contact.mail">
          <p>{{text}}还无邮箱信息，请先完善{{text}}信息</p>
          <!-- <img src="../../../../assets/img/contact/email-empty.svg"> -->
        </div>
        <div class="none-social" v-if="contactDetail.contact.mail && !hiddenEmail">
          <p>你还未绑定邮箱，<a class="bind-email" href="#/channelList">点击绑定邮箱</a></p>
        </div>
      </el-tab-pane>
      <el-tab-pane name="third" v-if="serverLevel!=0">
        <span slot="label" class="tab-item"><i class="icon-font icon-msg-full"></i>Twitter私信</span>
        <el-input
          v-if="contactDetail.social&&
          (contactDetail.social.twUrl||contactDetail.social.twitterUrl)&&
          hiddenMessage"
          placeholder="请输入内容"
          type="textarea" :rows="7" class="record-input" v-model="message"></el-input>
        <div
          class="none-social"
          v-if="contactDetail.social&&(contactDetail.social.twUrl||contactDetail.social.twitterUrl)&&!hiddenMessage">
          <p>你还未绑定twitter账号<a class="bind-email" href="#/channelList">点击绑定账号</a></p>
        </div>
        <div
          class="none-social"
          v-if="!contactDetail.social||!(contactDetail.social.twUrl||contactDetail.social.twitterUrl)">
          <p>{{text}}暂无Twitter账号信息，请先完善{{text}}信息</p>
        </div>
      </el-tab-pane>
    </el-tabs>
    <transition name="slide">
      <div class="btn-container" v-show="record!==''&&activeName=='first'">
        <el-button type="primary" class="btn" @click="addComment">保存</el-button>
        <el-button type="default" class="btn" @click="record=''">取消</el-button>
      </div>
    </transition>
    <transition name="slide">
      <div class="btn-container email-btn" v-show="mailContext!==''&&activeName=='second'">
        <span style="margin-right: 10px">
          <el-button type="primary" class="btn" v-if="!sendLoading" @click="sendMail" >发送</el-button>
          <div style="vertical-align: bottom" class="el-button btn el-button--default" v-if="sendLoading">
            <div class="loading-circle" style="width: 8.6px;height: 8.6px;margin-left: 6px;margin-right: 6px"></div>
          </div>
        </span>
        <el-button type="default" class="btn" @click="clearContent">取消</el-button>
      </div>
    </transition>
    <transition name="slide">
      <div class="btn-container" v-show="message!==''&&activeName=='third'">
        <el-button type="primary" class="btn" @click="sendMessage">保存</el-button>
        <el-button type="default" class="btn" @click="message=''">取消</el-button>
      </div>
    </transition>
  </div>
</template>

<script>
  // import editor from '../../../../components/SimEditor.vue'
  import contactInfoApi from '../../../../../src/api/contactInfoApi'
  import VueHtml5Editor from 'longxi-vue-html5-editor'
  import uploadMaterial from '../../../../components/uploadMaterial'
  const editor = new VueHtml5Editor({
    name: 'vue-html5-editor',
    language: 'zh-cn',
    showModuleName: true,
    visibleModules: [
      'text',
      'color',
      'font',
      'align',
      'list',
      'link',
      'unlink',
      'tabulation',
      'hr',
      'eraser',
      'undo',
      'material'
    ],
    icons: {
      text: 'icon-edit',
      color: 'icon-Shape1',
      font: 'icon-wenzi',
      align: 'icon-alignleft',
      list: 'icon-list',
      link: 'icon-link',
      unlink: 'icon-unlink',
      tabulation: 'icon-table',
      hr: 'icon-hr',
      eraser: 'icon-delete',
      undo: 'icon-iconfresh',
      material: 'icon-pic'
      // keyword: 'icon-tequan'
    }
  })
  export default{
  // 上传图片组件
    data () {
      return {
        materialOptions: {
          size: 10,
          show: false,
          multiple: true,
          type: 'img'
        },
        sendLoading: false,
        imgList: [],
        defaultContent: '',
        senderName: '',
        fileList: [], // 显示的文件
        sendFile: [], // 发送的文件
        serverLevel: '1',
        text: '',
        message: '',
        record: '',
        activeName: 'first',
        mailContext: '',
        copySend: false,
        secretSend: false,
        hiddenMessage: false,
        hiddenEmail: false,
        userEmail: '',
        mailForm: {
          senderId: '',
          copyerId: '',
          copyerInput: '',
          secreterId: '',
          secreterInput: '',
          topic: ''
        },
        selectList: [],
        mailFormNew: {
          fromer: '',   // 发件人
          toer: '',   // 收件人
          subject: '',    // 主题
          text: ''  // 内容
        },
        data: {
          bucket: 'scrm'
        },
        oldQueryStr: '',
        linkerMap: {}, // 联系人列表map
        linkerList: [], // 已选择的联系人
        linker2List: [],
        fileOnload: process.env.NODE_ENV === 'production' ? 'https://mailserver.onloon.cc/api/file/upload' : 'http://track.mail.onloon.cc/api/file/upload'
      }
    },
    mounted () {
      /**
     * 权限模块
     * 普通 0
     * 引航版/普及版2
     * 超级盈店1
     * 如果 是普通用户 ，点击客户开发直接跳转到的是 社交推广tab,(客户开发tab被隐藏)
     * @type {[type]}
     */
      let user = JSON.parse(localStorage.user)
      this.senderName = user.name || user.loginAccount
      this.serverLevel = window.localStorage.serverLevel
      let messageType = this.$route.query.messageType
      this.text = parseInt(this.$route.query.contactType) ? '公司' : '联系人'
      contactInfoApi.channelShopList().then(res => {
        if (!res.data.code) {
          res.data.data.forEach((obj, i) => {
            if (obj.channelId === 'TWITTER' && obj.provideUserId) {
              this.hiddenMessage = true
            }
            if (obj.channelId === 'MAIL' && obj.emailAddress) {
              this.hiddenEmail = true
              this.userEmail = obj.emailAddress
            }
          })
          switch (messageType) {
            case 'mail':
              this.activeName = 'second'
              break
            default:
              this.activeName = 'first'
              break
          }
        }
      })
    },
    watch: {
      copySend () {
        this.mailForm.copyerId = ''
      },
      secretSend () {
        this.mailForm.secreterId = ''
      },
      record () {
        if (this.record && this.activeName === 'first') {
          this.$store.commit('CONTACT_ISEDITOVER', {isEditOver: false})
        } else {
          this.$store.commit('CONTACT_ISEDITOVER', {isEditOver: true})
        }
      },
      mailContext () {
        if (this.mailContext && this.activeName === 'second') {
          this.$store.commit('CONTACT_ISEDITOVER', {isEditOver: false})
        } else {
          this.$store.commit('CONTACT_ISEDITOVER', {isEditOver: true})
        }
      },
      message () {
        if (this.message && this.activeName === 'third') {
          this.$store.commit('CONTACT_ISEDITOVER', {isEditOver: false})
        } else {
          this.$store.commit('CONTACT_ISEDITOVER', {isEditOver: true})
        }
      }
    },
    methods: {
      // 抄送搜索联系人
      queryCopyer (queryStr, cb) {
        this.querySearchAsync(queryStr, cb, 0)
      },
      // 密送搜索联系人
      querySecreter (queryStr, cb) {
        this.querySearchAsync(queryStr, cb, 1)
      },
      querySearchAsync (queryStr, cb, flag) {
        let _this = this
        // 输入分号分隔邮箱
        let rule1 = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
        // if (queryStr) {
        //   return
        // }
        if (queryStr) {
          let len = queryStr.length - 1
          let mailval = queryStr.substring(0, len)
          if (len === -1 || (queryStr.indexOf(';') === len && len === 0)) { // 空; 直接空;
          } else {
            if (queryStr.indexOf(';') === len && queryStr.length !== 0) {
              if (!rule1.test(mailval)) {
                this.$message.error('请输入正确邮箱')
                if (flag) {
                  this.mailForm.secreterInput = ''
                } else {
                  this.mailForm.copyerInput = ''
                }
                return
              }
              if (flag) {
                let isRep = this.isRepeat(this.linker2List, mailval, 'mail')
                if (!isRep) {
                  this.linker2List.push({name: '', mail: mailval})
                }
                this.mailForm.secreterInput = ''
              } else {
                let isRep = this.isRepeat(this.linkerList, mailval, 'mail')
                if (!isRep) {
                  this.linkerList.push({name: '', mail: mailval})
                }
                this.mailForm.copyerInput = ''
              }
            }
          }
        }
        // 搜索
        setTimeout(() => {
          if (queryStr === _this.oldQueryStr) {
            contactInfoApi.getContactPersonList({keyword: queryStr, mail: true}).then(res => {
              let contactSearch = []
              res.data.data.records.forEach(function (record) {
                contactSearch.push({
                  value: record.name + '<' + record.mail + '>',
                  name: record.name
                })
                _this.linkerMap[record.name] = record.mail
                _this.selectList = res.data.data.records
              })
              let results = queryStr ? contactSearch.filter(this.linkFilter(queryStr)) : contactSearch
              cb(results)
            })
          }
        }, 320)
        this.oldQueryStr = queryStr
      },
      linkFilter (queryStr) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryStr.toLowerCase()) !== -1)
        }
      },
      // 抄送下拉选择
      handleSelect (item) {
        let flag = this.isRepeat(this.linkerList, item.name, 'name')
        if (!flag) {
          this.linkerList.push({name: item.name, mail: this.linkerMap[item.name]})
        }
        this.mailForm.copyerInput = ''
      },
      // 密送下拉选择
      handleSelect2 (item) {
        let flag = this.isRepeat(this.linker2List, item.name, 'name')
        if (!flag) {
          this.linker2List.push({name: item.name, mail: this.linkerMap[item.name]})
        }
        this.mailForm.secreterInput = ''
      },
      isRepeat (arr, val, key) {
        let flag = false // 是否已存在
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i][key] === val) {
            flag = true
            break
          }
        }
        return flag
      },
      // 删除选择的联系人
      delCopy (index) {
        this.linkerList.splice(index, 1)
      },
      delSecret (index) {
        this.linker2List.splice(index, 1)
      },
      fileSuccess (response, file, fileList) {
        this.sendFile.push(response.data)
        // this.fileList.push({name: response.data.originalFileName, url: response.data.urlWhole, shorturl: response.data.url})
        this.fileList.push({name: response.data.filename, shorturl: response.data.source})
        // this.fileList.push(response.data)
        console.log(this.fileList)
      },
      handleRemove (file, updatelist) {
        console.log(updatelist)
        this.sendFile = updatelist
        this.fileList = []
        updatelist.forEach((file, index) => {
          this.fileList.push({name: file.name, shorturl: file.shorturl})
        })
        console.log(this.fileList)
      },
      // 上传前验证
      beforeUpload (file) {
        let isLt10M = file.size / 1024 / 1024 < 10
        if (!isLt10M) {
          this.$message.error('上传附件大小不能超过 10MB!')
          return false
        }
//        if (!isLt2M) {
//          this.picUrl = 'error'
//          this.bannerSrc = ''
//        }
        return isLt10M
      },
      addComment () {
        if (this.record.length > 1000 || this.record === '') {
          this.$message.error('备注字符限制为0-1000')
          return
        }
        contactInfoApi.contactCommentAdd({
          contactType: this.$route.query.contactType,
          contactId: this.$route.query.contactId,
          content: this.record
        }).then(res => {
          if (!res.data.code) {
            this.$store.dispatch('getTimeLine', {contactId: this.$route.query.contactId})
            this.record = ''
            this.$message.success('添加备注成功！')
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 发送邮件
      sendMail () {
        this.sendLoading = true
        let data = {}
        // 收件人
//        let contactsId = this.contactDetail.contactId
//        let firstName = this.contactDetail.base.firstName
//        let lastName = this.contactDetail.base.lastName
//        let mail = this.contactDetail.contact.mail
//        let toer = JSON.stringify({toerobj})

//        Object.assign(data, this.mailForm, {
//          contactsType: this.$route.query.contactType,
//          senderId: this.userEmail,
//          actionType: this.$route.query.actionType === undefined ? -1 : this.$route.query.actionType,
//          lastId: this.$route.query.messageId,
//          receiverId: this.contactDetail.contact.mail,
//          messageFileForms: JSON.stringify(this.sendFile)
//        })
        Object.assign(data, this.mailFormNew, {
          fromer: this.userEmail,
          toer: this.desc.name + '<' + this.contactDetail.contact.mail + '>'
        })
        if (this.sendFile.length > 0) {
          let attachslist = []
          this.sendFile.forEach(file => {
            let originalFileName = file.filename    // 原文件名
            let url = file.source
            let type = file.filetype
            let size = file.size
            let obj = {
              filename: originalFileName,
              source: url,
              filetype: type,
              size: size
            }
            attachslist.push(obj)
          })
          data.attachs = JSON.stringify(attachslist)
        }
        if (this.copySend && this.linkerList.length > 0) {
          let mails = []
          this.linkerList.forEach(item => {
            if (item.mail) {
              mails.push(item.mail)
            }
          })
          data.ccer = mails.join(';')
        }
        if (this.secretSend && this.linker2List.length > 0) {
          let mails = []
          this.linker2List.forEach(item => {
            if (item.mail) {
              mails.push(item.mail)
            }
          })
          data.bccer = mails.join(';')
        }
        console.log(data)
//        contactInfoApi.sendMail(data).then(res => {
//          if (!res.data.code) {
//            this.$message.success('发送成功')
//            // 清空表单
//            this.mailForm = {}
//            this.clearContent()
//            this.fileList = []
//            this.sendFile = []
//            this.linkerList = []
//            this.linker2List = []
//            this.$store.dispatch('getTimeLine', {contactId: this.$route.query.contactId})
//          } else {
//            this.$message.error(res.data.message)
//          }
//        })
        contactInfoApi.sendMailNew(data).then(res => {
          if (!res.data.code) {
            this.sendLoading = false
            this.$message.success('发送成功')
            // 清空表单
            this.mailForm = {}
            this.mailFormNew = {}
            this.clearContent()
            this.fileList = []
            this.sendFile = []
            this.linkerList = []
            this.linker2List = []
            this.$store.dispatch('getTimeLine', {contactId: this.$route.query.contactId})
          } else {
            this.sendLoading = false
            this.$message.error(res.data.message)
          }
        })
      },
      sendMessage () {
        contactInfoApi.socialUserSend({
          contactsType: parseInt(this.$route.query.contactType),
          contactsId: this.$route.query.contactId,
          message: this.message
        }).then(res => {
          if (!res.data.code) {
            this.$store.dispatch('getTimeLine', {contactId: this.$route.query.contactId})
            this.message = ''
            this.$message.success('发送私信成功')
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      clearContent () {
        this.mailContext = ''
        // this.$refs.simditor.removetext()
      },
      getEmailContext (value) {
        this.mailContext = value
        this.mailForm.content = value
        this.mailFormNew.text = value
      },
      tipErr (val) {
        this.$message.error(val)
      },
      tipSuc (val) {
        this.$message.success(val)
      },
      confirmInsert (val) {
        for (let item of val) {
          this.imgList.push({
            url: item.src,
            name: item.name
          })
        }
        this.materialOptions.show = false
        setTimeout(() => {
          this.imgList = []
        }, 500)
      }
    },
    computed: {
      contactDetail () {
        let detail = parseInt(this.$route.query.contactType)
          ? this.$store.getters.companyDetail
          : this.$store.getters.contactDetail
        return detail
      },
      desc () {
        return this.$store.getters.desc
      }
    },
    components: {
      editor,
      uploadMaterial
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  // .email-container .multiEditor .simditor .simditor-body  {
  //   height: auto;
  //   padding: 22px 15px 20px;
  // }
  .mail-editor.vue-html5-editor{
    margin-bottom:20px;
    &>.content{
      padding: 20px;
    }
    &>.toolbar>ul>li .icon{
      height: 36px;
      line-height: 36px;
    }
    // ol li{
    //   list-style: decimal;
    //   list-style-position: inside;
    // }
    // ul li{
    //   list-style: disc;
    //   list-style-position: inside;
    // }
    .toolbar .el-upload--picture-card {
      margin-bottom: 8px;
      width: 95px;
      height: 95px;
      line-height: 95px;
    }
  }
  .file-input{
    min-height: 30px;
    .el-upload{
      float: left;
    }
    .el-upload-list{
      display: inline-block;
      li{
        margin-top: 0;
        float: left;
        width: auto;
      }
      :first-child{
        margin-top: 0;
      }
    }
  }
  .right {
    position: relative;
    z-index: 1
  }

  .message-box {
    .el-tabs__active-bar {
      height: 5px;
      border-radius: 10px;
    }
    .el-tabs__item {
      height: 60px;
      line-height: 60px;
    }
    .record-input {
      textarea {
        resize: none;
        border: none;
      }
    }
    .el-autocomplete{
      width: 230px;
      .el-input .el-input__inner{
        &:hover, &:focus{
          border: 0;
          box-shadow: none;
        }
      }
    }
    .tab-item{
      font-size: 13px;
      color: #7C98B6;
      .icon-font{
        color: #B0C1D4;
      }
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../../assets/style/variable";
  // @import "../../../../assets/style/base";
  .slide-enter-active {
    transition: all .3s ease;
  }

  /*.slide-leave-active {*/
  /*transition: all .3s ease;*/
  /*}*/
  .slide-enter {
    transform: translateY(-100%);
  }

  .message-box {
    .none-social{
      height: 200px;
      padding: 0 20px;
      position: relative;
      p{
        position: absolute;
        top: 45%;
        text-align: center;
        left: 50%;
        transform: translate(-50%,-50%);
        img{
          width: 83px;
          display: block;
          margin: 0 auto;
          margin-bottom: 10px;
        }
      }
      .bind-email{
        color: #5488F9;
        text-decoration: underline;
        cursor: pointer;
        padding: 0 5px;
      }
    }
    .message-menu {
      z-index: 99;
      width: 780px;
      background: @white;
      border-radius: 4px;
      box-shadow: 0 0 20px #DFE3EB;
      .el-tabs__item{
        &.is-active{
          span,i{
            color: @activeBlue;
          }
        }
      }
      .email-container {
        padding: 0 20px;
        // height: 608px;
        .email-input {
          position: relative;
          min-height: 50px;
          line-height: 50px;
          padding-left: 100px;
          border-bottom: 1px solid #CBD6E2;
          .mail-title {
            position: absolute;
            left: 10px;
            // vertical-align: top;
            // display: inline-block;
            // width: 100px;
          }
          input,textarea {
            width: 550px;
            height: 40px;
            /*margin-left: 50px;*/
            border: none;
            outline: none;
          }
          textarea{
            resize: none;
            height: 22px;
            padding-top: 18px;
          }
          .email-link {
            float: right;
            span {
              margin-right: 10px;
              color: @activeBlue;
              cursor: pointer;
            }
          }
        }
      }
      i {
        margin-right: 5px;
        font-size: 14px;
      }
    }

    .btn-container {
      // position: absolute;
      // top: 226px;
      // transform: translateY(-100%);
      width: 740px;
      z-index: -99;
      border-radius: 4px;
      padding: 20px;
      background: #F5F8FA;
      box-shadow: 0 0 20px #DFE3EB;
      .btn {
        padding: 9px 30px;
      }
    }
    .email-btn {
      // top: 677px
    }
  }
  .address-remove{
    margin-right: 10px;
    padding: 5px 0 5px 10px;
    font-size: 13px;
    background-color: #EAF0F6;
    border: 1px solid transparent;
    .icon-remove2{
      display: inline-block;
      color: #33475B;
      font-size: 14.1px;
      transform: scale(0.6);
      -webkit-transform: scale(0.6);
      cursor: pointer;
    }
    &:hover{
      border: 1px solid #5488F9;
    }
  }
</style>
