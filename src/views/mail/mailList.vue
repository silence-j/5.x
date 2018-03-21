<template>
  <div class="mailList-container">
    <h1 class="mail-title" v-if="!noBindAccount">收件箱</h1>
    <div class="mailList-section" v-if="!noBindAccount">
      <ul class="leftMail-menu loading-menu" v-if="menuLoad">
        <li class="buffer" v-for="n in 3">
          <span class="base-photo"></span>
          <p class="userName"></p>
          <p class="userChannel">
            <span></span>
          </p>
        </li>
      </ul>
      <ul class="leftMail-menu" v-else>
        <li v-for="(menu,index) in channelList" v-if="menu.channelId == 'MAIL'" @click="chooseMenu(index,menu)" :class="activeMenu == index || menu.bindingTag == 1?'active':''">
          <img :src="mailType(menu.realName)" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
          <p class="userName" :title="menu.emailAddress">{{menu.emailAddress}}</p>
          <p class="userChannel">
            <span v-if="menu.channelId !== 'MAIL'">
              <i class="icon-font iconFont-facebook">&#xe6d9;</i>
              <span>Facebook</span>
            </span>
            <span v-if="menu.channelId !== 'MAIL'">
              <i class="icon-font iconFont-twitter">&#xe6d2;</i>
              <span>Twitter</span>
            </span>
            <span v-if="menu.channelId == 'MAIL'">
              <span>{{menu.realName}}</span>
            </span>
          </p>
        </li>
      </ul>
      <div class="right-panel" v-if="initList">
        <div class="head-part">
          <el-input class="mail-input" placeholder="请输入发件人邮箱地址或邮件标题" v-model="searchText" @keyup.enter.native="searchMail">
            <el-button slot="append" icon="search" @click="searchMail"></el-button>
          </el-input>
        </div>
        <div class="list-section">
          <ul class="list-header">
            <li class="sender">发件人</li>
            <li class="mailTitle">邮件标题</li>
            <li class="createTime">创建时间</li>
            <li >操作</li>
          </ul>
          <ul class="list-body" v-for="(item,index) in mailList.records" v-if="!listLoad && !listNoRecord" @click="linkToMailDetail(item)">
            <li class="sender">
              <img v-if="!item.sender.companyId" :src="item.sender.avatar || defaultPhoto" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
              <img v-if="item.sender.companyId" :src="item.sender.avatar || companyPhoto" onerror="javascript:this.src='/static/img/default_company.png'">
              <p class="personName" v-if="item.sender.personId" :title="item.sender.name">{{item.sender.name}}</p>
              <p class="company" v-if="item.sender.personId" :title="item.sender.companyName">{{item.sender.companyName || '-'}}</p>
              <p class="single" v-if="item.sender.companyId" :title="item.sender.companyName">{{item.sender.companyName}}</p>
              <p class="single" v-if="!item.sender.personId && !item.sender.companyId" :title="item.sender.email">{{item.sender.email}}</p>
            </li>
            <li class="mailTitle" :title="item.subject" :class="{'read':item.seen}">
              <i class="icon-font seen" v-if="item.seen">&#xe6a1;</i>
              <i class="icon-font not-seen" v-else>&#xe6a0;</i>
              <span>{{item.subject}}</span>
              <i class="icon-font attach" v-if="item.withAttach">&#xe653;</i>
            </li>
            <li class="createTime" v-if="item.sentTime">{{item.sentTime | time-formater-no-second}}</li>
            <li class="createTime" v-if="!item.sentTime">-</li>
            <li class="operate" v-if="isMainAccount === 'true'">
              <el-button style="width:102px" class="activeStyle" @click="replyMail($event,item)" v-if="item.sender.personId || item.sender.companyId">回复</el-button>
              <el-button style="width:102px" class="activeStyle" v-else @click="showAddDialog($event,item)" >+联系人</el-button>
            </li>
            <li class="operate" v-if="isMainAccount === 'false'">
              <el-button style="width:102px" class="activeStyle" @click="replyMail($event,item)" v-if="(item.sender.personId || item.sender.companyId) && item.sender.isAddedStatusBySubUser === 1">回复</el-button>
              <el-button style="width:102px" disabled v-if="(item.sender.personId || item.sender.companyId) && item.sender.isAddedStatusBySubUser === 0">团队联系人</el-button>
              <el-button style="width:102px" class="activeStyle" v-if="item.sender.personId === null && item.sender.companyId === null" @click="showAddDialog($event,item)" >+联系人</el-button>
            </li>
          </ul>
          <div class="noData-container" v-if="!listLoad && listNoRecord && hasKeyword">
            <div class="center-section">
              <img src="../../assets/img/monitor/noData.png">
              <p class="keyword-tip">抱歉！没有找到与<strong>“{{keyword || '关键词'}}”</strong>相关的邮件</p>
            </div>
          </div>
          <div class="noData-container" v-if="!listLoad && listNoRecord && !hasKeyword">
            <div class="center-section">
              <img src="../../assets/img/monitor/noData.png">
              <p>暂无数据</p>
            </div>
          </div>
          <div class="loading loading-circle" v-if="listLoad"></div>
          <el-pagination
            v-if="!listLoad && !listNoRecord && recommendPage.totalCount>10"
            class="list-pagination"
            @size-change="listSizeChange"
            @current-change="listPageChange"
            :current-page="recommendPage.page"
            :page-size="recommendPage.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            layout="prev, pager, next, sizes, jumper"
            :total="recommendPage.totalCount">
          </el-pagination>
        </div>
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
    <div class="noData-container" v-if="noBindAccount">
      <div class="center-section">
        <img src="../../assets/img/monitor/emailMarket_empty.png">
        <p>暂无数据，请先<span class="bindAccontStyle" @click="bindAccount"> 绑定邮箱</span></p>
      </div>
    </div>
  </div>
