<template>
  <div class="extension-container email-market">
    <emailLiftMenu @spreadSure="spreadFunc" @statusChange="statusChangeFunc"></emailLiftMenu>
    <div class="right-content-model margin-left16" :class="{spread: !expansion}">
      <!--顶部信息展示start-->
      <div class="top-info-display">
        <div class="searchType">
          <div class="operate-container" id="email_marketing">
            <el-select class="choose-aco" v-show="isShowAccount" :class="visibleChangeAco?'activeStyle':''" v-model="accountId" placeholder="全部账号" @visible-change="visibleChange('state')" @change="getMarketListFunc('1', 'accout')">
              <el-option
                class="aco-option"
                v-for="(option,index) in accountList"
                :label="option.name"
                :key="index"
                :value="option.id">
              </el-option>
            </el-select>
            <el-input
              class="email-search"
              placeholder="请输入推广标题"
              icon="search"
              v-model.trim="searchText"
              @keyup.enter.native="search"
              :on-icon-click="search">
            </el-input>
            <div style="width:110px;display:inline-block" v-if="showAddBtn">
              <el-button type="primary" class="btn" @click="addEmailMarketFunc" v-if="max!=0" :disabled="allSendedCount>max?true:false">新增邮件推广</el-button>
              <el-button type="primary" class="btn" v-else :disabled="allSendedCount>max?true:false">新增邮件推广</el-button>
            </div>
          </div>
        </div>
        <div class="info-display sent-rate">
          <div class="image-display"><i class="icon-sendall"></i></div>
          <div class="desc-load" v-if="marketStatisticload">
            <p class="data"></p>
            <p class="data-desc"></p>
          </div>
          <div class="desc" v-else>
            <p class="data" style="margin-bottom: 20px;">{{ total | dataIsNull}}</p>
            <p class="data-desc send-count"><span style="color:#7C98B6">发送量 
              </span><span>{{ allSendedCount | dataIsNull}}</span>/<span>{{ max | dataIsNull }}</span>
              <el-tooltip effect="dark" content="已发送总量 / 可发送总量"  placement="top">
                <i class="icon-font" style="cursor:pointer">&#xe6e0;</i>
              </el-tooltip>
            </p>
          </div>
        </div>
        <div class="info-display delivery-rate">
          <div class="image-display"><i class="icon-sendrate"></i></div>
          <div class="desc-load" v-if="marketStatisticload">
            <p class="data"></p>
            <p class="data-desc"></p>
          </div>
          <div class="desc" v-else>
            <p class="data">{{ arrivePer }}%</p>
            <p class="data-desc">送达率</p>
          </div>
        </div>
        <div class="info-display read-rate">
          <div class="image-display"><i class="icon-rendrate"></i></div>
          <div class="desc-load" v-if="marketStatisticload">
            <p class="data"></p>
            <p class="data-desc"></p>
          </div>
          <div class="desc" v-else>
            <p class="data">{{ readPer }}%</p>
            <p class="data-desc">阅读率</p>
          </div>
        </div>
        <div class="click-rate-display click-rate">
          <div class="image-display"><i class="icon-clickrate"></i></div>
          <div class="desc-load" v-if="marketStatisticload">
            <p class="data"></p>
            <p class="data-desc"></p>
          </div>
          <div class="desc" v-else>
            <p class="data">{{ hitPer }}%</p>
            <p class="data-desc">点击率</p>
          </div>
        </div>
      </div>
      <!--顶部信息展示end-->
      <div class="data-list-five margin-top16" :class="tableDisplay()">
        <!--表数据模块start-->
        <ul class="list-header">
          <li class="checkbox">
            <el-checkbox v-model="isChecked" @change="checkAll" :disabled="isNoData"></el-checkbox>
          </li>
          <li class="title" v-show="!hasChecked">推广标题</li>
          <li class="sent-rate" v-show="!hasChecked">发送量（封）</li>
          <li class="delivery-rate" v-show="!hasChecked">送达率</li>
          <li class="read-rate" v-show="!hasChecked">阅读率</li>
          <li class="click-rate" v-show="!hasChecked">点击率</li>
          <li class="click-rate" v-show="!hasChecked">账号</li>
          <li class="check-num" v-show="hasChecked">
            <span class="number">
              已选中<b v-text="checkedNum"></b>项
            </span>
            <span class="delete icon-buttons" @click="deleteMes()">
              <!-- <i class="icon-font">&#xe679;</i>--><span>删除</span>
            </span>
          </li>
        </ul>
        <div class="list-container" v-if="!isListLoading">
          <ul class="list-body" v-for="(item, index) in emialMarketList" :key="index">
            <li class="checkbox">
              <el-checkbox v-model="item.checked" @change="checkMes(item)"></el-checkbox>
            </li>
            <li class="title">
              <div class="limit-width">
                <p class="label">
                  <span class="limit limit_title" :title="item.title"  @click.stop="toDetail(item.id,item)" v-if="item.status === 1">{{ item.title }}</span>
                  <span class="limit limit_title" :title="item.title" @click='toDetail(item.id,item)' v-else>{{ item.title }}</span>
                  <i class="icon-font" v-if="item.status==-1" style="color:#FFA726;" title="草稿">&#xe672;</i>
                  <i class="icon-font" v-if="item.status==0" style="color:#00B8CC;" title="计划中">&#xe685;</i>
                </p>
                <p class="time" v-if="item.status!=-1">发送时间：{{ item.sendTime | timeformater }}</p>
                <p class="time" v-else>发送时间：-</p>
              </div>
            </li>
            <li class="sent-rate marginTop">
              <p>{{ item.total | dataIsNull}}</p>
            </li>
            <li class="delivery-rate marginTop">
              <p>{{ item.arrivePer }}%</p>
            </li>
            <li class="read-rate marginTop">
              <p>{{ item.readPer }}%</p>
            </li>
            <li class="click-rate marginTop">
              <p>{{ item.hitPer }}%</p>
            </li>
            <li class="click-rate marginTop">
              <p>{{ item.name || item.loginAccount }}</p>
            </li>
            <li class="operate" v-if="!infoIsShow && expansion">
              <el-tooltip effect="dark" content="统计" v-if="item.status==1" placement="top">
                <i class="icon-font" @click.stop="toEmailCenter(item.id)">&#xe6ea;</i>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <i class="icon-font" @click.stop="deleteMatket(item)">&#xe679;</i>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top" v-if="item.status!=1 && item.userId === loginAccount">
                <i class="icon-font" @click.stop="editMarket(item.id)">&#xe68a;</i>
              </el-tooltip>
              <el-tooltip effect="dark" content="非本人草稿，不可编辑" placement="top" v-if="item.status!=1 && item.userId !== loginAccount">
                <i class="icon-font" style="color: #999;" >&#xe68a;</i>
              </el-tooltip>
              <el-tooltip effect="dark" content="再次发送" placement="top" v-if="item.status==1">
                <i class="icon-font Resend" @click.stop="againSend(item)">&#xe6ee;</i>
              </el-tooltip>
            </li>
          </ul>
        </div>
        <!--数据加载 start-->
        <div class="load-container" v-if="isListLoading">
          <div class="loading loading-circle"></div>
        </div>
        <!--数据加载 end-->
        <!--无列表数据提示 start-->
        <div class="no-data email" v-if="nodata" v-show="!showAdd_empty">
          <img src="../../../src/assets/img/monitor/emailMarket_empty.png" alt="" style="width:88px;" />
          <p class="no-create-desc" v-if="statusType == 0 && !mainSearch">暂无数据，请先<span class="bindAccontStyle" @click="addLink"> 绑定邮箱</span></p>
          <p class="no-create-desc" v-else>暂无数据</p>
        </div>
        <div class="no-data email" v-if="showAdd_empty && !isListLoading">
          <img src="../../../src/assets/img/monitor/noData.png" alt="" style="width:88px;" />
          <p class="no-create-desc" v-if="statusType == 0">暂无数据，请新增邮件推广</p>
          <p class="no-create-desc" v-else>暂无数据</p>
        </div>
        <!--无列表数据提示 end-->
        <!--搜索表数据提示 start-->
        <div class="no-data email" v-if="searchIsNodata">
          <img src="../../../src/assets/img/develop/no-search-result.png" alt="" style="width:88px;" />
          <p class="no-create-desc">抱歉！没有找到与“<span>{{ keyWord }}</span>”相关的数据</p>
        </div>
        <!--搜索无列表数据提示 end-->
        <!--表数据模块end-->
        <!--分页模块start-->
        <div class="paging-column" v-if="emialMarketList.length > 0 && totalCount>10 && !isListLoading">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            :total="totalCount"
            :layout="layout">
          </el-pagination>
        </div>
        <!--分页模块end-->
      </div>
      <emailMarketInfo v-if="infoIsShow" @close="infoClose" :marketInfo="displayMarketInfo" @updateData="updateDataFunc"></emailMarketInfo>
      <el-dialog v-model="dialogVisible" size="tiny">
        <div class="delete-tip">
          <span class="icon-font">&#xe629;</span>
          <span class="tip-content">确定删除{{deleteConfig.message.length > 1? deleteConfig.message.length : '该'}}条推广邮件吗？</span>
          <p class="tip-text">{{deleteConfig.message.length > 1? '' : deleteConfig.message[0]}}</p>
          <div class="btn-wrapper">
            <el-button type="primary" @click="configOk">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import emailLiftMenu from './emailMarket/emailLiftMenu.vue'
  import emailMarketInfo from './emailMarket/emailMarketInfo.vue'
  import emailMarketApi from '@/api/emailMarketApi'
