<template>
  <div class="social-media-container" >
    <div class="time-line" v-if="socialMediaList.length"></div>
    <div class="time-line-header">
      <div class="now-month-year" v-if="socialMediaList.length">
        {{topMonthText || ''}}
      </div>
      <div class="btns-wraper" v-if="socialMediaList.length || filterCondition!==-1">
        <div class="longxi-btn" :class="{active: filterCondition === -1}" @click="checkCondition(-1)"> 全部</div>
        <div class="longxi-btn" :class="{active: filterCondition === 0}" @click="checkCondition(0)">Facebook</div>
        <div class="longxi-btn" :class="{active: filterCondition === 1}" @click="checkCondition(1)">采购记录</div>
      </div>
    </div>
    <div class="time-line-items" v-if="pageWrap.page!==0">
      <div class="time-line-item" v-for="(smItem, index) in socialMediaList" :key="index" @click="viewCompanyInfo(smItem)">
        <div class="time-line-date">
          <timelineDate :type="smItem.type" :social-media-item="smItem"></timelineDate>
          <div class="blue-circle"></div>
        </div>
        <div class="time-line-item-content social-media-boxshadow">
          <template v-if="smItem.type === 1">
            <PurchaseRecordItem :social-media-item="smItem"></PurchaseRecordItem>
          </template>
          <template v-if="smItem.type === 0">
            <FacebookPostItemfrom :social-media-item="smItem"></FacebookPostItemfrom>
          </template>
        </div>
      </div>
      <div class="social-media-empty" v-if="!dataLoading && !socialMediaList.length">
          <img src="../../../assets/img/monitor/social-noData.png">
          <br>
          <br>
          暂无数据
      </div>
      <!-- 右边 公司详情 -->
      <CompanyInfo id="c-info-wraper"  :class="{'company-fixed': companySectionfixed}" :style="fixedStyle" v-if="socialMediaList.length > 0"></CompanyInfo>
    </div>
  </div>
</template>

