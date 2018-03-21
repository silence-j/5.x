<template>
    <div class="market-info margin-top16">
      <!--右侧详情展示start-->
      <div class="right_info_display" v-if="!emailInfoLoad">
        <div class="top-display">
          <p class="top-operate">
            <!-- 统计-->
            <span class="edit" @click="jumpLink(marketInfo.id)" v-if="marketInfo.status==1">统计</span>
            <!-- 编辑 已发送状态不可用-->
            <span class="edit" @click="editLink(marketInfo.id)" v-if="marketInfo.status!=1">编辑</span>
            <!-- 再次发送 已发送状态可用-->
            <span class="delete" @click="againEmailFunc" v-if="marketInfo.status==1">再次发送</span>
            <!--<span class="delete" @click="sendEmailFunc" v-if="marketInfo.status==-1">发送</span>-->
            <!-- 删除 无限制-->
            <span class="delete" @click="deleteEmailFunc">删除</span>
            <span class="icon-font remove" @click="popClose">&#xe62c;</span>
          </p>
          <p class="title">{{ marketInfo.title }}
            <i class="icon-font" v-if="marketInfo.status==-1" style="color:#FFA726;" title="草稿">&#xe672;</i>
            <i class="icon-font" v-if="marketInfo.status==0" style="color:#00B8CC;" title="计划中">&#xe685;</i>
            <i class="icon-font" v-if="marketInfo.status==1" style="color:#64b640;" title="已完成">&#xe654;</i>
          </p>
          <p class="sender-desc">发件人：{{ marketInfo.sender }}</p>
          <p class="receipt-desc">收件人：<span @click="selReceiverInfo">查看收件人列表</span></p>
        </div>
        <div class="email-content" v-html="marketInfo.content">
        </div>
      </div>
      <!--右侧详情展示end-->
      <!--数据加载 start-->
      <div class="middle_load emailInfo_waitload" v-if="emailInfoLoad">
        <div class="loading loading-circle"></div>
      </div>
      <!--数据加载 end-->
      <!--收件人列表弹框start-->
      <el-dialog title="收件人列表" v-model="receiptPop" class="receipt-pop" size="390px">
        <div class="topMenu" style="min-width:683px;">
          <ul class="menu">
            <li v-for="(mItem,mindex) in menuList" :class="{curr:mindex===selectedSubNav}" @click="changeMenu(mindex, mItem.type)">
              {{ mItem.title }}
            </li>
            <div class="operate-container receiverList_search">
              <el-input
                placeholder="请输入联系人姓名或邮箱搜索"
                v-model="searchText"
                @keyup.enter.native="search"
                class="input-sel-search">
                <el-button slot="append" icon="search" @click="search"></el-button>
              </el-input>
            </div>
          </ul>
        </div>
        <div class="receiverList" style="min-width:683px;">
          <ul class="list-header">
            <li class="source">来源收件人</li>
            <li class="send_time">送达时间</li>
            <li class="open_time">打开时间</li>
            <li class="hit_time">点击时间</li>
          </ul>
          <div class="list-container" id="receiverList" v-if="!isListLoading && receiptData.length>0">
            <ul class="list-body" v-for="(item, index) in receiptData" :key="index" v-if="receiptData.length>0">
              <li class="source">
                  <p class="limit">{{item.firstname}}{{item.lastname}}<{{ item.address }}></p>
              </li>
              <li class="send_time">
                <p>{{ item.arriveTime | dataFormate }}</p>
              </li>
              <li class="open_time">
                <p>{{ item.readTime | dataFormate }}</p>
              </li>
              <li class="hit_time">
                <p>{{ item.hitTime | dataFormate }}</p>
              </li>
            </ul>
            <div class="data-load" v-if="totalpages>1 && page!=totalpages">
              <div class="loading loading-circle"></div>
            </div>
          </div>
          <!--数据加载 start-->
          <div class="load-container receiver_load" v-if="isListLoading">
            <div class="loading loading-circle"></div>
          </div>
          <!--数据加载 end-->
          <!--无列表数据提示 start-->
          <div class="no-data receiver" v-if="!isListLoading && !ishaveData">
            <p class="no-create-desc">暂无数据</p>
          </div>
          <!--无列表数据提示 end-->
        </div>
      </el-dialog>
      <!--收件人列表弹框end-->
      <deleteEmailPop :config="deleteConfig" @sure="configOk"></deleteEmailPop>
    </div>
</template>