//  import { mapGetters } from 'vuex'
  export default{
    name: 'extension',
    data () {
      return {
        marketStatisticload: true,
        isBind: false,
        expansion: true,  // 左侧菜单是否展开
        isNoData: true,
        checkedNum: 0,
        emialMarketList: [],
        isChecked: false,
        hasChecked: false,
        isListLoading: true,  // 数据是否正在加载
        infoIsShow: false,   // 是否展示详细信息
        deleteMultiple: false, // 是否是 header 删除按钮
        receiptPopIsShow: false, // 收件人列表弹框
        showAddBtn: false, // 显示新增邮件推广按钮
        showAdd_empty: false, // 绑定之后显示的空数据
        nodata: false,
        searchIsNodata: false,
        pageSize: 10,
        currentPage: 1,    // 当前页
        totalCount: 0,      // 总条数
        totalpage: 0, // 总页数
        statusType: 0,
        max: 0,
        total: 0,
        allSendedCount: 0,
        arrivePer: 0,    // 到达率
        readPer: 0,    // 阅读率
        hitPer: 0,    // 点击率
        filtDataType: 0,
        removeId: '',
        deleteParams: {
          spreadId: ''
        },
        displayMarketInfo: {},
        reSendConfig: {
          visible: false,
          notice: '您是否确认再次发送?',
          sureText: '确定',
          cancelText: '取消',
          callback: null,
          isLoading: false
        }, // 重发弹窗配置
        deleteConfig: {
          visible: false,
          notice: '您是否确认删除?',
          message: [],
          sureText: '确定',
          cancelText: '取消',
          callback: null
        }, // 删除弹窗配置
        dialogVisible: false,
        recommendPage: {
          page: 1,
          pageSize: 10,
          totalCount: 0
        }, // 分页初始配置
        layout: 'prev, pager, next, sizes, jumper, ->',
        searchText: '',
        menuListCopy: [],
        isShowAccount: true,
        visibleChangeAco: false,
        accountId: '',
        loginAccount: ''
      }
    },
    computed: {
      keyWord () {
        return this.$store.state.develop.keyWord
      },
      loginAccount () {
        let user = JSON.parse(window.localStorage.user)
        return user.userId
      },
      accountList () {
        let user = JSON.parse(window.localStorage.user)
        if (!this.$route.query.id) {
          this.accountId = user.userId
        }
        this.loginAccount = user.userId
        let subUserList = user.subUserList
        let account = [{name: user.name ? user.name : user.loginAccount, id: user.userId}]
        if (subUserList && subUserList.length) {
          account = account.concat(subUserList)
        }
        return account
      },
      // 主账号查询子账号的营销邮件，不提示绑定邮箱
      mainSearch () {
        let sublist = JSON.parse(window.localStorage.user)
        let id = sublist.userId
        if (this.accountId && this.accountId !== id) {
          return true
        } else {
          return false
        }
      }
    },
    beforeMount () {
      if (this.$route.query.id) {
        this.accountId = this.$route.query.id
        this.getMarketListFunc('2')
        this.getMarketStatisticFunc()
      }
    },
    watch: {
      keyWord () {
        this.keyWord = this.keyWord || ''
        this.infoIsShow = false
        this.layout = 'prev, pager, next, sizes, jumper, ->'
        this.isNoData = true
        this.currentPage = 1
        this.deleteParams.spreadId = ''
        this.emialMarketList = []
        this.checkedNum = 0
        this.hasChecked = false
        this.isChecked = false
        this.searchIsNodata = false
        this.getMarketListFunc('2')
      }
    },
    mounted () {
      this.isBindEmail()
      // this.getMarketStatisticFunc()
      this.isShowAccountSelect()
    },
    methods: {
       /*
      * 判断账号筛选下拉框是否显示
      * */
      isShowAccountSelect () {
        if (localStorage.getItem('isMainAccount') === 'true') {
          this.isShowAccount = true
        } else {
          this.isShowAccount = false
        }
        this.$store.commit('FIND_ACCOUNTID', { accountId: this.accountId })
      },
      /*
      * 控制 select 被选中的状态
      * */
      visibleChange (type) {
        if (this.threeClick) {
          this.threeClick = false
          this.visibleChangeAco = true
        } else {
          this.threeClick = true
          this.visibleChangeAco = false
        }
      },
      /**
       * 搜索关键字过滤
       * @param queryString
       * @param cb
       */
      querySearchAsync (queryString, cb) {
        if (queryString.length < 2) {
          cb([])
          return
        }
        if (this.curTimer) {
          clearTimeout(this.curTimer)
        }
      },
      /**
       * 过滤方法
       * @param queryString
       * @returns {function(*)}
       */
      createStateFilter (queryString) {
        return (state) => {
          return (state.value.indexOf(queryString.toLowerCase()) !== -1)
        }
      },
      /**
       *  搜索
       */
      search () {
        // if (this.searchText === '' || this.searchText === null) {
        //   this.$message.error('请输入推广标题')
        //   return
        // }
        this.$store.commit('DEVELOP_KEYWORD', {keyWord: this.searchText || ''})
      },
      /**
       * 新增邮件推荐
       */
      addEmailMarketFunc () {
        if (this.isBind) {
          if (parseInt(this.total) >= parseInt(this.max)) {
            this.$message.error('发送邮件达到上限')
          } else {
            this.$store.commit('DEVELOP_SENDINFO', {first: {}, second: {}, third: {}, four: {}})
            this.$store.commit('DEVELOP_ISMENUCLICK', false)
            this.$store.commit('LINKER_TO_MAIL', {linkerToMail: false})
            this.$router.push({path: '/emailTopMenu'})
          }
        } else {
          this.$message.error('请先绑定邮箱')
        }
      },
      /**
       * 跳转到统计页面
       */
      toEmailCenter (id) {
        this.$router.push({
          path: '/emailCenter',
          query: {'id': id}
        })
      },
      /**
       * 跳转到详情页
       */
      toDetail (id, item) {
        localStorage.setItem('tmplType', 'emailTmpl')
        this.$router.push({path: '/preview?type=1&mailMarketingId=' + item.id})
      },
      // 获取统计数据
      getMarketStatisticFunc () {
        this.marketStatisticload = true
        emailMarketApi.getMarketStatistic({queryUserId: this.accountId}).then(res => {
          if (res.data.code === 0) {
            let marketstatis = res.data.data
            this.max = marketstatis.max
            this.total = marketstatis.total
            this.allSendedCount = marketstatis.allSendedCount
            this.arrivePer = marketstatis.arrivePer
            this.readPer = marketstatis.readPer
            this.hitPer = marketstatis.hitPer
            localStorage.setItem('arrivePer', this.arrivePer)
            localStorage.setItem('readPer', this.readPer)
            localStorage.setItem('hitPer', this.hitPer)
            this.marketStatisticload = false
          }
        })
      },
      // 获取邮件推送列表数据 loadtype:1 普通获取邮件列表 2 搜索邮件列表
      getMarketListFunc (loadtype, accoutChange) {
        console.log(this.accountId)
        this.isListLoading = true
        this.searchIsNodata = false
        this.nodata = false
        this.showAdd_empty = false
        this.deleteParams.spreadId = ''
        this.checkedNum = 0
        this.hasChecked = false
        this.isChecked = false
        let type = this.statusType
        let params = {
          page: this.currentPage,
          size: this.pageSize
        }
        if (type === 0) {   // 全部
        } else if (type === 1) {  // 已发送
          params.status = 1
        } else if (type === 2) {    // 计划中
          params.status = 0
        } else if (type === 3) {    // 草稿箱
          params.status = -1
        }
        if (this.keyWord !== '') {
          params.keyword = this.keyWord
        }
        if (localStorage.getItem('isMainAccount') === 'true') {
          params.queryUserId = this.accountId
        }
        this.$store.commit('FIND_ACCOUNTID', { accountId: this.accountId })
        // 如果账号变化则重现请求统计信息
        if (accoutChange) {
          console.log(accoutChange, '=====')
          this.getMarketStatisticFunc()
        }
        emailMarketApi.getMarketList(params).then(res => {
          if (res.data.code === 0) {
            this.totalCount = res.data.data.totalCount
            this.emialMarketList = res.data.data.records
            this.emialMarketList.forEach((value, index) => {
              if (value.checked === undefined) {
                value.checked = false
              }
            })
            if (this.emialMarketList.length === 0) {
              this.isNoData = true
              if (loadtype === '1') {
                this.nodata = true
              } else {
                this.searchIsNodata = true
              }
            } else {
              this.nodata = false
              this.showAdd_empty = false
              this.isNoData = false
              this.searchIsNodata = false
            }
          } else {
            this.emialMarketList = []
            this.isNoData = true
            if (loadtype === '1') {
              this.nodata = true
              this.showAdd_empty = true
            } else {
              this.searchIsNodata = true
            }
          }
          this.isListLoading = false
        })
      },
      // 分页每页条数改变回调方法
      handleSizeChange (val) {
        this.pageSize = val
        this.currentPage = 1
        this.getMarketListFunc('1')
      },
      // 分页页码改变回调方法
      handleCurrentChange (val) {
        this.currentPage = val
        this.isListLoading = true
        this.getMarketListFunc('1')
      },
      // 编辑邮件
      editMarket (id) {
        if (this.isBind) {
          this.$store.commit('DEVELOP_ISMENUCLICK', false)
          this.$router.push({path: '/emailTopMenu?id=' + id + '&edit=1'})
        } else {
          this.$message.error('请先绑定邮箱')
        }
      },
      // 子页面详情响应
      spreadFunc (msg) {
        this.expansion = msg
      },
      /*
       * body 中 CheckBox的选中功能
       * */
      checkMes (item) {
        if (item.checked) {
          this.checkedNum ++
        } else {
          this.checkedNum --
        }
        if (this.checkedNum === this.emialMarketList.length) {
          this.isChecked = true
          this.hasChecked = true
        } else {
          this.isChecked = false
          if (this.checkedNum > 0) {
            this.hasChecked = true
          } else {
            this.hasChecked = false
          }
        }
      },
      /*
       * header 中 CheckBox的全选功能
       * */
      checkAll () {
        if (this.isChecked) {
          this.checkedNum = this.emialMarketList.length
          this.hasChecked = true
        } else {
          this.checkedNum = 0
          this.hasChecked = false
        }
        this.emialMarketList.forEach((item, index) => {
          item.checked = this.isChecked
        })
      },
      // 删除邮件
      deleteMatket (item) {
        this.deleteParams.spreadId = ''
        this.deleteParams.spreadId = item.id
        let title = [item.title]
        Object.assign(this.deleteConfig, {visible: true, notice: '确定删除以下推广邮件：', message: title})
        this.dialogVisible = true
      },
      /*
       * 批量删除
       * */
      deleteMes (item) {
        this.deleteParams.spreadId = ''
        this.deleteConfig.message = []
        if (item) {
          this.item = item
          this.deleteMultiple = false
          this.deleteParams.spreadId = item.id
        } else {
          this.deleteMultiple = true
          this.emialMarketList.forEach((value, index) => {
            if (value.checked) {
              if (this.deleteParams.spreadId === '' || this.deleteParams.spreadId === null) {
                this.deleteParams.spreadId = value.id
              } else {
                this.deleteParams.spreadId += ';' + value.id
              }
              this.deleteConfig.message.push(value.title)
            }
          })
        }
        // this.deleteConfig.visible = true
        this.dialogVisible = true
      },
      // 子组件删除回调父组件
      configOk () {
        let id = this.deleteParams.spreadId
        let params = {
          mailMarketingIds: id
        }
        emailMarketApi.deleteMarket(params).then(res => {
          if (res.data.code === 0) {    // 删除成功
            this.getMarketListFunc('1')
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {  // 删除失败
            this.$message.error(res.data.message)
          }
          this.dialogVisible = false
        })
      },
      // 子组件切换筛选
      statusChangeFunc (msg) {
        this.statusType = msg
        this.infoIsShow = false
        this.layout = 'prev, pager, next, sizes, jumper, ->'
        this.isNoData = true
        this.currentPage = 1
        this.deleteParams.spreadId = ''
        this.emialMarketList = []
        this.checkedNum = 0
        this.hasChecked = false
        this.isChecked = false
        this.searchIsNodata = false
        this.searchText = ''
        this.$store.commit('DEVELOP_KEYWORD', {keyWord: ''})
        this.accountId = JSON.parse(window.localStorage.user).userId
        this.getMarketListFunc('1')
      },
      /**
       * 邮件详情展示
       */
      // displayInfoFunc (item) {
      //   let id = item.id
      //   let params = {
      //     mailMarketingId: id
      //   }
      //   emailMarketApi.getMarketDetail(params).then(res => {
      //     if (res.data.code === 0) {
      //       this.displayMarketInfo = res.data.data
      //       this.displayMarketInfo.isBind = this.isBind
      //       this.infoIsShow = true
      //       this.layout = 'prev, pager, next, sizes'
      //     } else {
      //       this.$message.error(res.data.message)
      //     }
      //   })
      // },
      /**
       * table表不同结构展示
       */
      tableDisplay () {
        if (this.infoIsShow) {
          return 'no-operate-table'
        } else if (!this.expansion) {
          return 'no-operate-tableTwo'
        }
      },
      // 子组件关闭响应父组件
      infoClose () {
        this.infoIsShow = false
        this.layout = 'prev, pager, next, sizes, jumper, ->'
      },
      // 子组件数据删除或者修改响应父组件
      updateDataFunc (msg) {
        if (msg === '1') {
          this.infoIsShow = false
          this.layout = 'prev, pager, next, sizes, jumper, ->'
        }
        this.getMarketListFunc('1')
      },
      // 判断邮箱是否绑定
      isBindEmail () {
        emailMarketApi.getChannelList().then(res => {
          if (res.data.code === 0) {
            let channelList = res.data.data
            let _this = this
            channelList.forEach(function (channel) {
              if (channel.channelId === 'MAIL') {
                if (channel.emailAddress !== '' && channel.emailAddress !== null && channel.bindingTag === 1) {
                  console.log(1111)
                  _this.isBind = true
                  _this.showAddBtn = true
                  _this.showAdd_empty = true
                } else {
                  console.log(2222)
                  _this.isBind = false
                  _this.showAddBtn = false
                  _this.showAdd_empty = false
                }
              }
            })
          } else {
            this.isBind = false
          }
        })
      },
      // 点击新增判断跳转
      addLink () {
        // if (this.isBind) {
        //   if (this.total > this.max) {
        //     this.$message.error('发送邮件达到上限')
        //   } else {
        //     this.$store.commit('DEVELOP_SENDINFO', {first: {}, second: [], third: {}, four: {}})
        //     this.$store.commit('DEVELOP_ISMENUCLICK', false)
        //     this.$router.push({path: '/emailTopMenu'})
        //   }
        // } else {
        //   this.$message.error('请先绑定邮箱')
        // }
        this.$router.push({path: '/channelList'})
      },
      // 重新发送
      againSend (item) {
        let id = item.id
        this.$router.push({
          path: '/emailTopMenu',
          query: {'id': id, 'activeMenu': 1}
        })
      }
    },
    filters: {
      dataIsNull (value) {
        if (value === '' || value === null) {
          return 0
        } else {
          return value
        }
      },
      timeformater (value) {
        if (value !== '' && value !== null) {
          let time = new Date(value)
          let year = time.getFullYear()
          let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
          let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
          let hour = (time.getHours() < 10 ? '0' : '') + time.getHours()
          let minute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
          return year + '/' + month + '/' + day + ' ' + hour + ':' + minute
        } else {
          return '-'
        }
      }
    },
    components: {
      emailLiftMenu,
      emailMarketInfo
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/variable';
  @import "../../assets/style/base";
  @import '../../assets/style/page';

  .load-container{
    margin: 150px 0 65px 0;
  }
  // .paging-column {
  //   padding: 16px 0 30px 0;
  //   overflow: hidden;
  //   background: #fff;
  //   .el-pagination {
  //     text-align: right;
  //     margin: 20px;
  //   }
  //   .el-pagination {
  //     white-space: nowrap;
  //     padding: 2px 5px;
  //     color: rgb(72, 78, 106);
  //   }
  // }
  .limit{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .limit-width{

  }
  .margin-left16{
    margin-left:16px;
  }
  .margin-top16{
    margin-top:16px;
  }
  .email-left-menu{
    float:left;
    width:200px;
    overflow:hidden;
    position: relative;
    transition: width 0.2s;
    .menu-shrink{
      position: absolute;
      right: -10px;
      top: 50%;
      font-size: 30px;
      margin-top:-15px;
      color: #CBD6E2;
      cursor: pointer;
    }
    li{
      line-height: 40px;
      height: 40px;
      font-size: 14px;
      color: #4F6D95;
      position: relative;
      padding-left: 20px;
      cursor: pointer;
      white-space: nowrap;
      i{
        font-size:11px;
        margin-right: 10px;
        margin-top:2px;
        display: inline-block;
      }
    }
    li:hover{
      color: #5488F9;
    }
    .active:before{
      content: '';
      width:3px;
      height:40px;
      background: #5488F9;
      position: absolute;
      left: 0px;
      top: 0px;
    }
   li.active{
     background: #FFFFFF;
     box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
     color: #5488F9;
   }
  }
  .email-market{
    width:100%;
    overflow: hidden;
    .el-dialog{
      width: 360px;
      height: 180px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      .el-dialog__header{
        border: 1px solid transparent;
        padding: 12px 12px 0;
      }
      .delete-tip{
        .icon-font{
          font-size: 27px;
          color: #FEA000;
          margin-right: 10px;
        }
        .tip-content{
          font-size: 14px;
          color: #33475b;
          font-weight: 600;
        }
        .tip-text{
          height: 36px;
          line-height: 36px;
          padding-left: 40px;
          font-size: 12px;
          color: rgba(51,71,91,0.60);
        }
        .btn-wrapper{
          margin-top: 16px;
          margin-left: 40px;
          .el-button--danger{
            background-color: #ff3b6e;
            padding: 9px 24px;
          }
          .el-button--default{
            border: none;
            padding: 0 9px;
            color: #4f6d95;
          }
        }
      }
    }
    .right-content-model.spread{
      width:1127px;
      transition: width 0.2s;
      .top-info-display{
        .info-display{
          clear: both;
          .image-display{
            margin-left:71px;
          }
        }
      }
    }
    .right-content-model{
      float:right;
      width:960px;
      .top-info-display{
        width:100%;
        overflow:hidden;
        background: #FFFFFF;
        box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
        border-radius: 4px;
        padding:0 0 34px 0;
        .searchType{
          overflow: hidden;
          padding: 13px 20px;
          border-bottom: 1px solid #EAF0F6;
          .operate-container{
            float: right;
            margin-top:0px;
            font-size:0px;
            .choose-aco{
              float: left;
              .el-input__inner{
                height:36px;
              }
            }
            a{
              margin-left:0px;
            }
            .email-search{
              width:240px;
              margin:0 10px;
              .el-input__inner{
                height:36px;
              }
              .el-icon-search:hover+.el-input__inner{
                border-color:#CBD6E3;
              }
            }
            .el-autocomplete{
              width:240px;
              margin-right:10px;
              .el-input__inner{
                height:34px;
                font-size:13px;
              }
              .el-input-group__append{
                padding: 0px 10px;
                .contact-list-search{
                  padding:9px 8px;
                }
              }
            }
            .el-button{
              height: 36px;
              font-size:13px;
            }
          }
        }
        .click-rate-display,.info-display{
          width:25%;
          float: left;
          position:relative;
          margin-top: 35px;
          .image-display{
            margin-left:45px;
            width:46px;
            height: 46px;
            border-radius: 8px;
            text-align: center;
            display: inline-block;
            vertical-align: bottom;
            i{
              font-size: 18px;
              line-height: 48px;
            }
          }
          .desc{
            display: inline-block;
            margin-left:20px;
            .data{
              font-size: 24px;
              color: #33475B;
              line-height: 33px;
            }
            .data-desc{
              font-size: 13px;
              color: #5488F9;
              line-height: 18px;
            }
            .send-count{
              position: absolute;
              top: 35px;
              right: -10px;
              min-width: 135px;
            }
          }
          .desc-load{
            .animation(loadingColor,1s,infinite);
            display: inline-block;
            margin-left:20px;
            .data{
              height: 28px;
              line-height: 28px;
              width:53px;
              background: #EAF0F6;
            }
            .data-desc{
              margin-top:6px;
              height: 17px;
              line-height: 18px;
              width:95px;
              background: #EAF0F6;
            }
          }
        }
        .info-display:after{
          content: '';
          width:2px;
          height:20px;
          background: #EAF0F6;
          position: absolute;
          right: -15px;
          top: 19px;
        }
        .sent-rate{
          .image-display{
            background: #ECF2FF;
            i{
              color: #5488F9;
            }
          }
        }
        .delivery-rate{
          .image-display{
            background: #DFF9FC;
            i{
              color: #00B8CC;
            }
          }
        }
        .read-rate{
          .image-display{
            background: #FDF3E4;
            i{
              color: #FFA726;
            }
          }
        }
        .click-rate{
          .image-display{
            background: #EAF7FF;
            i{
              color: #0998F5;
            }
          }
        }
      }
    }
    .no-operate-table.data-list-five{
      overflow:hidden;
      width: calc(~'100% - 418px');
      transition: width 0.2s;
      .list-header li,.list-body li{
        &.checkbox{
           width: 12.83%;
         }
        &.title{
           width: 31%;
         }
        &.sent-rate{
           width: 10.15%;
         }
        &.delivery-rate{
           width: 10.15%;
         }
        &.read-rate{
           width: 10.15%;
         }
        &.click-rate{
           width: 10.15%;
        }
      }
    }
    .no-operate-tableTwo.data-list-five{
      transition: width 0.2s;
      .list-header li:first-child,.list-body li:first-child{
        padding-left:28px;
      }
      .list-header li,.list-body li{
        &.checkbox{
           width: 6.85%;
         }
        &.title{
           width: 46.2%;
         }
        &.sent-rate{
           width: 8.95%;
         }
        &.delivery-rate{
           width: 8.95%;
         }
        &.read-rate{
           width: 8.95%;
         }
        &.click-rate{
           width: 8.95%;
        }
      }
    }
    .data-list-five{
      background: #FFFFFF;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
      border-radius: 4px;
      min-height:556px;
      display: inline-block;
      width: 100%;
      .list-header{
        overflow: hidden;
        background: #F5F8FA;
        border: 1px solid #DFE3EB;
        li{
          line-height: 48px;
          height:48px;
          font-size: 13px;
          color: #33475B;
          font-weight: 600;
        }
        .check-num{
          font-size: 13px;
          color: #7C98B6;
          line-height: 46px;
          .number{
            margin-right:10px;
          }
          .delete{
            cursor: pointer;
            padding:0 15px;
            i{
              margin-right:5px;
            }
            span{
              font-size: 12px;
            }
          }
        }
      }
      .list-body:hover{
        background: #EAF0F6;
        .operate{
          display:block;
          i{
            color: #5488F9;
          }
        }
      }
      .list-body{
        padding:10px 0;
        box-sizing: border-box;
        overflow: hidden;
        border-bottom:1px solid #EAF0F6;
        .label{
          font-size: 13px;
          color: #5488F9;
          letter-spacing: 0;
          .limit_title{
            max-width: 65%;
            display: inline-block;
            margin-right: 3px;
            cursor: pointer;
          }
          i{
            vertical-align: top;
            display: inline-block;
            margin-top: 2px;
          }
        }
        .marginTop{
          margin-top: 15px
        }
        .time{
          font-size: 12px;
          color: #7C98B6;
          letter-spacing: 0;
          line-height: 17px;
          margin-top:6px;
        }
      }
      .list-header li:first-child,.list-body li:first-child{
        padding-left:20px;
      }
      .list-header li,.list-body li{
        box-sizing: border-box;
        text-align:left;
        float:left;
        &.checkbox{
           width: 7.22%;
         }
        &.title{
           width: 28.6%;
        }
        &.sent-rate{
           width: 10.5%;
        }
        &.delivery-rate{
           width: 10.5%;
        }
        &.read-rate{
           width: 10.5%;
        }
        &.click-rate{
           width: 10.5%;
        }
        &.operate{
           width: 9.68%;
           margin-top: 15px;
           display:none;
          i{
            color: #B0C1D4;
            font-size: 14.1px;
            margin-right:20px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .email{
    .no-create-desc{
      font-size: 14px;
      color: #33475B;
      letter-spacing: 0;
      margin-top:20px;
      .bindAccontStyle{
        font-weight: normal;
        font-size: 14px;
        text-decoration: underline;
        color:#5488F9;
        cursor: pointer;
      }
      span{
        font-weight: 600;
      }
    }
    .desc-second{
      font-size: 13px;
      color: #7C98B6;
      line-height: 18px;
      margin-top:8px;
    }
    .add{
      width:100px;
    }
  }
</style>
