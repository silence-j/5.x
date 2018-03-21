<template>
  <div class="preview-container">
    <div class="pre-top">
      <span>预览模式</span>
      <el-button class="back" @click="backPrew">退出预览</el-button>
    </div>
    <div class="preview-nav">
      <div class="nav">
        <span class="nav-item icon-font mac" :class="btnType==='mac'?'active':''" @click="changeView" data-type="mac">&#xe611;</span>
        <span class="nav-item icon-font pad" :class="btnType==='pad'?'active':''" @click="changeView" data-type="pad">&#xe610;</span>
        <span class="nav-item icon-font phone" :class="btnType==='phone'?'active':''" @click="changeView" data-type="phone">&#xe60f;</span>
      </div>
    </div>
    <div style="background: #fff;padding-top: 40px">
      <div class="preview-template" :class="show ? 'preview1' : 'preview2'">
        <div class="preview-window" :class="contentType">
          <div v-if="btnType==='phone'" class="preview-main phone-main">
            <div class="phone-table" v-html="tableContent"></div>
          </div>
          <div v-else class="preview-main" v-html="tableContent"></div>
        </div>
      </div>
      <div class="preview-describe" v-if="show">
        <h2>邮件信息</h2>
        <p class="title">邮件标题:</p>
        <p class="content" :title="emailTitle">{{emailTitle}}</p>
        <p class="title">发件人:</p>
        <p class="content" :title="sender">{{sender}}</p>
        <p class="title" >收件人:</p>
        <p class="content list" style="cursor:pointer" @click="selReceiverInfo">查看收件人列表</p>
      </div>
    </div>
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
  </div>
</template>

