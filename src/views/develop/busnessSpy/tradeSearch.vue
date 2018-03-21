<template>
  <div class="trade-container">
    <router-link to="/tradeDetect">
      <p class="title">
        <span><img src="../../../../src/assets/img/left.png" alt="" class="left-back" /></span>
        返回  外贸侦探</p>
    </router-link>
    <div class="key-name"><span>{{keyName}}</span> <span>({{length}})</span> </div>
    <ul v-show="isLoading" style="overflow: hidden">
      <li class="loading-trade" v-for="item in 9">
        <div class="loading-card">
          <p class="loading-title"></p>
          <p class="loading-name"></p>
          <p class="loading-info"></p>
          <p class="loading-to"></p>
          <p class="loading-to"></p>
          <p class="loading-desc"></p>
        </div>
        <div class="loading-operation"></div>
      </li>
    </ul>
    <div class="showInfo" v-if="!isLoading">
      <!--暂无搜索结果-->
      <div class="no-data" v-if="length === 0 && !isLoading">
        <div class="no-search">
          <img src="../../../assets/img/monitor/no-post.png" alt="">
          <br>
          <br>
          <p>暂无搜索结果</p>
        </div>
      </div>
      <tradeResult :searchResult="companyList" :isMore="isMore" @changeTotal="changeLength" v-else></tradeResult>
    </div>
  </div>
</template>
<script>
  import DevelopAPI from '@/api/developAPI'
  import tradeResult from './tradeResult.vue'
  import Util from '@/common/Util.js'
  export default{
    name: 'tradeSearch',
    beforeRouteLeave (to, from, next) {
      window.onscroll = function () {
        return
      }
      next()
      console.log('to: ' + to.path)
      console.log('from: ' + from.path)
    },
    data () {
      return {
        isLoading: true,
        taskId: this.$route.query.taskId,
        keyName: this.$route.query.taskName,
        length: 0,
        companyList: [],
        page: 1,
        pageSize: 12,
        isMore: false,
        oldScrollHeight: document.body.scrollHeight, // 初始高度
        scrollHeight: 0,
        clientHeight: document.documentElement.clientHeight,
        scroll: false,
        showBox: false,
        show: false,
        config: {
          visible: false
        }
//        isAgainst: 0
      }
    },
    computed: {

    },
    components: {
      tradeResult
    },
    mounted () {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        taskId: this.taskId
      }
      this.getCompanyList(params)
      // 把taskname存进locastorage中
      localStorage.setItem('taskName', this.$route.query.taskName)
      let _this = this
      window.onscroll = function () {
        if ((_this.getScrollTop() + _this.getClientHeight()) >= (_this.getScrollHeight()) + 50) {
          console.log('POPO')
          if (!this.isMore) {
            _this.loadData()
          }
        }
      }
    },
    watch: {
    },
    methods: {
      loadData () {
        if (this.totalPage < this.page + 1) {
          return
        } else {
          this.page++
          this.getCompanyList({page: this.page, pageSize: this.pageSize, taskId: this.taskId})
        }
      },
      changeLength () {
        this.length--
      },
      getCompanyList (params) {
        this.isMore = true
        DevelopAPI.getCompanyList(params).then(res => {
          if (!res.data.code) {
            this.isLoading = false
            this.isMore = false
            let List = this.companyList
            let curList = res.data.data.records
            res.data.data.records.forEach((res) => {
              res.website = Util.checkUrl(res.website)
            })
            this.companyList = List.concat(curList)
            this.length = res.data.data.totalCount
            this.totalPage = res.data.data.totalPages
          }
        })
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
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../assets/style/variable";
  @import "../../../assets/style/base";
  .trade-container{
    width:1200px;
    margin: 0 auto;
    .title{
      margin: 20px 0 16px;
      font-size: 13px;
      color: #7C98B6;
    }
    .key-name{
      font-size: 16px;
      color: #4F6D95;
      margin-bottom: 30px;
    }
    .loading-trade{
      .animation(loadingColor,1s,infinite);
      width:380px;
      /*overflow: hidden;*/
      background: #FFFFFF;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
      border-radius: 4px;
      float: left;
      margin-right: 30px;
      margin-bottom: 20px;
      .loading-card{
        width:245px;
        padding: 30px 20px;
        .loading-title{
          width:100%;
          height: 20px;
          background: #F5F8FA;
          border-radius: 2px;
        }
        .loading-name{
          width:140px;
          height: 14px;
          background: #F5F8FA;
          border-radius: 2px;
          margin-top: 8px;
        }
        .loading-info{
          width:180px;
          height: 14px;
          background: #F5F8FA;
          border-radius: 2px;
          margin-top: 20px;
        }
        .loading-to{
          width:100px;
          height: 14px;
          background: #F5F8FA;
          border-radius: 2px;
          margin-top: 8px;
        }
        .loading-desc{
          width:100%;
          height: 38px;
          background: #F5F8FA;
          border-radius: 2px;
          margin-top: 20px;
        }
      }
      .loading-operation{
        width:285px;
        height: 40px;
        background: #F5F8FA;
      }

    }
    .loading-trade:nth-child(3n){
      margin-right: 0px;
    }
    .showInfo{
      overflow: hidden;
    }
  }

</style>