<script>
  import deleteEmailPop from './deleteEmailPop.vue'
  import emailMarketApi from '@/api/emailMarketApi'
  import Vue from 'vue'
  export default{
    name: 'extension',
    props: {
      marketInfo: {
        content: String,
        contentArr: String,
        id: Number,
        receiver: String,
        scheduleTime: Number,
        sender: String,
        status: Number,
        subject: String,
        title: String,
        totalCount: Number,
        isBind: Boolean
      }
    },
    data () {
      return {
        receiptPop: false,
        selectedSubNav: 0,
        searchText: '',
        totalpages: 1,
        page: 1,
        pageSize: 10,
        keyword: '',
        emailInfoLoad: false,
        isListLoading: true,
        ishaveData: true,
        isLoadIng: false,
        totalCount: 0,
        arriveCount: 0,
        readCount: 0,
        hitCount: 0,
        menuList: [
          {
            title: '全部',
            type: 0
          },
          {
            title: '已送达',
            type: 1
          },
          {
            title: '已打开',
            type: 2
          },
          {
            title: '已点击',
            type: 3
          }
        ],
        deleteConfig: {
          theme: '', // 弹框标题
          visible: false,   // 是否展示弹框
          notice: '',       // 弹框内容
          sureText: '删除',   // 按钮描述
          cancelText: '取消',
          callback: null,
          isLoading: false
        },
        receiptData: []
      }
    },
    computed: {
    },
    filters: {
      dataFormate (value) {
        if (value === '' || value === null) {
          return '-'
        } else {
          let time = new Date(value)
          let year = time.getFullYear()
          let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
          let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
          let hour = (time.getHours() < 10 ? '0' : '') + time.getHours()
          let minute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
          return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
        }
      }
    },
    watch: {
      'marketInfo.id' () {
        this.ishaveData = true
        this.selectedSubNav = 0
        this.searchText = ''
        this.page = 1
        this.keyword = ''
        // this.emailInfoLoad = true
        this.isListLoading = true
        this.isLoadIng = false
        this.receiptData = []
        let id = this.marketInfo.id
        this.getReceiverStatisFunc(id)
      }
    },
    mounted () {
      let id = this.marketInfo.id
      this.getReceiverStatisFunc(id)
    },
    methods: {
      // 统计跳转
      jumpLink (id) {
        this.$router.push({
          path: '/emailCenter',
          query: {id: id}
        })
      },
      popClose () {
        this.$emit('close')
      },
      // 弹框顶部菜单切换
      changeMenu (mindex, type) {
        this.selectedSubNav = mindex
        this.page = 1
        this.ishaveData = true
        this.searchText = ''
        this.isListLoading = true
        this.isLoadIng = false
        this.receiptData = []
        this.getReceiverListFunc()
      },
      /**
       * 搜索
       */
      search () {
        this.page = 1
        this.selectedSubNav = 0
        this.ishaveData = true
        this.isListLoading = true
        this.isLoadIng = false
        this.receiptData = []
        this.getReceiverListFunc()
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
      /*
      * 再次发送
      * */
      againEmailFunc () {
        if (this.marketInfo.isBind) {
//          let emailInfo = this.marketInfo
//          let receiverList = emailInfo.receivers
//          let params = {
//            title: emailInfo.title,
//            content: emailInfo.content,
//            contentArr: emailInfo.contentArr,
//            totalCount: emailInfo.totalCount,
//            sender: emailInfo.sender,
//            receivers: JSON.stringify(receiverList),
//            subject: emailInfo.subject
//          }
//          emailMarketApi.addMarketSend(params).then(res => {
//            if (res.data.code === 0) {
//              this.$emit('updateData', '2')
//              this.$message({
//                message: '重新发送成功',
//                type: 'success'
//              })
//            } else {
//              this.$message.error(res.data.message)
//            }
//          })
          let emailInfo = this.marketInfo
          let id = emailInfo.id
          this.$router.push({
            path: '/emailTopMenu',
            query: {'id': id, 'activeMenu': 1}
          })
        } else {
          this.$message.error('请先绑定账号')
        }
      },
      /**
       * 删除邮件
       */
      deleteEmailFunc () {
        let title = [this.marketInfo.title]
        Object.assign(this.deleteConfig, {visible: true, theme: 'red', notice: '确定删除以下推广邮件：', message: title})
      },
      /**
       *删除确认接口
       */
      configOk () {
        let id = this.marketInfo.id
        let params = {
          mailMarketingIds: id
        }
        emailMarketApi.deleteMarket(params).then(res => {
          if (res.data.code === 0) {    // 删除成功
            this.$emit('updateData', '1')
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {  // 删除失败
            this.$message.error(res.data.message)
          }
        })
      },
      // 编辑跳转
      editLink (id) {
        this.$router.push({path: '/emailTopMenu?id=' + id})
      },
      // 查看收件人列表
      selReceiverInfo () {
        this.page = 1
        this.searchText = ''
        this.getReceiverListFunc()
        this.receiptPop = true
        this.setTopData()
      },
      setTopData () {
        this.menuList[0].title = '全部 (' + this.totalCount + ')'
        this.menuList[1].title = '已送达 (' + this.arriveCount + ')'
        this.menuList[2].title = '已打开 (' + this.readCount + ')'
        this.menuList[3].title = '已点击 (' + this.hitCount + ')'
      },
      // 收件人列表数据统计
      getReceiverStatisFunc (id) {
        let params = {
          mailMarketingId: id
        }
        emailMarketApi.getReceiverStatis(params).then(res => {
          if (res.data.code === 0) {
            let staticData = res.data.data
            let arriveCount = staticData.arriveCount   // 到达数
            let hitCount = staticData.hitCount        // 打开数
            let readCount = staticData.readCount     // 阅读数
            let totalCount = staticData.totalCount    // 总数
            this.totalCount = totalCount
            this.arriveCount = arriveCount
            this.hitCount = hitCount
            this.readCount = readCount
            this.setTopData()
          } else {
            this.menuList[0].title = '全部 (0)'
            this.menuList[1].title = '已送达 (0)'
            this.menuList[2].title = '已打开 (0)'
            this.menuList[3].title = '已点击 (0)'
          }
        })
      },
      // 收件人列表数据
      getReceiverListFunc () {
        if (!this.isLoadIng) {
          this.isLoadIng = true
          let id = this.marketInfo.id
          this.isListLoading = true
          this.ishaveData = true
          let params = {
            mailMarketingId: id,
            page: this.page,
            size: this.pageSize
          }
          let type = this.selectedSubNav
          if (type === 0) {   //  全部
          } else {  // 已送达
            params.actStatus = type
          }
          if (this.searchText !== '' && this.searchText !== null) {
            params.keyword = this.searchText
            this.menuList = [{title: '全部', type: 0}, {title: '已送达', type: 1}, {title: '已打开', type: 2}, {title: '已点击', type: 3}]
          } else {
            this.setTopData()
          }
          emailMarketApi.getReceiverList(params).then(res => {
            if (res.data.code === 0) {
              let records = res.data.data.records
              this.totalpages = res.data.data.totalPages
              if (records.length === 0 && this.totalpages === 1) {
                this.ishaveData = false
              } else {
                this.receiptData = records
                this.ishaveData = true
              }
              this.isListLoading = false
              this.isLoadIng = false
              let _this = this
              this.emailInfoLoad = false
              Vue.nextTick(() => {
                let obj = document.getElementById('receiverList')
                if (obj !== null && obj !== undefined) {
                  obj.addEventListener('scroll', (event) => {
                    if ((obj.scrollTop + obj.clientHeight) >= (obj.scrollHeight)) {
                      if (!_this.isLoadIng && _this.page < _this.totalpages) {
                        console.log('load....')
                        _this.page = _this.page + 1
                        _this.load()
                      }
                    }
                  })
                }
              })
            } else {
              this.receiptData = []
              this.isListLoading = false
              this.ishaveData = false
              this.isLoadIng = false
            }
          })
        }
      },
      load () {
        if (!this.isLoadIng) {
          this.isLoadIng = true
          let id = this.marketInfo.id
          this.ishaveData = true
          let params = {
            mailMarketingId: id,
            page: this.page,
            size: this.pageSize
          }
          let type = this.selectedSubNav
          if (type === 0) {   //  全部
          } else {  // 已送达
            params.actStatus = type
          }
          if (this.searchText !== '' && this.searchText !== null) {
            params.keyword = this.searchText
          }
          emailMarketApi.getReceiverList(params).then(res => {
            if (res.data.code === 0) {
              let records = res.data.data.records
              let receiptDataList = this.receiptData
              this.totalpages = res.data.data.totalPages
              if (records.length === 0 && this.totalpages === 1) {
                this.ishaveData = false
              } else {
                this.receiptData = receiptDataList.concat(records)
                this.ishaveData = true
              }
              this.isLoadIng = false
            } else {
              this.receiptData = []
              this.ishaveData = false
              this.isLoadIng = false
            }
          })
        }
      },
      getScrollTop () {
        let scrollTop = 0
        if (document.documentElement && document.documentElement.scrollTop) {
          scrollTop = document.documentElement.scrollTop
        } else if (document.body) {
          scrollTop = document.body.scrollTop
        }
        return scrollTop
      },
      getClientHeight () {
        let clientHeight = 0
        if (document.body.clientHeight && document.documentElement.clientHeight) {
          clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
        } else {
          clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
        }
        return clientHeight
      },
      getScrollHeight () {
        return (Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)) - 150
      }
    },
    components: {
      deleteEmailPop
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .email-content i{
    font-style: italic;
  }
  .email-content h1{
    font-size: 2em;
  }
  .email-content h2{
    font-size: 1.5em;
  }
  .email-content h3{
    font-size: 1.17em;
  }
  .email-content h4{
    font-size: 1em;
  }
  .email-content h5{
    font-size: 0.83em;
  }
  .email-content h6{
    font-size: 0.67em;
  }
  .email-content ol{
    padding-left: 20px;
  li{
    list-style: decimal;
  }
  }
  .email-content ul{
    padding-left: 20px;
  li{
    list-style: disc;
  }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  .middle_load{
    position: relative;
    top:50%;
    margin-top:-19px;
  }
  .market-info{
    margin-bottom:30px;
    background: #FFFFFF;
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
    border-radius: 4px;
    width:400px;
    display: inline-block;
    float: right;
    .top-display{
      padding:16px 20px;
      .top-operate{
        text-align: right;
        margin-bottom:8px;
        span{
          margin-left:16px;
          cursor: pointer;
        }
        .edit{
          font-size: 13px;
          color: #5488F9;
          line-height: 18px;
        }
        .delete{
          font-size: 13px;
          color: #5488F9;
          line-height: 18px;
        }
        .remove{
          font-size: 16px;
        }
      }
      .title{
        font-size: 18px;
        color: #33475B;
        letter-spacing: 0;
        line-height: 25px;
        cursor: pointer;
        i{
          vertical-align: middle;
        }
      }
      .sender-desc{
        margin-top:8px;
        font-size: 13px;
        color: #7C98B6;
        letter-spacing: 0;
        line-height: 18px;
      }
      .receipt-desc{
        margin-top:10px;
        font-size: 13px;
        color: #7C98B6;
        line-height: 21px;
        span{
          color: #5488F9;
          cursor: pointer;
        }
      }
    }
    .email-content{
      background: #EAF0F6;
      padding:62px 26px 73px 41px;
      max-height: 639px;
      overflow-y: scroll;
      .content-image{
        overflow: hidden;
        max-height: 582px;
        .display-img{
          width:100%;
        }
      }
    }
  }
  .receipt-pop{
    .el-dialog{
      width:723px;
    }
    .el-dialog__header{
      padding-bottom:13px;
      border: 1px solid #DFE3EB;
    }
    .el-dialog__body{
      padding:20px 20px 30px 20px;
      .topMenu{
        width: initial;
        margin-bottom:10px;
        .menu{
          margin-top:0px;
          li{
            margin-right:30px;
          }
        }
      }
      .receiverList_search{
        margin-top:6px;
        width:220px;
        float:right;
        .el-input__inner{
          height:28px;
        }
        .el-input-group__append{
          .el-button{
            padding: 7px 9px;
          }
        }
      }
      .receiverList{
        border: 1px solid #DFE3EB;
        .list-header{
          background: #F5F8FA;
          border-bottom: 1px solid #DFE3EB;
          li{
            padding:13px 0;
            font-weight: 600;
          }
        }
        .list-body{
          border-bottom: 1px solid #DFE3EB;
          li{
            padding:16px 0;
          }
        }
        .list-container{
          height: 302px;
          overflow-y: scroll;
        }
        .list-header,.list-body{
          overflow:hidden;
          li{
            float:left;
            border-right:1px solid #DFE3EB;
            font-size: 13px;
            color: #33475B;
            line-height: 18px;
            text-align: center;
          }
          li:last-child{
            border-right:none;
          }
          .source{
            width:193px;
          }
          .send_time{
            width:158px;
          }
          .open_time{
            width:158px;
          }
          .hit_time{
            width:150px;
          }
        }
        .receiver{
          height:202px;
        }
        .receiver_load{
          height:87px;
        }
      }
      .el-table{
        height: 346px;
        overflow-y: auto;
        .el-table__header-wrapper{
          .el-table__header{
            .is-leaf{
              background: #F5F8FA;
              height: 44px;
              .cell{
                background: #F5F8FA;
              }
            }
          }
          .el-table__body-wrapper{
            tr{
              height:49px;
            }
          }
        }
      }
    }
  }
</style>