</template>

<script>
  import mailApi from '@/api/mailApi'
  export default {
    name: 'mailList',
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
        defaultPhoto: '/static/img/default_avatar.jpg', // 保存默认联系人头像
        companyPhoto: '/static/img/default_company.png', // 保存默认公司头像
        noBindAccount: false, // 保存是否绑定账号
        dialogAddPerson: false, // 保存添加联系人弹框的显示状态
        activeMenu: 0, // 保存当前选择账号的索引
        menuLoad: false, // 保存选项菜单是否正在加载
        initList: false, // 初始化列表加载状态
        listLoad: false, // 保存收件箱列表是否正在加载
        hasKeyword: false, // 保存收件箱列表是否搜索了关键字
        listNoRecord: false, // 保存收件箱列表是否为空
        searchText: '', // 保存搜索文本
        keyword: '', // 保存搜索文本副本（没有关键词时搜索）
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
        channelList: [], // 保存用户绑定的渠道列表
        mailList: [], // 保存收件箱列表
        recommendPage: {
          page: 1,
          pageSize: 10,
          totalCount: 10
        }, // 分页初始配置
        queryUserId: '', // 邮箱账号Id
        mainUserId: '', // 主账号Id
        isMainAccount: localStorage.getItem('isMainAccount')
      }
    },
    computed: {
      mailPage () {
        return this.$store.state.mail.mailPage
      }
    },
    mounted () {
      this.recommendPage = this.mailPage
      this.getChannelList()
    },
    watch: {
      recommendPage () {
        this.$store.commit('MAIL_MAILPAGE', {mailPage: this.recommendPage})
      }
    },
    methods: {
      addContactTip (event) {
        event.stopPropagation()
        this.$message({
          message: '请先添加该发件人至联系人！',
          type: 'warning'
        })
      },
      /*
      * 邮箱图标
      * */
      mailType (type) {
        switch (type) {
          case '谷歌邮箱' :
            return '/static/img/mail/gmail.png'
          case '网易企业邮箱' :
            return '/static/img/mail/wangyiMail.png'
          case '腾讯企业邮箱' :
            return '/static/img/mail/tencentMail.png'
          case '阿里企业邮箱' :
            return '/static/img/mail/aliMail.png'
        }
      },
      /*
      * 获取主账号下所有的邮箱
      * */
      getMainAccountList () {
        mailApi.getMainAccountList().then(res => {
          if (res.data.code === 0) {
            this.channelList = res.data.data.reverse()
            if (this.channelList.length > 0) {
              this.noBindAccount = false
              this.queryUserId = res.data.data[0].userId
              this.getMailList()
              this.$store.commit('MAIL_CHANNELLIST', {channelList: this.channelList})
            } else {
              this.noBindAccount = true
            }
          }
        })
      },
      /*
      * 切换收件箱账号
      * */
      chooseMenu (index, menu) {
        this.activeMenu = index
        this.keyword = ''
        this.queryUserId = menu.userId
        this.getMailList()
      },
      /*
      * 获取邮件收件箱
      * */
      getMailList () {
        let params = {
          page: this.recommendPage.page,
          size: this.recommendPage.pageSize,
          keyword: this.keyword,
          queryUserId: this.queryUserId
        }
        this.listLoad = true
        mailApi.getMailList(params).then(res => {
          if (res.data.code === 0) {
            this.listLoad = false
            this.mailList = res.data.data
            this.keyword ? this.hasKeyword = true : this.hasKeyword = false
            this.mailList.records.length > 0 ? this.listNoRecord = false : this.listNoRecord = true
            this.recommendPage.page = res.data.data.page
            this.recommendPage.totalCount = res.data.data.totalCount
          } else {
            this.listLoad = false
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      },
      /*
      * 搜索功能
      * */
      searchMail () {
        this.keyword = this.searchText
        this.getMailList()
      },
      /*
       * 回复邮件
       * */
      replyMail (event, item) {
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
                _this.$message.success('新增联系人成功')
                this.dialogAddPerson = false
                this.getMailList()
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
      showAddDialog (event, item) {
        event.stopPropagation()
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
      },
      /*
       * 跳转联系人详情页
       * */
      linkToMailDetail (item) {
        if (!item.seen) {
          let params = {
            receiveId: item.id
          }
          mailApi.readMail(params).then(res => {
            if (res.data.code === 0) {
              this.$router.push({path: '/mailDetail', query: {id: item.id}})
            }
          })
        } else {
          this.$router.push({path: '/mailDetail', query: {id: item.id}})
        }
      },
      /*
       * 跳转设置页
       * */
      bindAccount () {
        this.$router.push({path: '/channelList'})
      },
      /**
       * 分页数目改变
       * @param size
       */
      listSizeChange (size) {
        this.recommendPage.pageSize = size
        this.recommendPage.page = 1
        this.getMailList()
      },
      /**
       * 当前页改变
       * @param page
       */
      listPageChange (page) {
        this.recommendPage.page = page
        this.getMailList()
      },
      /*
       * 获取渠道绑定列表
       * */
      getChannelList () {
        this.menuLoad = true
        mailApi.getChannelList().then(res => {
          if (res.data.code === 0) {
            this.menuLoad = false
            this.channelList = res.data.data
            this.channelList.forEach((list, index) => {
              if (list.channelId === 'MAIL' && list.bindingTag === 1) {
                this.noBindAccount = false
                this.initList = true
                if (localStorage.getItem('isMainAccount') === 'true') {
                  this.getMainAccountList()
                } else {
                  this.queryUserId = list.userId
                  this.getMailList()
                  this.$store.commit('MAIL_CHANNELLIST', {channelList: this.channelList})
                }
              } else if (list.channelId === 'MAIL' && list.bindingTag === 0) {
                this.initList = true
                if (localStorage.getItem('isMainAccount') === 'true') {
                  this.getMainAccountList()
                } else {
                  this.noBindAccount = true
                }
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/variable';
  @import '../../assets/style/base.less';
  @import '../../assets/style/page';
  .mailList-container{
    width: 1200px;
    margin: 0 auto 30px;
    .loadAnimation(){
      background: #F5F8FA;
      .animation(loadingColor, 1s, infinite);
    }
    h1.mail-title{
      margin-top: 17px;
      margin-bottom: 22px;
      padding-left: 3px;
      font-size: 20px;
      color: @textColor;
    }
    .iconFont-facebook{
      color: @facebookColor;
    }
    .iconFont-twitter{
      color: @twitterColor;
    }
    ::-webkit-input-placeholder {
      font-size: 13px;
      font-weight: 300;
    }
    :-moz-placeholder {
      font-size: 13px;
      font-weight: 300;
    }
    ::-moz-placeholder {
      font-size: 13px;
      font-weight: 300;
    }
    :-ms-input-placeholder {
      font-size: 13px;
      font-weight: 300;
    }
    .mailList-section{
      overflow: hidden;
      .leftMail-menu{
        float: left;
        width: 220px;
        li{
          overflow: hidden;
          width: 220px;
          height: 56px;
          padding: 8px 10px 8px 7px;
          margin-bottom: 10px;
          border-left: 3px solid transparent;
          cursor: pointer;
          box-sizing: border-box;
          &.active{
            border-left: 3px solid @activeBlue;
            background: #fff;
            box-shadow: 0 0 8px rgba(0,0,0,.08);
          }
          img{
            float: left;
            width: 40px;
            height: 40px;
            margin-right: 8px;
            border-radius: 50%;
          }
          p{
            &.userName{
              line-height: 18px;
              margin-bottom: 4px;
              font-size: 13px;
              font-weight: bolder;
              color: @textColor;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            &.userChannel{
              i{
                margin-right: 2px;
                font-size: 10px;
                border-radius: 2px;
              }
              span{
                line-height: 18px;
                font-size: 13px;
                color: @detailTextColor;
              }
            }
          }
        }
      }
      .loading-menu{
        .buffer{
          .base-photo{
            float: left;
            width: 40px;
            height: 40px;
            margin-right: 8px;
            border-radius: 50%;
            background: @loadingColor;
            .loadAnimation()
          }
          p{
            &.userName{
              height: 18px;
              background: @loadingColor;
              .loadAnimation()
            }
            &.userChannel{
              overflow: hidden;
              width: 100px;
              height: 18px;
              background: @loadingColor;
              .loadAnimation()
            }
          }
        }
      }
      .right-panel{
        float: left;
        width: 960px;
        margin-left: 20px;
        border-radius: 4px;
        background: @white;
        box-shadow: 0 0 8px rgba(0,0,0,.08);
        .head-part{
          height: 59px;
          padding: 12px 19px 13px;
          box-sizing: border-box;
          .el-input{
            float: right;
            width: 240px;
            .el-input__inner{
              height: 34px;
              line-height: 34px;
            }
            &.mail-input{
              width: 270px;
            }
            .el-input-group__append{
              width: 12px;
              .el-button{
                padding: 10px 9px;
                &:hover,&:focus{
                  border-color: transparent;
                }
              }
            }
          }
        }
        .list-section{
          overflow: hidden;
          padding-bottom: 30px;
          min-height: calc(~'100vh - 228px');
          .list-header li,.list-body li {
            padding-left: 20px;
            font-size: 13px;
            color: @textColor;
            box-sizing: border-box;
            &.sender {
              width: 27%;
              p{
                line-height: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &.personName{
                  margin-bottom: 4px;
                  font-weight: bolder;
                  &.hasCompany{
                    margin-bottom: 0;
                    line-height: 40px;
                  }
                }
                &.company{
                  color: @detailTextColor;
                }
                &.single{
                  line-height: 40px;
                  font-weight: bolder;
                }
              }
            }
            &.mailTitle {
              width: 40%;
              font-weight: bolder;
              &.read{
                color: @detailTextColor;
                font-weight: normal;
              }
              span{
                display: inline-block;
                max-width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                vertical-align: top;
              }
              .seen{
                margin-right: 3px;
                font-size: 13px;
                color: @detailTextColor;
              }
              .not-seen{
                margin-right: 5px;
                font-size: 13px;
                font-weight: normal;
                color: @activeBlue;
              }
              .attach{
                color: #FFA726;
              }
            }
            &.createTime {
              width: 16%;
            }
            &.operate {
              visibility: hidden;
              width: 17%;
              el-button{
                cursor: default;
              }
              el-button.activeStyle{
                cursor: pointer;
              }
            }
          }
          .list-header{
            height: 44px;
            line-height: 42px;
            border-top: 1px solid #DFE3EB;
            border-bottom: 1px solid #DFE3EB;
            background: #F5F8FA;
            box-sizing: border-box;
            li{
              float: left;
              font-weight: bolder;
            }
          }
          .list-body {
            height: 40px;
            padding: 16px 0;
            border-bottom: 1px solid @textBorderColor;
            cursor: pointer;
            &:hover, &.clicked {
              background: #F5F8FA;
              .operate {
                visibility: visible;
              }
            }
            li{
              float: left;
              line-height: 40px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              img{
                float: left;
                width: 40px;
                height: 40px;
                margin-right: 8px;
                border-radius: 50%;
                vertical-align: middle;
              }
            }
          }
          .noData-container{
            padding: 100px 0;
          }
          .loading{
            margin: 200px auto;
          }
          .el-pagination{
            margin: 16px 20px 0;
          }
        }
      }
    }
    .noData-container {
      padding-top: 200px;
      .center-section {
        display: inline-block;
        width: 250px;
        margin-left: 50%;
        transform: translateX(-50%);
        text-align: center;
        font-size: 14px;
        .bindAccontStyle{
          display: inline;
          color:#5488F9;
          text-decoration: underline;
          cursor: pointer;
        }
        img{
          width: 100px;
          height: 102px;
        }
        p {
          margin-top: 20px;
          margin-bottom: 30px;
          font-size: 14px;
          color: @textColor;
          &.keyword-tip{
            font-size: 14px;
          }
        }
        .el-button {
          width: 140px;
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
        }
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