<script>
  import SocialMediaAPI from '@/api/socialMedia'
  import CompanyInfo from './cpnts/companyInfo'
  import timelineDate from './cpnts/timelineDate'
  import PurchaseRecordItem from './cpnts/purchaseRecordItem'
  import FacebookPostItemfrom from './cpnts/facebookPostItem'
  export default{
    data () {
      return {
        /**
         * 时间线数据
         * @type {Array}
         */
        socialMediaList: [],
        /**
         * 头部 九月 2017
         * @type {String}
         */
        topMonthText: '',
        /**
         * 数据加载中
         * @type {Boolean}
         */
        dataLoading: false,
        /**
         * 全部 -1 ,facebook 0,采购记录1  。筛选按钮
         * @type {Number}
         */
        filterCondition: -1,
        /**
         * 下拉刷新分页
         * @type {Object}
         */
        pageWrap: {
          page: 0,
          size: 10,
          totalPages: 1
        },
        /**
         * 公司详情样式
         * @type {Boolean}
         */
        companySectionfixed: false,
        fixedStyle: ''
      }
    },
    destroyed () {
      window.onscroll = function () {}
    },
    mounted () {
      this.getSocialMediaList()
      this.getMonth()
      /**
       * 下拉加载
       * @return {[type]} [description]
       */
      window.onscroll = function () {
        /**
         * 如果详细滑动超过150像素 ,增加company-fixed 类
         */
        if (this.getScrollTop() > 130) {
          this.companySectionfixed = true
        } else {
          this.companySectionfixed = false
        }
        if (this.getScrollTop() + this.getClientHeight() >= this.getScrollHeight()) {
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            // 接口没有在pending
            if (!this.dataLoading) {
              console.log('下拉加载')
              this.getSocialMediaList()
            } else {
              return
            }
          }, 100)
        }
      }.bind(this)
    },
    computed: {
    },
    watch: {
    },
    methods: {
      /**
       * 拿到头部年月信息
       * @return {[type]} [description]
       */
      getMonth: function () {
        let date = new Date()
        let month = date.getMonth()
        let zhMonth = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
        this.topMonthText = zhMonth[month] + '月 ' + date.getFullYear()
      },
      /**
       * 查看公司信息 是facebook的社媒监控才可以点击
       * @return {[type]} [description]
       */
      viewCompanyInfo: function (smitem) {
        let content = JSON.parse(smitem.content)
        if (smitem.type === 0) {
          this.$store.dispatch('getCompanyInfo', {pubId: content.pubId})
        } else {
          console.log('点击的是采购记录，没有公司信息')
        }
      },
      /**
       * 过滤条件
       */
      checkCondition: function (condition) {
        this.filterCondition = condition
        this.socialMediaList = []
        this.pageWrap.page = 0
        this.pageWrap.totalPages = 1
        this.$store.commit('SET_SOCIALMEDIA_COMPANYINFO', {})
        this.getSocialMediaList()
      },
      /**
       * 请求数据
       */
      getSocialMediaList: function () {
        if (this.pageWrap.page >= this.pageWrap.totalPages) {
          console.log('数据已加载完毕了')
          return
        } else {
          this.pageWrap.page ++
        }
        this.dataLoading = true
        SocialMediaAPI.list({type: this.filterCondition, size: this.pageWrap.size, page: this.pageWrap.page, paging: true}).then(res => {
          this.dataLoading = false
          if (!res.data.code) {
            this.socialMediaList = this.socialMediaList.concat(res.data.data.records)
            // this.pageWrap.page = res.data.data.page
            this.pageWrap.totalPages = res.data.data.totalPages
            /**
             * 请求完列表数据后，如果发现第一条数据是facebook数据， 则加载公司数据
             * @param  {[type]} this.socialMediaList[0].type [description]
             * @return {[type]}                              [description]
             */
            if (this.socialMediaList.length > 0 && this.socialMediaList[0].type === 0) {
              this.viewCompanyInfo(this.socialMediaList[0])
            }
          }
        })
      },
      // 获取滚动条当前的位置
      getScrollTop () {
        let scrollTop = 0
        if (document.documentElement && document.documentElement.scrollTop) {
          scrollTop = document.documentElement.scrollTop
        } else if (document.body) {
          scrollTop = document.body.scrollTop
        }
        return scrollTop
      },
      // 获取当前可是范围的高度
      getClientHeight () {
        let clientHeight = 0
        if (document.body.clientHeight && document.documentElement.clientHeight) {
          clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
        } else {
          clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
        }
        return clientHeight
      },
      // 获取文档完整的高度
      getScrollHeight () {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
      }
    },
    components: {
      CompanyInfo,
      timelineDate,
      FacebookPostItemfrom,
      PurchaseRecordItem
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .social-media-container{
    position: relative;
    margin-bottom: 30px;
    .time-line-header{
      width:775px;
      height: 20px;
      padding-left:100px;
      box-sizing: border-box;
      position: relative;
      margin-top:29px;
      .now-month-year{
        font-size: 20px;
        color: #33475B;
        display: inline-block;
      }
      .btns-wraper{
        vertical-align: bottom;
        display: inline-block;
        position:absolute;
        right: 0;
        bottom:0;
        font-size: 0;
        .longxi-btn{
          display: inline-block;
          width:80px;
          height: 30px;
          font-size: 13px;
          color: #33475B;
          letter-spacing: 0;
          background: #FFFFFF;
          text-align: center;
          line-height: 30px;
          border: 1px solid #CBD6E3;
          cursor:pointer;
          &.active{
            background: #5488F9;
            border: 1px solid #5488F9;
            color:white;
          }
          &.active:hover{
            background: rgb(118, 160, 250);
          }
          &:last-child{
            border-radius:0 4px 4px  0;
            border-left:none;
          }
          &:first-child{
            border-radius: 4px 0 0 4px;
            border-right:none;
          }

        }
      }
    }
    .time-line{
      border-left:1px solid #B0C1D4;
      min-height:98%;
      position: absolute;
      left:60px;
      width:1px;
    }

    .time-line-item{
      width:775px;
      position: relative;
      margin-top:40px;
      &:first-child{
        margin-top:10px;
      }
      .time-line-date{
        display: inline-block;
        vertical-align: top;
        width: 100px;
        position: relative;
        font-size: 13px;
        color: #556F8A;
        letter-spacing: 0;
        padding-top:20px;
        .blue-circle{
          position: absolute;
          left:50px;
          top:20px;
          width:20px;
          height: 20px;
          background: #5488F9;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(84, 136, 249, 0.50);
        }
      }
      .time-line-item-content{
        background: white;
        width:669px;
        min-height: 197px;
        display: inline-block;
        padding:20px 30px 10px 30px;
        box-sizing: border-box;
        border:1px solid rgba(84, 136, 249, 0);
        &:hover{
          background: #F5F8FA;
          border:1px solid rgba(84, 136, 249, 0.20);
        }
      }
    }
  }
  .social-media-boxshadow{
    overflow: hidden;
    background: white;
    border-radius: 4px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
  }
  .social-media-empty{
    text-align: center;
    margin-top:50px;
    padding-top: 100px;
  }
  .company-fixed{
    position:fixed;
    top: 50px;
  }
</style>
