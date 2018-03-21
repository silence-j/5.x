<template>
  <div class="inquiry-monitor">
    <div class="enquiries-home">
      <p class="left_menu">
        <router-link  :to="{ path: '/homeMonitor'}">
          <span style="color: #7C98B6;">官网登录</span>
        </router-link>
        <em>|</em>
        <span class="curr">官网询盘</span>
      </p>
      <div class="select-section">
        <div class="select-container">
          <el-select class="choose-time" v-model="accountId" placeholder="选择账号" @change="changeFilter" size="small">
            <el-option
            class="time-option"
            v-for="(option,index) in accountList"
            :label="option.name || option.loginAccount"
            :key="index"
            :value="option.id">
            </el-option>
          </el-select>
        </div>
        <div class="select-container">
          <el-select class="choose-time" v-model="fromId" placeholder="选择来源" @change="changeFilter" size="small">
            <el-option
            class="time-option"
            v-for="(option,index) in fromList"
            :label="option.label"
            :key="index"
            :value="option.value">
            </el-option>
          </el-select>
        </div>
        <div class="select-container">
          <el-select class="choose-time" v-model="timeValue" placeholder="全部时间" @change="changeFilter" size="small">
            <el-option
            class="time-option"
            v-for="(option,index) in timeItems"
            :label="option.label"
            :key="index"
            :value="option.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="list-container" :class="isNoData?'list-no-data':''">
      <div class="inquiry-panel" ref="panelHeight">
        <div class="inquiry-list" >
          <ul class="list-header">
            <li class="contact">姓名</li>
            <li class="email">联系方式</li>
            <div class="hide-container" >
              <li class="origin">询盘来源</li>
              <li class="time">监控时间</li>
              <li class="person">所属人</li>
              <li class="opreat">操作</li>
            </div>
          </ul>
          <ul v-for="(item,index) in inquiryList" :key="index" class="list-body" :class="curClickIndex == index?'clicked':''" v-if="!isNoData && !isListLoading">
            <li class="contact">
              <img :src="item.contactAvatar || defaultAvatar"
              :class="item | orCurser"
              @click="detailContact(item)"
              :onerror="`javascript:this.src=${defaultAvatar}`">
              <p class="personName"
              @click="detailContact(item)"
              :class="item | orCurser"
              :title="item.personName">{{item.personName}}</p>
              <p class="company"
              v-if="item.contactCompanyName || item.company"
              :class="{'dis-cli': !item.companyBelongToCurrentUser}"
              @click="detailCompany(item)"
              :title="item.contactCompanyName">{{item.contactCompanyName || item.company}}</p>
            </li>
            <li class="email" :title="item.email">{{item.email || '-'}}</li>
            <div class="hide-container">
              <li class="origin" >{{item.sourceType | sourceFrom}}</li>
              <li class="time">{{item.createTime | time-formater-has-hour}}</li>
              <li class="person">{{item.belongToUserName || '-'}}</li>
              <li class="opreat">
                <el-button v-if="item.isAddedStatusBySubUser == 0" :disabled="true" size="small">团队联系人</el-button>
                <div v-else>
                  <el-button v-if="!item.contactId" :disabled="disableBtn[index]" @click="addContact(item, index)" class="btn-trans" size="small">&nbsp;<span class="icon-font tianjia1">&#xe6ad;</span>&nbsp;联系人&nbsp;&nbsp;</el-button>
                  <el-button v-else @click="detailContact(item)" class="btn-trans" size="small">查看联系人</el-button>
                  <el-button class="show-btn" style="color: #5488F9; border-color: #5488F9;" @click="showDetail(item,index)" size="small">查看询盘</el-button>
                </div>
              </li>
            </div>
          </ul>
          <div class="page-container" v-if="!isNoData && !isListLoading&&(recommendPage.totalCount>recommendPage.pageSize || recommendPage.pageSize != 10)">
            <el-pagination
              layout="prev, pager, next, sizes, jumper"
              @current-change="recommendCurrentChange"
              @size-change="sizeChange"
              :page-sizes="[10, 20, 30, 40]"
              :current-page="recommendPage.page"
              :page-size="recommendPage.pageSize"
              :total="recommendPage.totalCount">
            </el-pagination>
          </div>
          <div class="load-container" v-if="isListLoading">
            <div class="loading loading-circle"></div>
          </div>
          <div class="no-data" v-if="isNoData && !isListLoading">
            <div class="center-section">
              <img src="../../../assets/img/monitor/noData.png">
              <div class="publish-over">
                <p>暂无数据</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="clearBoth"></div>
    <el-dialog class="inquiry-dialog" v-model="isShowDetail" @close="closeDetail">
      <span slot="title" class="dialog-header head-title">
        <span>询盘详情</span>
      </span>
      <div class="dialog-body">
        <div class="detail-section">
          <div class="detail-content" v-if="!isDataBuffer">
            <div class="detail-operate">
              <span class="operate-source">
                询盘来源：<span class="source-span text-bold">{{item.sourceType | sourceFrom}}</span>
              </span>
              <span class="operate-time">
                {{item.createTime | time-formater-has-hour}}
              </span>
              <span v-if="serverLevel==='1' && item.contactId" class="operate-reply" @click="linkMailReply">
                <i class="icon-font">&#xe62f;</i><strong>回复</strong>
              </span>
              <el-button v-else :disabled="disableBtn[itemIndex]" @click="addContact(item, itemIndex, 'detail')" class="btn-trans" style="float: right">&nbsp;<i class="icon-font tianjia1">&#xe6ad;</i>&nbsp;&nbsp;联系人&nbsp;&nbsp;</el-button>
            </div>
            <div class="detail-operate">
              <span class="operate-source" >
                询盘页面：<span class="source-span text-bold" :title="item.pageUrl">{{item.source || '-'}}</span>
              </span>
            </div>
            <div class="inquiry-content">
              <div v-if="item.details.length>0" class="product-info">
                <img :src="item.details[0].productPicWhole" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
                <div class="right-info">
                  <p>{{item.details[0].productName}}</p>
                  <p>{{item.details[0].productPrice}}</p>
                </div>
              </div>
              <div class="message first-child">
                <span class="title">First Name</span>
                <span class="content">{{item.firstName || '-'}}</span>
              </div>
              <div class="message">
                <span class="title">Last Name</span>
                <span class="content">{{item.lastName || '-'}}</span>
              </div>
              <div class="message">
                <span class="title">Company</span>
                <span class="content">{{item.company || '-'}}</span>
              </div>
              <div class="message">
                <span class="title">Email</span>
                <span class="content">{{item.email || '-'}}</span>
              </div>
              <div class="message">
                <span class="title">phone</span>
                <span class="content">{{item.phone || '-'}}</span>
              </div>
              <div class="message">
                <span class="title">Comment</span>
                <span class="content" style="max-height:300px;" :title="item.content">{{item.content || '-'}}</span>
              </div>
            </div>
          </div>
          <div class="detail-content buffer" v-else>
            <div class="detail-operate"></div>
            <div class="inquiry-content">
              <div class="product-info">
                <span></span>
                <div class="right-info">
                  <p></p>
                </div>
              </div>
              <div class="message first-child"></div>
              <div class="message"></div>
              <div class="message"></div>
              <div class="message"></div>
              <div class="message"></div>
              <div class="message"></div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="addTipsShow" class="add-tips" size="tiny">
      <div class="delete-tip">
        <span class="icon-font">&#xe629;</span>
        <span class="tip-content">{{addTips.title}}</span>
        <p class="tip-text">{{addTips.content}}</p>
        <div class="btn-wrapper">
          <el-button type="primary" @click="hiddenTips">知道了</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import MonitorAPI from '@/api/monitorAPI'
  import contactInfoApi from '@/api/contactInfoApi'
  import defaultAvatar from '@/assets/img/default_avatar.png'

  export default{
    data () {
      return {
        defaultAvatar: defaultAvatar,
        personId: '',
        serverLevel: '1',
        timeValue: '',
        timeItems: [
          {
            value: '',
            label: '全部时间'
          }, {
            value: '7',
            label: '最近7天'
          }, {
            value: '15',
            label: '最近15天'
          }, {
            value: '30',
            label: '最近30天'
          }
        ],
        accountId: '',
        fromId: '',
        fromList: [
          {
            label: '询盘来源',
            value: ''
          },
          {
            label: '官网询盘',
            value: '0'
          },
          {
            label: '官网询盘--来自邮件',
            value: '1'
          },
          {
            label: '官网询盘--来自活动',
            value: '2'
          }
        ],
        inquiryList: [],
        item: {},
        itemIndex: null,
        params: {},
        contactId: '',
        inquiryListWidth: '640px',  // 列表宽度
        isShowDetail: false,  // 是否展示详情
        visible: false,
        firstClick: true,
        isDataBuffer: true, // 详情是否缓冲
        isListLoading: false, // 列表是否正在加载
        isNoData: false, // 当前列表是否有数据
        curClickIndex: -1, // 当前展示详情的索引
        recommendPage: {
          page: 1,
          pageSize: 10,
          totalCount: 0
        }, // 分页初始配置
        addTipsShow: false,
        addTips: {
          title: '',
          content: ''
        },
        disableBtn: []
      }
    },
    props: {
      showAccout: Boolean,
      accountList: Array
    },
    filters: {
      sourceFrom (val) {
        let fom = ''
        switch (val) {
          case 0:
            fom = '官网询盘'
            break
          case 1:
            fom = '官网询盘-来自邮件'
            break
          case 2:
            fom = '官网询盘-来自活动'
            break
          default:
            fom = '-'
        }
        return fom
      },
      orCurser (item) {
        let noCursor = item.isAddedStatusBySubUser === 0 || !item.contactId || false
        let line = (!item.contactCompanyName && !item.company) || false
        if (noCursor && line) {
          return 'c-text line-name'
        } else if (noCursor) {
          return 'c-text'
        } else if (line) {
          return 'line-name'
        } else {
          return ''
        }
      }
    },
    computed: {
      timerMonitor () {
        return this.$store.state.monitor.timerMonitor
      },
      mindex () {
        return this.$store.state.monitor.mindex
      }
    },
    watch: {
      timerMonitor () {
        if (this.mindex === 2) {
          this.recommendPage = {
            page: 1,
            pageSize: 10,
            totalCount: 0
          }
          this.getInquiryList()
        }
      }
    },
    beforeMount () {
      // query.day 0 是 7天 1是 30天 id 对应账号id
      let query = this.$route.query
      if (query.id && query.id !== 0 && query.id !== '0') {
        this.accountId = query.id + ''
      }
      if (query.days) {
        this.timeValue = query.days + ''
      }
    },
    mounted () {
      this.serverLevel = window.localStorage.serverLevel
      this.getInquiryList()
    },
    methods: {
      hiddenTips () {
        this.addTipsShow = false
        this.getInquiryList()
      },
      btnDisable (i, type) {
        let arr = this.disableBtn.slice(0)
        arr[i] = type
        this.disableBtn = arr
      },
      addContact (item, i, isDetail) {
        this.btnDisable(i, true)
        let params = {
          firstName: item.firstName || item.personName || '',
          lastName: item.lastName || '',
          position: '',
          email: item.email,
          mails: '',
          createSource: 'inquiry_create',
          purchaserId: item.id
        }
        params.mails = JSON.stringify([{'type': 0, 'mail': item.email}])
        contactInfoApi.addPerson(params).then(res => {
          this.btnDisable(i, false)
          if (!res.data.code) {
            if (res.data.subMessage) {
              this.addTipsShow = true
              this.addTips = {
                title: res.data.message,
                content: res.data.subMessage
              }
            } else {
              this.$message.success('新增联系人成功')
              this.getInquiryList()
              // item.contactId = res.data.data.id
              // this.$set(this.inquiryList, i, item)
            }
            if (isDetail === 'detail') {
              this.item.contactId = res.data.data.id
              this.contactId = res.data.data.id
            }
          } else {
            this.$message.error(res.data.message)
            if (isDetail === 'detail') {
              this.showDetail(item, i)
              this.isShowDetail = false
            }
            this.getLoginList()
          }
        })
      },
      detailContact (item) {
        if (item.isAddedStatusBySubUser === 0 || !item.contactId) return
        window.open('/#/contactDetail?contactId=' + item.contactId + '&contactType=0')
      },
      detailCompany (item) {
        if (!item.companyBelongToCurrentUser || !item.contactCompanyId) return
        window.open('/#/contactDetail?contactId=' + item.contactCompanyId + '&contactType=1')
      },
      chooseAccount () {
        // console.log(this.accountId)
      },
      chooseFrom () {
        // console.log(this.fromId)
      },
      /*
       * 控制 select 被选中的状态
       * */
      visibleChange () {
        if (this.firstClick) {
          this.firstClick = false
          this.visible = true
        } else {
          this.firstClick = true
          this.visible = false
        }
      },
      /*
       * 下拉框选择改变
       * */
      changeFilter () {
        this.recommendPage.page = 1
        this.getInquiryList()
      },
      /**
       * 计算得到开始时间和结束时间
       * @type {Number}
       */
      // getSpecificTime (recentlyTime) {
      //   let newDate = new Date()
      //   let sDate = new Date()
      //   let endTime = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()
      //   let startMillionTime = newDate.getTime() - ((recentlyTime - 1) * 24 * 60 * 60 * 1000)
      //   sDate.setTime(startMillionTime)
      //   let startTime = sDate.getFullYear() + '-' + (sDate.getMonth() + 1) + '-' + sDate.getDate()
      //   this.params.endTime = endTime
      //   this.params.startTime = startTime
      //   this.params.page = 1
      // },
      /**
       * 询盘监控列表
       * @return {[type]} [description]
       */
      getInquiryList () {
        this.isListLoading = true
        this.params = {
          belongTo: this.accountId,
          recentDays: this.timeValue,
          sourceType: this.fromId,
          page: this.recommendPage.page,
          size: this.recommendPage.pageSize
        }
        MonitorAPI.getInquiryList(this.params).then(res => {
          if (res.data.code === 0) {
            this.isListLoading = false
            this.inquiryList = res.data.data.records
            if (this.inquiryList.length > 0) {
              this.isNoData = false
            } else {
              this.isNoData = true
            }
            // console.log(this.inquiryList)
            this.recommendPage.page = res.data.data.page
            this.recommendPage.totalCount = res.data.data.totalCount
          }
        })
      },
      /**
       * 询盘监控详情
       * @return {[type]} [description]
       */
      showDetail (item, index) {
        this.curClickIndex = index
        this.isShowDetail = true
        this.isDataBuffer = true
        this.contactId = item.contactId
        let param = {
          id: item.id
        }
        MonitorAPI.getInquiryDetail(param).then(res => {
          if (res.data.code === 0) {
            this.isDataBuffer = false
            this.item = res.data.data
            this.itemIndex = index
          }
        })
      },
      closeDetail () {
        this.curClickIndex = -1
        this.isShowDetail = false
      },
      /**
       * 询盘回复
       * @return {[type]} [description]
       */
      /**
       * 邮件回复
       * @return {[type]} [description]
       */
      linkMailReply (event, item) {
        event.stopPropagation()
        let params = {
          contactId: '',
          contactType: 0,
          messageType: 'mail'
        }
        if (item) {
          params.contactId = item.contactId
        } else {
          params.contactId = this.contactId
        }
        if (params.contactId) {
          this.$router.push({path: '/contactDetail', query: params})
        } else {
          this.$message({
            message: '该用户未添加到联系人',
            type: 'error'
          })
        }
      },
      /*
      * 阻止 回复按钮 点击出现详情
      * */
      stopPropagation (event) {
        event.stopPropagation()
      },
      /*
       * currentPage 改变触发
       * */
      recommendCurrentChange (page) {
        this.recommendPage.page = page
        this.getInquiryList()
      },
      sizeChange (pageSize) {
        this.recommendPage.page = 1
        this.recommendPage.pageSize = pageSize
        this.getInquiryList()
      }
    }
  }
