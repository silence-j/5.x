<template>
  <div class="xunpanchi">
    <div class="have-result input-contianer">
      <!--v-model.trim="inquireParams.keyword"-->
      <el-input placeholder="请输入关键词" ref="getValue" @keyup.enter.native="handClick(inquireParams)" style="height:60px;border-right: 0;" :maxlength="160">
        <el-button type="primary" slot="append" @click="handClick(inquireParams)" style="height:58px;width: 100px;background: #5488F9;border-radius: 0px 4px 4px 0;border: none;font-size: 16px;">搜索</el-button>
      </el-input>
    </div>
    <div  v-if="vipYes" style="font-size: 0;">
      <p class="comInquiry">专享询盘推荐
        <el-tooltip effect="dark" content="请在7天内及时处理" placement="top">
          <i class="icon-font">&#xe6ed;</i>
        </el-tooltip>
      </p>
      <!--<div class="navBotomtips">-->
        <!--<p class="navBh">VIP客户专享询盘<br></p>-->
        <!--<p class="navBp">请在7天内及时处理</p>-->
      <!--</div>-->
      <div v-if="noSearch" class="first-list">
        <newEnquiries @delTag="reloadEnquiryList" v-for="(item, index) in vipFirstList" :key="index" :data="item"></newEnquiries>
      </div>
      <div class="second-list">
        <newEnquiries @delTag="reloadEnquiryList" v-for="(item, index) in vipSecondList" :key="index" :data="item"></newEnquiries>
      </div>
      <div class="third-list">
        <newEnquiries @delTag="reloadEnquiryList" v-for="(item, index) in vipThirdList" :key="index" :data="item"></newEnquiries>
      </div>
    </div>

    <div v-if="enYes" style="margin-top:8px;margin-bottom: 30px">
      <p class="comInquiry" v-if="vipYes">普通询盘</p>
      <div v-if="noSearch" style="font-size: 0;">
        <div class="first-list">
          <newEnquiries @delTag="reloadEnquiryList" v-for="(item, index) in enquiriesFirstList" :key="index" :keyword="inquireParams.keyword" :data="item"></newEnquiries>
        </div>
        <div class="second-list">
          <newEnquiries @delTag="reloadEnquiryList" v-for="(item, index) in enquiriesSecondList" :key="index" :keyword="inquireParams.keyword" :data="item"></newEnquiries>
        </div>
        <div class="third-list">
          <newEnquiries @delTag="reloadEnquiryList" v-for="(item, index) in enquiriesThirdList" :key="index" :keyword="inquireParams.keyword" :data="item"></newEnquiries>
        </div>
      </div>
    </div>
    <p class="bottom-tip" style="margin:50px 0 100px 0px" v-if="!hasMore">暂无更多数据</p>
    <div v-if="loadingList" class="loading loading-circle bottom-loading"></div>
    <div class="no-data" v-if="!noSearch || noData">
      <div class="center-section">
        <img src="../../assets/img/monitor/noData.png">
        <div class="publish-over" style="margin-top: 10px;">
          <p style="font-size:14px;margin-top:20px">{{noSearch ? '暂无数据，请尝试更新询盘关键字' : '暂无搜索结果'}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import enquiriesAPI from '@/api/enquiriesAPI'
  import newEnquiries from './enquiriesPool/newEnquiries.vue'
  export default{
    data () {
      return {
        vipYes: false,
        enYes: false,
        viplist: [],
        vipFirstList: [],
        vipSecondList: [],
        vipThirdList: [],
        tVip1: 0,
        tVip2: 0,
        tVip3: 0,
        enquirieslist: [],
        enquiriesFirstList: [],
        enquiriesSecondList: [],
        enquiriesThirdList: [],
        total1: 0,
        total2: 0,
        total3: 0,
        loadingList: false,
        currentPage: 1,
        hasMore: true,
        commonIsNoData: false,
        serverLevel: 1,
        inquireParams: {
          page: 1,
          size: 10,
          keyword: ''
        },
        searchStatus: false,
        noData: false,
        noSearch: true,
        loading: false,
        allList: [],
        loadParams: {
          preVipNum: 0,
          preMicroNum: 0,
          preTradNum: 0,
          isPassStart: true
        }
      }
    },
    components: {
      newEnquiries
    },
    mounted () {
      this.serverLevel = window.localStorage.serverLevel
      let preload = Object.assign({ page: 1, size: 10 }, this.loadParams)
      this.getAllEnquireiesList(preload)
      /**
       * 当 权限 不是超级盈店 时候，隐藏询盘池，只展现官网询盘
       */
      window.onscroll = function () {
        if (this.getScrollTop() + this.getClientHeight() >= this.getScrollHeight() - 100) {
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            // 接口没有在pending
            if (!this.loadingList && this.hasMore && this.noSearch) {
              // 是否处于搜索状态
              if (this.searchStatus && this.hasMore) {
                this.inquireParams.page = this.currentPage
                this.getInquireList(this.inquireParams)
                return
              }
              let pre = Object.assign({ page: this.currentPage, size: 10 }, this.loadParams)
              this.getAllEnquireiesList(pre)
            } else {
              return
            }
          }, 100)
        }
      }.bind(this)
    },
    beforeDestroy () {
      window.onscroll = function () {}
    },
    methods: {
      getAllEnquireiesList (params) {
        this.loadingList = true
        enquiriesAPI.getAllEnquireiesList(params).then(res => {
          if (!res.data.code) {
            if (res.data.data.totalPages) {
              this.hasMore = res.data.data.totalPages + 1 > this.currentPage
            }
            this.currentPage += 1
            let records = res.data.data.records
            // 储存所有列表，用于重排
            if (params.page === 1) {
              this.allList = records
            } else {
              this.allList = this.allList.concat(records)
            }
            let vipList = []
            let enquiryList = []
            if (params.page === 1 && records.length === 0) {
              this.noData = true
            }
            records.forEach((n, i) => {
              if (n.type === 2) {
                this.vipYes = true
                vipList.push(n)
                this.loadParams.preVipNum ++
              } else if (n.type === 1) {
                this.enYes = true
                enquiryList.push(n)
                this.loadParams.preTradNum ++
              } else if (n.type === 0) {
                this.enYes = true
                enquiryList.push(n)
                this.loadParams.preMicroNum ++
              }
            })
            this.waterFullVip(vipList)
            this.waterFull(enquiryList)
            this.loadingList = false
          }
        })
      },
      handClick (params) {
        if (this.$refs.getValue.$refs.input.value === '') {
          // this.$message({message: '询盘池关键字不能为空', type: 'error'})
          this.$message.error('询盘池关键字不能为空')
          return
        }
        this.vipYes = false
        this.hasMore = true
        this.searchStatus = true
        params.page = 1
        this.currentPage = 1
        params.keyword = this.$refs.getValue.$refs.input.value
        this.enquiriesFirstList = []
        this.enquiriesSecondList = []
        this.enquiriesThirdList = []
        this.getInquireList(params)
      },
      getInquireList (params) {
        this.noData = false
        this.noSearch = true
        this.loadingList = true
        enquiriesAPI.getCommonEnquiriesInquire(params).then(res => {
          if (!res.data.code) {
            if (res.data.data.totalPages) {
              this.noSearch = true
              this.hasMore = res.data.data.totalPages > this.currentPage
            } else {
              this.noSearch = false
              this.loadingList = false
            }
            this.currentPage += 1
            let records = res.data.data.records
            // 储存所有列表，用于重排
            if (params.page === 1) {
              this.allList = records
            } else {
              this.allList = this.allList.concat(records)
            }
            let vipList = []
            let enquiryList = []
            if (params.page === 1 && records.length === 0) {
              this.noData = true
            }
            records.forEach((n, i) => {
              if (n.type === 2) {
                this.vipYes = true
                vipList.push(n)
                this.loadParams.preVipNum ++
              } else if (n.type === 1) {
                this.enYes = true
                enquiryList.push(n)
                this.loadParams.preTradNum ++
              } else if (n.type === 0) {
                this.enYes = true
                enquiryList.push(n)
                console.log(this.enquiryList)
                this.loadParams.preMicroNum ++
              }
            })
            this.waterFullVip(vipList)
            this.waterFull(enquiryList)
            this.loadingList = false
          }
        })
      },
      reList () {
        let vipList = []
        let enquiryList = []
        this.allList.forEach((n, i) => {
          if (n.type === 2) {
            this.vipYes = true
            vipList.push(n)
          } else {
            this.enYes = true
            enquiryList.push(n)
          }
        })
        this.total1 = 0
        this.total2 = 0
        this.total3 = 0
        this.enquiriesFirstList = []
        this.enquiriesSecondList = []
        this.enquiriesThirdList = []
        this.tVip1 = 0
        this.tVip2 = 0
        this.tVip3 = 0
        this.vipFirstList = []
        this.vipSecondList = []
        this.vipThirdList = []
        this.waterFullVip(vipList)
        this.waterFull(enquiryList)
        if (this.getScrollTop() + this.getClientHeight() >= this.getScrollHeight() - 100) {
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            // 接口没有在pending
            if (!this.loadingList && this.hasMore) {
              // 是否处于搜索状态
              if (this.searchStatus) {
                this.inquireParams.page = this.currentPage
                this.getInquireList(this.inquireParams)
                return
              }
              let pre = Object.assign({ page: this.currentPage, size: 10 }, this.loadParams)
              this.getAllEnquireiesList(pre)
            } else {
              return
            }
          }, 100)
        }
      },
      reloadEnquiryList (recommendId) {
        let index
        this.allList.forEach((n, i) => {
          if (n.data.recommendId === recommendId) {
            index = i
          }
        })
        this.allList.splice(index, 1)
        this.reList()
      },
      waterFullVip (arr) {
        let tVip1 = Number(this.tVip1)
        let tVip2 = Number(this.tVip2)
        let tVip3 = Number(this.tVip3)
        for (let item of arr) {
          /* item.type = 1 传统询盘  高 281
          ** item.type = 0 微询盘 高 320
          ** item.type = 2 VIP询盘 高 320
          */
          let itemHeight = 0
          if (item.type === 1) {
            itemHeight = 263
          } else {
            itemHeight = 320
          }
          let heightMin = Math.min(tVip1, tVip2, tVip3)
          if (heightMin === tVip1) {
            this.vipFirstList.push(item)
            tVip1 = tVip1 + itemHeight
          } else if (heightMin === tVip2) {
            this.vipSecondList.push(item)
            tVip2 = tVip2 + itemHeight
          } else if (heightMin === tVip3) {
            this.vipThirdList.push(item)
            tVip3 = tVip3 + itemHeight
          }
        }
        this.tVip1 = tVip1
        this.tVip2 = tVip2
        this.tVip3 = tVip3
      },
      waterFull (arr) {
        let total1 = Number(this.total1)
        let total2 = Number(this.total2)
        let total3 = Number(this.total3)
        for (let item of arr) {
          /* item.type = 1 传统询盘  高 281
          ** item.type = 0 微询盘 高 320
          ** item.type = 2 VIP询盘 高 320
          */
          let itemHeight = 0
          if (item.type === 1) {
            itemHeight = 263
          } else {
            itemHeight = 320
          }
          let heightMin = Math.min(total1, total2, total3)
          if (heightMin === total1) {
            this.enquiriesFirstList.push(item)
            total1 = total1 + itemHeight
          } else if (heightMin === total2) {
            this.enquiriesSecondList.push(item)
            total2 = total2 + itemHeight
          } else if (heightMin === total3) {
            this.enquiriesThirdList.push(item)
            total3 = total3 + itemHeight
          }
        }
        this.total1 = total1
        this.total2 = total2
        this.total3 = total3
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
      // 获取当前可视范围的高度
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
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/base.less';
  @import "../../assets/style/chance";
  .xunpanchi{
    .el-tooltip{
      cursor: pointer;
      color: #888888;
    }
    .no-result{
      width:800px;
      margin: 44px auto 44px;
    }
    .input-contianer{
      .el-input{
        .el-input__inner{
          height:60px;
          width:700px;
          .el-input-group__append{
            background-image: linear-gradient(90deg, #00B8CC 0%, #5488F9 100%);
          }
        }
        .el-input__inner:focus {
          border: 1px solid #5488F9;
          box-shadow: 0 0 1px 0 #5488F9;
        }
        .el-input__inner:hover {
          border: 1px solid #5488F9;
        }
      }
      .el-input .el-input-group__append{
        /*background: #5488F9;*/
        color:#fff;
      }
    }
    .have-result{
      width:800px;
      margin: 44px auto 44px;
      transition:All 2.0s ease-in-out;
    }
    .comInquiry{
      position: relative;
      text-align: center;
      margin: 30px 0 32px 0;
      color: #555;
      font-size: 14px;
    }
    .comInquiry:after, .comInquiry:before{
      content: '';
      display: block;
      position: absolute;
      top: 8px;
      height: 1px;
      width: 546px;
      background-color: #dee2ea;
    }
    .comInquiry:after{
      right: 0;
    }
    .comInquiry:before{
      left: 0;
    }
    .navBotomtips{
      margin: 30px 0 20px 0 ;
      text-align: center;
      .navBp{
        font-size: 12px;
        height: 17px;
        color: #888;
      }
      .navBh{
        font-size: 16px;
        color: #555;
        margin-bottom: 5px;
      }
    }
  }
  .micro_load{
    height: 700px;
    padding-top: 343px;
  }
  .loadbg(){
    background: #F5F8FA;
    .animation(loadingColor,1s,infinite);
  }
  .common_load_module{
    .top_info{
      .title{
        width: 153px;
        height: 22px;
        .loadbg()
      }
      .desc{
        width: 364px;
        height: 40px;
        .loadbg()
      }
      .classify{
        width: 277px;
        height: 20px;
        .loadbg()
      }
    }
    .bottom_opt{
      .time{
        width: 95px;
        height: 18px;
        .loadbg()
      }
    }
  }
  .micro_enquiries {
    display: inline-block;
    width: 100%;
    vertical-align: top;
    background: #fff;
  }
  .micro_enquiries.limitwidth{
    width: 780px;
  }
  .one-row-confine{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .one-row-confine-two{
    height: 20px;
    overflow: hidden;
  }
  .enquiries{
    .select-section{
      float: right;
      .select-container{
        .el-select{
          .el-input__inner{
            width:168px;
          }
        }
      }
    }
  }
  .first-list, .second-list, .third-list{
    width: 380px;
    display: inline-block;
    vertical-align: top;
  }
  .first-list, .second-list{
    margin-right: 30px;
  }
  .bottom-loading{
    margin: 40px auto;
  }
  .bottom-tip{
    font-size: 14px;
    text-align: center;
    color: #4f6d95;
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  .enquiries{
    padding:10px 20px;
    background: #fff;
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
    border-radius: 4px;
    font-size: 0px;
    color: #7C98B6;
    line-height: 18px;
    overflow:hidden;
    .select-section{
      display: inline-block;
      float: right;
    }
    .left_menu{
      display: inline-block;
      line-height: 24px;
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