<script>
  import emailMarketApi from '@/api/emailMarketApi'
  import Vue from 'vue'
  export default {
    name: '',
    data () {
      return {
        // 用来标记哪个按钮被点击
        btnType: 'phone',
        // 标记view的class
        contentType: 'phonewindow',
        // 从内容编辑页面存储的DOM数组，在这个页面重新渲染
        tableContent: '',
        deleteConfig: {
          theme: '', // 弹框标题
          visible: false,   // 是否展示弹框
          notice: '',       // 弹框内容
          sureText: '删除',   // 按钮描述
          cancelText: '取消',
          callback: null,
          isLoading: false
        },
        show: false,
        receiptPop: false,
        selectedSubNav: 0,
        emailTitle: '',
        sender: '',
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
        searchText: '',
        isListLoading: true,
        receiptData: [],
        totalpages: 1,
        page: 1,
        pageSize: 10,
        ishaveData: true,
        totalCount: 0,
        arriveCount: 0,
        readCount: 0,
        hitCount: 0
      }
    },
    computed: {
      activityTable () {
        return this.$store.state.develop.activitySendInfo.second
      },
      emailTable () {
        return this.$store.state.develop.sendInfo.third
      },
      previewTable () {
        return this.$store.getters.previewTable
      }
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
    mounted: function () {
      window.onbeforeunload = function (e) {
        var dialogText = '预览信息可能会发生改变, 是否继续?'
        e.returnValue = dialogText
        return dialogText
      }
      console.log(this.$route.query)
      if (this.$route.query.type === 1 || this.$route.query.type === '1') {
        this.show = true
        this.getReceiverStatisFunc(this.$route.query.mailMarketingId)
        this.getReceiverStatis(this.$route.query.mailMarketingId)
      } else if (this.$route.query.type === '2') {
        this.show = false
      }
      // console.log(this.$store.state.develop.activitySendInfo.second)
      this.tmplType = localStorage.getItem('tmplType')
      // activityTmpl: 活动table; previewTmpl: 模版预览;  其他邮件
      if (this.tmplType === 'activityTmpl') {
        this.tableContent = this.activityTable
      } else if (this.tmplType === 'previewTmpl') {
        this.tableContent = this.previewTable
      } else {
        this.tableContent = this.emailTable
      }
    },
    methods: {
      // 点击退出预览
      backPrew () {
        window.history.go(-1)
        this.$store.commit('DEVELOP_ACTIVITYSENDINFO', {first: {}, second: '', third: {}, four: {}})
      },
      changeView (e) {
        this.btnType = e.target.dataset.type
        this.contentType = `${e.target.dataset.type}window`
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
      getReceiverStatis (id) {
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
      // 收件人列表数据统计
      getReceiverStatisFunc (id) {
        let params = {
          mailMarketingId: id
        }
        emailMarketApi.getMarketDetail(params).then(res => {
          if (res.data.code === 0) {
            let staticData = res.data.data
            this.tableContent = staticData.content
            this.emailTitle = staticData.title
            this.sender = staticData.sender
          } else {
            this.$message.error(res.data.message)
          }
        })
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
      // 收件人列表数据
      getReceiverListFunc () {
        if (!this.isLoadIng) {
          this.isLoadIng = true
//          let id = this.marketInfo.id
          this.isListLoading = true
          this.ishaveData = true
          let params = {
            mailMarketingId: this.$route.query.mailMarketingId,
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
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import '../../../assets/style/nav/subNav';
  .preview-container{
    margin-top: -60px;
    z-index: 100;
    .pre-top{
      height: 63px;
      line-height: 63px;
      padding: 0 30px;
      font-size: 14px;
      color: #333333;
      background: #fff;
      .back{
        position: absolute;
        right: 20px;
        top: 16px
      }
    }
    .preview-nav{
      background: rgb(238, 239, 246);
      text-align: center;
      .nav{
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: space-around;
        width: 182px;
        height: 34px;
        padding: 0 15px;
        margin-top: 30px;
        margin-bottom: 25px;
        box-sizing: border-box;
        border-left: 1px solid #b0c1d3;
        border-right: 1px solid #b0c1d3;
        .nav-item{
          color: #1d98b6;
          cursor: pointer;
        }
        .mac{
          font-size: 26px;
          padding-top: 3.5px;
        }
        .pad{
          font-size: 21px;
          padding-top: 5px;
        }
        .phone{
          font-size: 19px;
          padding-top: 6.5px;
        }
        .active{
          color: #5488f9;
        }
      }
    }
    .preview1{
      width:70%;
    }
    .preview2{
      width:100%;
    }
    .preview-template{
      position: relative;
      /*left: calc(~"-50vw + 600px");*/
      /*width: 99.6vw;*/
      display: inline-block;
      min-height: calc(~"100vh - 116px");
      /*background-color: #fff;*/
      text-align: center;
      .preview-window{
        i{
          font-style: italic;
        }
        h1{
          font-size: 2em;
        }
        h2{
          font-size: 1.5em;
        }
        h3{
          font-size: 1.17em;
        }
        h4{
          font-size: 1em;
        }
        h5{
          font-size: 0.83em;
        }
        h6{
          font-size: 0.67em;
        }
        ol{
          padding-left: 20px;
          li{
            list-style: decimal;
          }
        }
        ul{
          padding-left: 20px;
          li{
            list-style: disc;
          }
        }
      }
      .phonewindow{
        position: relative;
        margin: 0 auto;
        width: 420px;
        height: 884px;
        background: url(../../../assets/img/develop/iphone.png) no-repeat;
        background-size: 100%;
        padding-bottom: 220px;
        .img-text{
          transform: scale(0.8)
        }
        ::-webkit-scrollbar{
          width: 3px;
          height: 3px;
        }
        .preview-main{
          width: 100%;
          overflow-y: scroll;
          position: absolute;
          width: calc(~"100% - 62px");
          top: 101px;
          left: 33px;
          max-height: 668px;
          ::-webkit-scrollbar{
            width: 3px;
            height: 3px;
          }
        }
      }
      .padwindow{
        position: relative;
        margin: 0 auto;
        width: 640px;
        height: 1172px;
        background: url(../../../assets/img/develop/ipad.png) no-repeat;
        background-size: 100%;
        padding-bottom: 167px;
        ::-webkit-scrollbar{
          width: 3px;
          height: 3px;
        }
        .preview-main{
          width: 100%;
          overflow-y: scroll;
          position: absolute;
          width: calc(~"100% - 92px");
          top: 101px;
          left: 49.5px;
          max-height: 700px;
        }
        .phone-main{
          max-height: 980px;
          height: 980px;
          width: 550px;
          -webkit-transform: scale(0.8);
          transform: scale(0.65);
          top: -68px;
          left: -63px;
        }
      }
      .macwindow{
        position: relative;
        margin: 0 auto;
        /*width: 1200px;*/
        padding-bottom: 30px;
        background-color: #ffffff;
        padding: 40px 0;
        .preview-main{
          position: static;
          width: 100%;
        }
      }
    }
    .preview-describe{
      width: 29%;
      box-sizing: border-box;
      border-left:1px solid  #D8D8D8;
      height: 720px;
      display: inline-block;
      vertical-align: top;
      padding-left:20px;
      h2{
        font-size: 24px;
      }
      p{
        font-size:14px;
        color: #333;
      }
      .title{
        margin-top: 30px;
      }
      .content{
        margin-top: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 18px;
      }
      .list{
        color: #5488F9;
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
            .limit{
              overflow: hidden;
              text-overflow: ellipsis;
            }
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