</script>
<style lang="less">
  @import '../../../assets/style/variable';
  @import '../../../assets/style/page';
  .enquiries-home{
    .show-btn{
      color: #5488F9;
      border-color: #5488F9;
    }
  }
  .inquiry-monitor{
    .inquiry-dialog{
      .el-dialog{
        width: 552px;
        border-radius: 4px;
        box-shadow: 0 0 6px rgba(0,0,0,.06);
        .el-dialog__header{
          height: 40px;
          line-height: 40px;
          padding: 13px 16px;
          font-size: 14px;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          border-bottom: 1px solid #EAF0F6;
        }
        .el-dialog__body{
          padding: 10px 20px;
        }
      }
    }
    .head-title{
      height: 59px;
      padding: 0 20px;
      font-size: 18px;
      span{
        color: @textColor;
      }
      i{
        float: right;
        font-size: 16px;
        color: @detailTextColor;
        cursor: pointer;
      }
    }
    .detail-content{
      padding: 0 20px 16px 20px;
      .detail-operate{
        height: 36px;
        line-height: 36px;
        width: 100%;
        font-size: 13px;
        color: @detailTextColor;
        .el-button{
          position: relative;
          top: 0;
          right: -18px;
        }
        span{
          margin-right: 12px;
          span{
            color: @textColor;
            &.source-span{
              display: inline-block;
              max-width: 140px;
              overflow: hidden;
              margin-right: 0;
              text-overflow: ellipsis;
              white-space: nowrap;
              vertical-align: top;
            }
          }
          &.operate-reply{
            color: @textColor;
            float: right;
            cursor: pointer;
            i{
              margin-right: 5px;
              color: @detailTextColor;
            }
            &.disabled{
              color: @disabledColor;
              cursor: not-allowed;
            }
          }
        }
      }
      .inquiry-content{
        font-size: 13px;
        color: @textColor;
        margin-top: 10px;
        .product-info{
          padding-bottom: 16px;
          border-bottom: 1px dotted #DFE3EB;
          img{
            display: inline-block;
            width: 64px;
            height: 64px;
          }
          .right-info{
            display: inline-block;
            vertical-align: top;
            width: 387px;
            p{
              width: 387px;
              line-height: 18px;
              margin-left: 10px;
              word-break: break-all;
              &:last-child{
                margin-top: 5px;
              }
            }
          }
        }
        .message{
          padding: 12px 0 8px;
          line-height: 21px;
          border-top: 1px dotted #DFE3EB;
          ::-webkit-scrollbar{
            width: 6px;
            background-color: #FFF;
          }
          ::-webkit-scrollbar-thumb{
            border-radius: 4px;
            background-color: @inputBorderColor;
          }
          &.first-child{
            margin-top: 12px;
            border-top: none;
          }
          span{
            display: inline-block;
            &.title{
              width: 78px;
              margin-right: 42px;
              vertical-align: top;
              color: @detailTextColor;
            }
            &.content{
              width: 337px;
              max-height: 105px;
              line-height: 21px;
              overflow-y: auto;
              word-break: break-all;
            }
          }
        }
      }
    }
    .detail-content.buffer{
      .detail-operate{
        float: left;
        height: 30px;
        margin-bottom: 10px;
        background: @loadingColor;
      }
      .inquiry-content{
        .product-info{
          padding-bottom: 16px;
          border: none;
          span{
            display: inline-block;
            width: 64px;
            height: 64px;
            background: @loadingColor;
          }
          .right-info{
            display: inline-block;
            p{
              margin-top: 0;
              height: 64px;
              background: @loadingColor;
            }
          }
        }
        .message{
          height: 22px;
          padding: 0;
          margin-top: 12px;
          margin-bottom: 24px;
          border: none;
          background: @loadingColor;
          &.first-child{
            margin-top: 12px;
          }
        }
      }
    }
  }
</style>

<style lang="less" rel="stylesheet/less" scoped>
  .enquiries-home{
    padding:10px 20px;
    background: #fff;
    border-radius: 4px 4px 0 0;
    font-size: 0px;
    color: #7C98B6;
    line-height: 18px;
    overflow:hidden;
    .select-section{
      display: inline-block;
      width: 680px;
      padding: 0;
      height: 40px;
      float: right;
      text-align: right;
      .select-container{
        display: inline-block;
        margin-left: 10px;
      }
      .el-input--small .el-input__inner{
        height: 36px;
      }
    }
    .left_menu{
      display: inline-block;
      line-height: 34px;
      vertical-align: top;
      span{
        font-size: 13px;
        cursor: pointer;
        line-height: 30px;
      }
      .curr{
        color: #33475B;
        font-weight: 600;
      }
      em{
        font-size: 13px;
        padding:0 16px;
      }
    }
  }
</style>
