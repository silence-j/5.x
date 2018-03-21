<template>
  <div class="inquiry-monitor">
    <div class="enquiries-login">
      <p class="left_menu">
        <span class="curr">官网登录</span>
        <em>|</em>
        <router-link  :to="{ path: '/homeMonitor', query: {t: '2'}}">
          <span style="color: #7C98B6;">官网询盘</span>
        </router-link>
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
          <el-select class="choose-time" v-model="fromId" placeholder="登录来源" @change="changeFilter" size="small">
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
        <div class="inquiry-list">
          <ul class="list-header">
            <li class="contact">姓名</li>
            <li class="email">联系方式</li>
            <div class="hide-container">
              <li class="origin">登录来源</li>
              <li class="time">监控时间</li>
              <li class="person">所属人</li>
              <li class="opreat">操作</li>
            </div>
          </ul>
          <ul v-for="(item,index) in longinList" :key="index" class="list-body" :class="curClickIndex == index?'clicked':''" v-if="!isNoData && !isListLoading">
            <li class="contact">
              <img :src="item.buyerAvatar || defaultAvatar"
              :class="item | orCurser"
              @click="detailContact(item)"
              :onerror="`javascript:this.src=${defaultAvatar}`">
              <p class="personName"
              :class="item | orCurser"
              @click="detailContact(item)"
              :title="item.buyerName">{{item.buyerName || '-'}}</p>
              <p class="company"
              v-if="item.contactCompanyName || item.buyerCompanyName"
              :class="{'dis-cli': !item.companyBelongToCurrentUser}"
              @click="detailCompany(item)"
              :title="item.contactCompanyName">{{item.contactCompanyName || item.buyerCompanyName || ''}}</p>
            </li>
            <li class="email" :title="item.buyerConnectWay">
              <span v-if="item.buyerChannel === 1">
                <i class="icon-font fb icon-facebook"></i>&nbsp;{{item.buyerName}}
              </span>
              <span v-else-if="item.buyerChannel === 2">
                <!-- <i class="icon-font gl">&#xe6ef;</i>&nbsp; -->
                {{item.buyerConnectWay}}
              </span>
              <span v-else>{{item.buyerConnectWay || '-'}}</span>
            </li>
            <div class="hide-container">
              <li class="origin">{{item.buyerChannel | loginFrom }}</li>
              <li class="time">{{item.createTime | time-formater-has-hour}}</li>
              <li class="person">{{item.sellerName || '-'}}</li>
              <li class="opreat">
                <el-button v-if="item.isAddedStatusBySubUser == 0" :disabled="true" size="small">团队联系人</el-button>
                <el-button v-else-if="!item.contactId" :disabled="disableBtn[index]" @click="addContact(item, index)" class="btn-trans" size="small">&nbsp;<span class="icon-font tianjia1">&#xe6ad;</span>&nbsp;联系人&nbsp;&nbsp;</el-button>
                <el-button v-else @click="detailContact(item)"  class="btn-trans" size="small">查看联系人</el-button>
              </li>
            </div>
          </ul>
          <div class="page-container" v-if="!isNoData && !isListLoading && (recommendPage.totalCount>recommendPage.pageSize || recommendPage.pageSize != 10)">
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
        fromId: '0,1,2',
        fromList: [
          {
            label: '登录来源',
            value: '0,1,2'
          },
          {
            label: '官方注册',
            value: '0'
          },
          {
            label: '第三方登录',
            value: '1,2'
          }
        ],
        longinList: [],
        item: {},
        params: {},
        contactId: '',
        longinListWidth: '640px',  // 列表宽度
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
    computed: {
      timerMonitor () {
        return this.$store.state.monitor.timerMonitor
      },
      mindex () {
        return this.$store.state.monitor.mindex
      }
    },
    filters: {
      loginFrom (val) {
        if (val === 0) {
          return '官网注册'
        } else {
          return '第三方登录'
        }
      },
      orCurser (item) {
        let noCursor = item.isAddedStatusBySubUser === 0 || !item.contactId || false
        let line = (!item.contactCompanyName && !item.buyerCompanyName) || false
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
    watch: {
      timerMonitor () {
        if (this.mindex === 2) {
          this.recommendPage = {
            page: 1,
            pageSize: 10,
            totalCount: 0
          }
          this.getLoginList()
        }
      }
    },
    beforeMount () {
      // query.day 0 是 7天 1是 30天 id 对应账号id
      let query = this.$route.query
      if (query.id && query.id !== 0 && query.id !== '0') {
        this.accountId = query.id
      }
      if (query.days) {
        this.timeValue = query.days + ''
      }
    },
    mounted () {
      this.serverLevel = window.localStorage.serverLevel
      this.getLoginList()
    },
    methods: {
      hiddenTips () {
        this.addTipsShow = false
        this.getLoginList()
      },
      btnDisable (i, type) {
        let arr = this.disableBtn.slice(0)
        arr[i] = type
        this.disableBtn = arr
      },
      addContact (item, i) {
        this.btnDisable(i, true)
        let params = {
          platform: 0,
          purchaserId: item.id,
          buyerId: item.buyerId,
          buyerName: item.buyerName,
          buyerAvatar: item.buyerAvatar || '',
          buyerMail: item.buyerMail || '',
          buyerChannel: item.buyerChannel,
          buyerProvideId: item.buyerProvideId,
          createSource: 'inquiry_create'
        }
        MonitorAPI.addLoginPerson(params).then(res => {
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
              // item.contactId = res.data.data.id
              // this.$set(this.longinList, i, item)
              this.getLoginList()
            }
          } else {
            this.$message.error(res.data.message)
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
      /*
       * 下拉框选择改变
       * */
      changeFilter () {
        this.recommendPage.page = 1
        this.getLoginList()
      },
      /**
       * login列表
       * @return {[type]} [description]
       */
      getLoginList () {
        this.isListLoading = true
        this.disableBtn = []
        this.params = {
          platform: 0,
          recentDays: this.timeValue,
          buyerChannels: this.fromId,
          searchBySellerId: Boolean(this.accountId),
          sellerId: this.accountId,
          page: this.recommendPage.page,
          size: this.recommendPage.pageSize
        }
        MonitorAPI.getLoginList(this.params).then(res => {
          if (res.data.code === 0) {
            this.isListLoading = false
            this.longinList = res.data.data.records
            if (this.longinList.length > 0) {
              this.isNoData = false
            } else {
              this.isNoData = true
            }
            // console.log(this.longinList)
            this.recommendPage.page = res.data.data.page
            this.recommendPage.totalCount = res.data.data.totalCount
          }
        })
      },
      /*
       * currentPage 改变触发
       * */
      recommendCurrentChange (page) {
        this.recommendPage.page = page
        this.getLoginList()
      },
      sizeChange (pageSize) {
        this.recommendPage.page = 1
        this.recommendPage.pageSize = pageSize
        this.getLoginList()
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .enquiries-login{
    padding:10px 20px;
    background: #fff;
    border-radius: 4px 4px 0 0;
    font-size: 0px;
    color: #7C98B6;
    line-height: 18px;
    overflow:hidden;
    .select-section{
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
