<template>
  <div class="search-info">
    <el-input
      class="social-input"
      v-model="searchFor"
      icon="search"
      placeholder="请输入关键词"
      :on-icon-click="handClickIcon"
      @keyup.enter.native="handClickIcon">
    </el-input>
    <img class="tip-img" src="../../../assets/img/develop/soical_bg.png" alt="" v-if="searchLoading">
    <div v-else>
      <ul class="sercher-menu margintop30">
        <li :class="{'curr' : typeIndex == '0'}" @click="changeType('0')"><i class="icon">&#xe6d9;</i>Facebook</li>
        <li :class="{'curr' : typeIndex == '1'}" @click="changeType('1')"><i class="icon-twitter-two"></i>Twitter</li>
      </ul>
      <div class="recommend-fc-list" v-if="typeIndex=='0' && recommendListIsShow">
        <div class="search-content" >
          <!--搜索结果小卡片-->
          <ul>
            <li class="info-social" v-if="recommendFcList.length > 0" v-for="item in recommendFcList">
              <em class="icon-font boder" @click="addCompany(item, $event)" v-if="item.isAdded==0">&#xe6ad;联系人</em>
              <em class="icon-eye add" @click="linkCompany(item)" v-else></em>
              <!--上部显示-->
              <div class="person-info">
                <!--头像部分-->
                <div class="head-info">
                  <div class="name-info limit" style="padding-left:0;">
                    <p class="topdesc">
                      <a :href="item.link" target="_blank" class="double_desc" :title="item.name">{{item.name}}</a>
                    </p>
                    <p class="icon-data">
                      <em class="icon-font fb" style="margin-right:5px;">&#xe6d9;</em>
                      <span class="data">Facebook</span>
                    </p>
                  </div>
                </div>
              </div>
              <!--横线部分-->
              <p class="line"></p>
              <!--industry-->
              <p class="describe" >
                <span v-if="item.intro !== null && item.intro !==''" :title="item.intro">{{item.intro}}</span>
                <span v-else="" class="no-desc">暂未添加任何简介</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="bottom-separated">Beta</div>
      </div>
      <!--推荐fc加载end-->
      <!--搜素加载页-->
      <ul v-show="socialSearchLoad">
        <li class="social-loading" v-for="item in number">
          <div class="social-top">
            <p class="social-top-left c-bg-load"></p>
            <p class="social-top-left-right">
              <span class="c-bg-load"></span>
              <span class="c-bg-load"></span>
            </p>
          </div>
          <div class="social-bottom">
            <p class="social-bottom-model c-bg-load"></p>
            <p class="social-bottom-model c-bg-load"></p>
          </div>
        </li>
      </ul>
      <!--facebook-->
      <div class="cont-all" v-show="typeIndex=='0' && !socialSearchLoad">
        <!--暂无搜索结果-->
        <div class="no-data" v-if="fbIsData">
          <div class="no-search">
            <img src="../../../assets/img/monitor/no-post.png" alt="">
            <p>暂无搜索结果</p>
          </div>
        </div>
        <socialList :searchList="facebookSearchInfo" :recordLess="lessRecord" @refresh="handClickIcon" v-else></socialList>
      </div>
      <!--twitter-->
      <div class="cont-all" v-show="typeIndex=='1' && !socialSearchLoad">
        <!--暂无搜索结果-->
        <div class="no-data" v-if="twIsData">
          <div class="no-search">
            <img src="../../../assets/img/monitor/social-noData.png" alt="">
            <p>暂无搜索结果</p>
          </div>
        </div>
        <socialList :searchList="twitterSearchInfo" :recordLess="lessRecord" @refresh="handClickIcon" v-else></socialList>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import exploreAPI from '@/api/exploreAPI'
  import socialList from './socialList.vue'
  export default{
    name: '',
    data () {
      return {
        fbIsData: false,
        twIsData: false,
        searchFor: this.$route.query.searchText,
        listIsLoad: false,
        socialSearchLoad: true,
        lessRecord: true,
        facebookSearchInfo: {
          socialType: '0',
          socialList: [],
          isMore: true,  // fabook是否有数据
          isLoad: false
        },
        twitterSearchInfo: {
          socialType: '1',
          socialList: [],
          isMore: true,  // twitter是否有数据
          isLoad: false
        },
        page: 1,
        number: 9,
        userId: window.localStorage.userId,
        typeIndex: '0',
        fbNextPage: 1,
        twNextPage: 1,
        facebookNext: '',
        oldScrollHeight: document.body.scrollHeight, // 初始高度
        scrollHeight: 0,
        clientHeight: document.documentElement.clientHeight,
        recommendloadStatus: 1,  // 0不加载1正在加载2加载成功4加载失败
        recommendListIsShow: false,
        recommendFcList: [],
        isNext: true,
        searchLoading: true
      }
    },
    computed: {
      searchPage () {
        this.page = this.$store.getters.searchPage
        return this.$store.getters.searchPage
      }
    },
    components: {
      socialList
    },
    mounted () {
      let _this = this
      window.onscroll = function () {
        if ((_this.getScrollTop() + _this.getClientHeight()) >= (_this.getScrollHeight() + 50)) {
          _this.loadData(_this.typeIndex)
        }
      }
    },
    watch: {
    },
    methods: {
      backToDev () {
        let curShow = true
        this.$router.push({
          path: '/develop',
          query: {
            typeOf: curShow
          }
        })
      },
      // 搜索结果类型切换
      changeType (index) {
        if (index === '0' && this.facebookSearchInfo.isMore === true) {
          this.lessRecord = true
        } else {
          this.lessRecord = false
        }
        if (index === '1' && this.twitterSearchInfo.isMore === true) {
          this.lessRecord = true
        } else {
          this.lessRecord = false
        }
        if (this.typeIndex === index) {
        } else {
          this.typeIndex = index
        }
        if (this.typeIndex === '0' && this.facebookSearchInfo.socialList.length === 0) {
          this.socialSearchLoad = true
          let params = {keywords: this.searchFor, platform: 0, pageNext: 1, pageSize: 9, isTwitterNext: 1}
          this.searchCompanyFunc(params, 'facebook')
        } else if (this.typeIndex === '1' && this.twitterSearchInfo.socialList.length === 0) {
          this.socialSearchLoad = true
          let paramstwo = {keywords: this.searchFor, platform: 1, pageNext: 1, pageSize: 9, isTwitterNext: 1}
          this.searchCompanyFunc(paramstwo, 'twitter')
        }
      },
//      点击按钮
      handClickIcon () {
//        this.page = 1
        this.isNext = true
        if (this.searchFor !== '' && this.searchFor !== null && !this.searchFor.match(/^[ ]+$/)) {
          this.searchFor = this.searchFor.trim()
          this.searchLoading = false
          this.facebookSearchInfo.socialList = []
          this.twitterSearchInfo.socialList = []
          this.fbIsData = false
          this.twIsData = false
          this.listIsLoad = false
          this.socialSearchLoad = true
          this.facebookSearchInfo.isMore = true
          this.facebookSearchInfo.isLoad = true
          this.twitterSearchInfo.isMore = true
          this.twitterSearchInfo.isLoad = true
          this.scrollHeight = 0
          this.fbNextPage = 1
          this.twNextPage = 1
          this.scrollHeight = this.getScrollHeight() - 255
          this.$store.commit('DEVELOP_SEARCH_PAGE', {page: this.page})
          window.location.hash = 'develop?searchText=' + this.searchFor
          if (this.typeIndex === '0') {
            let params = {keywords: this.searchFor, platform: 0, pageNext: 1, pageSize: 9, isTwitterNext: 1}
            this.searchCompanyFunc(params, 'facebook')
          } else if (this.typeIndex === '1') {
            let paramstwo = {keywords: this.searchFor, platform: 1, pageNext: 1, pageSize: 9, isTwitterNext: 1}
            this.searchCompanyFunc(paramstwo, 'twitter')
          }
//          this.getFbRecommendFunc()
        } else {
          this.$message.error('搜索关键字不能为空')
        }
      },
      // 添加推荐facebook联系人
      addCompany (item, event) {
        let target = event.target
        let dqclass = target.getAttribute('class')
        if (dqclass.indexOf('icon-font') >= 0) {
          let sociaes = [{
            platform: 0,
            url: item.link
          }]
          let params = {
            firstName: item.name,
            createSource: 'recommend_search_create',
            sociaes: JSON.stringify(sociaes)
          }
          exploreAPI.addPpc(params).then(res => {
            if (res.data.code === 0) {
              this.$store.commit('FIND_COMPANYID', {companyId: res.data.data.personId})
              target.setAttribute('class', 'icon-eye add')
              target.innerHTML = ''
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          let type = 0
          this.$router.push({
            path: '/contactDetail',
            query: {
              contactId: this.$store.getters.companyId || item.contactId,
              contactType: type
            }
          })
        }
      },
      linkCompany (item) {
        this.$router.push({
          path: '/contactDetail',
          query: {
            contactId: item.contactId,
            contactType: 0
          }
        })
      },
      // 查询数据方法
      searchCompanyFunc (val, stye) {
        if (this.isNext === false && stye === 'facebook') {
          return
        } else {
          exploreAPI.searchCompany(val).then(res => {
            this.listIsLoad = false
            if (res.data.code === 0) {
              //            this.socialSearchLoad = false
              if (stye === 'facebook') {
                if (res.data.data.facebookNext === null || res.data.data.facebookNext === '' || res.data.data.facebookNext === undefined) {
                  this.isNext = false
                }
                let socialList = this.facebookSearchInfo.socialList
                this.facebookNext = res.data.data.facebookNext
                console.log('pp')
                console.log(this.facebookNext)
                let reslist = res.data.data.records
                this.facebookSearchInfo.socialList = socialList.concat(reslist)
                if (res.data.data.records.length < 9) {
                  this.facebookSearchInfo.isMore = false
                  this.lessRecord = false
                } else {
                  this.facebookSearchInfo.isMore = true
                  this.facebookSearchInfo.isLoad = true
                  this.fbNextPage = this.fbNextPage + 1
                }
                this.facebookSearchInfo.isLoad = false
                if (reslist.length === 0 && this.fbNextPage === 1) {
                  this.fbIsData = true
                }
                Vue.nextTick(() => {
                  this.socialSearchLoad = false
                  this.scrollHeight = document.body.scrollHeight - 255 // 数据加载高度
                })
              } else {
                let socialList = this.twitterSearchInfo.socialList
                let reslist = res.data.data.records
                this.twitterSearchInfo.socialList = socialList.concat(reslist)
                if (reslist.length < 9) {
                  this.twitterSearchInfo.isMore = false
                  this.lessRecord = false
                } else {
                  this.twitterSearchInfo.isMore = true
                  this.twitterSearchInfo.isLoad = true
                  this.twNextPage = this.twNextPage + 1
                }
                this.twitterSearchInfo.isLoad = false
                if (reslist.length === 0 && this.twNextPage === 1) {
                  this.twIsData = true
                }
                Vue.nextTick(() => {
                  this.socialSearchLoad = false
                  this.scrollHeight = document.body.scrollHeight - 255 // 数据加载高度
                })
              }
            } else {
              this.$message.warning(res.data.message)
            }
          })
        }
      },
      loadData (type) {
        if (!this.listIsLoad) {    // 控制一个加载完了另外一个才能加载
          if ((type === '0' || type === '3') && this.facebookSearchInfo.isMore && !this.facebookSearchInfo.isLoad) {    // facebook数据则加载
            this.facebookSearchInfo.isLoad = true
            this.listIsLoad = true
            // this.fbNextPage = this.fbNextPage + 1
            if (this.fbNextPage > 1) {
              let params = {
                keywords: this.searchFor,
                platform: 0,
                pageNext: this.fbNextPage,
                pageSize: this.number,
                isTwitterNext: 1,
                userId: this.userId,
                facebookNext: this.facebookNext
              }
              console.log('****')
              console.log(this.facebookNext)
              this.searchCompanyFunc(params, 'facebook')
            } else {
              this.listIsLoad = false
            }
          } else if ((type === '1' || type === '3') && this.twitterSearchInfo.isMore && !this.twitterSearchInfo.isLoad) {    // twitter数据加载
            this.twitterSearchInfo.isLoad = true
            this.listIsLoad = true
//            this.lessRecord = true
            // this.twNextPage = this.twNextPage + 1
            if (this.twNextPage > 1) {
              let params = {
                keywords: this.searchFor,
                platform: 1,
                pageNext: this.twNextPage,
                pageSize: this.number,
                isTwitterNext: 1,
                userId: this.userId
              }
              this.searchCompanyFunc(params, 'twitter')
            } else {
              this.listIsLoad = false
            }
          } else {
            return
          }
        } else {
          return
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
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../assets/style/variable";
  @import "../../../assets/style/base";
  .beta{
    background: #FF3B6E;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
    border-radius: 2px;
    font-size: 9px;
    color: #FFFFFF;
    padding:2px 2px;
    display: inline-block;
  }
  .margintop30{
    margin-top:30px;
  }
  .tip-img{
    display: block;
    margin: 200px auto 0 auto;
    width: 700px;
  }
  .sercher-menu{
    border-bottom:2px solid #5488F9;
    margin-bottom:24px;
    li{
      display:inline-block;
      padding:11px 11px 9px 14px;
      font-size: 13px;
      color: #4F6D95;
      cursor: pointer;
      line-height: 18px;
      i{
        margin-right:7px;
        color: #B0C1D4;
        vertical-align: middle;
      }
    }
    .curr{
      color: #FFFFFF;
      background: #5488F9;
      border-radius: 4px 4px 0 0;
      i{
        color: #fff;
      }
    }
  }
  .el-select-dropdown{
    background: #fff;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.20);
    border-radius: 4px;
    .el-select-dropdown__item{
      font-size: 13px;
      color: #33475B;
      &.hover{
        background: #F5F8FA;
      }
      &.selected{
        background: rgba(2,170,170,0.09);
        font-size: 13px;
        color: #33475B;
      }
    }
  }
  .search-info{
    padding-top: 4px;
    margin: 0 auto;
    width:1200px;
    .title{
      font-size: 14px;
      color: #7C98B6;
      margin-bottom: 16px;
      cursor: pointer;
      width:150px;
      em{
        color: #7C98B6;
        font-weight: bold;
        font-size: 18px;
        margin-right: 8px;
      }
    }
    .social-input{
      .el-input__inner{
        height: 60px;
      }
      .el-icon-search{
        width:64px;
        background: #5488F9;
        color: #fff;
        border-radius: 0 4px 4px 0;
        &:hover{
            background: rgba(84,136,249,0.50);
          }
      }
    }
    .diff-choose{
      margin-top: 20px;
      margin-bottom: 26px;
      .el-select{
        .el-input__icon{
          font-size: 26px;
        }
        .el-input__inner{
          width: 150px;
          height: 18px;
          border: none;
          background: #f0f2f3;
          font-size: 16px;
          color: #33475B;
          line-height: 18px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &:focus{
            box-shadow: 1px 0 1px 0 #f0f2f3;
          }
        }
      }
      .industry-select{
        .el-input__inner{
          width:110px;
        }
      }
      .el-dropdown{
        margin-right: 40px;
        font-size: 16px;
        color: #33475B;
        .el-icon-arrow-up{
          padding-left: 5px;
        }
      }
    }

      .no-data{
        .no-search{
          margin-top: 100px;
          text-align: center;
          p{
            margin-top: 15px;
          }
        }
      }

    /*加载页样式*/
    .c-bg-load{
      background:#EAF0F6;
    }
    .social-loading{
      .animation(loadingColor,1s,infinite);
      width:26%;
      height: 115px;
      margin-bottom: 35px;
      background: #fff;
      float: left;
      position: relative;
      padding: 21px 30px 24px 30px;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
      border-radius: 4px;
      margin-right: 1.75%;
      margin-left: 1.75%;
      .social-top{
        .social-top-left{
          width:50px;
          height: 50px;
          border-radius: 25px;
          display:inline-block;
        }
        .social-top-left-right{
          display:inline-block;
          margin-left:8px;
          vertical-align: top;
          span{
            width:123px;
            height:18px;
            display:block;
            margin-top:7px;
          }
        }
      }
      .social-bottom{
        margin-top:29px;
        .social-bottom-model{
          width:316px;
          height:15px;
        }
        .social-bottom-model:last-child{
          margin-top:7px;
        }
      }
    }
    li:nth-child(3n+1){
      margin-left: 0;
    }
    li:nth-child(3n){
      margin-right: 0;
    }
  .search-content{
    width:100%;
    // overflow:hidden;
  ul{
  .info-social{
    width:26%;
    margin-bottom: 30px;
    background: #fff;
    float: left;
    position: relative;
    padding: 21px 30px 59px 30px;
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
    border-radius: 4px;
    margin-right: 1.75%;
    margin-left: 1.75%;
    overflow: hidden;
  &:hover{
     transition: .3s;
     box-shadow: 0 0 8px 0 rgba(0,0,0,0.20);
   }
  .border-wrap{
    position: absolute;
    width: 100%;
    height: 35px;
    left: 0;
    bottom: 0;
  }
  .boder{
    font-size:13px;
    width: 100%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    z-index: 2;
    position: absolute;
    bottom: 0;
    right: 0;
    color: #ffffff;
    cursor: pointer;
    background: #5488F9;
    &.el-button{
      padding: 0;
      border: none;
      border-radius: 0;
      &:hover{
        background: rgb(118, 160, 250);
        box-shadow: none;
      }
    }
    &.boderNone{
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      background: #EAF0F6;
      cursor: no-drop;
      color: #B0C1D4;
      border: 1px solid #DFE3EB;
    }
    &.boderDisabled{
      background: #98b7fb;
      cursor: no-drop;
      border:none;
    }
  }
  .add{
    position: absolute;
    top:20px;
    right: 20px;
    color: #B0C1D4;
    cursor: pointer;
    &:hover{
      color: @activeBlue;
     }
  }
  .head-info{
    position: relative;
  .img{
    width:50px;
    height: 50px;
    position: absolute;
    border-radius: 50%;
    cursor: pointer;
    overflow: hidden;
  .companyDefault{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #DEE2ED;
  em{
    font-size: 50px;
    color: #F2F5F8;
    position: absolute;
    top: 5px;
    left: -1px;
  }
  }
  img{
    width:50px;
    height: 50px;
  }
  .default-avatar{
    font-size: 25px;
    position: absolute;
  }
  }
  .limit{
    width:228px;
    .atwho{
      height: 16px;
      max-width: 200px;
      display: inline-block;
      color: #33475B;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .topdesc{
      height: 25px;
      line-height: 25px;
      color: #33475B;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .double_desc{
        font-size: 18px;
        max-width:160px;
        display: inline-block;
        color: #33475B;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .double_desc:hover{
        color:#5488F9;
      }
      .username{
        font-size: 13px;
        color: #7C98B6;
        letter-spacing: 0;
        vertical-align: top;
      }
    }
  }
  .name-info{
    padding-left: 60px;
    margin-bottom: 16px;
  .name{
    height: 25px;
    line-height: 25px;
    font-size: 18px;
    color: #33475B;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    a{
      color: #33475B;
    }
  }
  }
  }
    .icon-data{
      font-size: 12px;
      color: #7C98B6;
      height: 20px;
      line-height: 20px;
      display: inline-block;
      vertical-align: top;
      margin-left: 5px;
      .data{
        padding-right: 5px;
      }
      .icon-font{
        margin-right: 10px;
      }
      .phone{
        color: #5488F9;
      }
      .mail{
        color:#00B8CC;
      }
      .user{
        color: #00A8FF;
      }
      .fb{
        color: #4D7CE7;
      }
      .tw{
        color: #00A8FF;
      }
      .linkedin{
        color: #279BD6;
      }
      .lead{
        color: #00A8FF;
      }
    }
  .line{
    width:40px;
    height: 5px;
    background: #EAF0F6;
    border-radius: 8px;
    margin-bottom: 10px;
    display: inline-block;
  }
  .industry{
    font-size: 12px;
    color: #7C98B6;
  p{
    height: 16px;
    line-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  }
  .describe{
    margin-top: 16px;
    max-height: 36px;
    min-height: 36px;
    line-height: 18px;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /* autoprefixer: off*/
    -webkit-box-orient: vertical;
    /* autoprefixer: on*/
    -moz-box-orient: vertical;
    -ms-box-orient: vertical;
    -webkit-line-clamp: 2;
    -moz-line-clamp:2;
    -ms-line-clamp: 2;
  .no-desc{
    color: #7C98B6;
  }
  }
  }
  li:nth-child(3n+1){
    margin-left: 0;
  }
  li:nth-child(3n){
    margin-right: 0;
  }
  }
  }
    .change-page{
      margin-bottom: 50px;
      p{
        text-align: center;
        .el-button{
          position: relative;
          display: inline-block;
          width:120px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          margin-right: 50px;
          background: #FFFFFF;
          border: 1px solid #CBD6E3;
          border-radius: 4px;
          font-size: 14px;
          color: #4F6D95;
          &:hover{
            color: @white;
            background: #5488F9;
            border: 1px solid #5488F9;
          }
          span{
            position: absolute;
            top:0;
            left:33px;
          }
        }
      }
    }
  }

</style>
<style lang="less" rel="stylesheet/less" scoped>
  .center{
    text-align: center;
  }
  .recommend-fc-list{
    border-bottom:1px dashed #B0C1D4;
    margin-bottom: 30px;
    position: relative;
    .bottom-separated{
      position: absolute;
      left: 50%;
      margin-left:-20px;
      bottom: -6px;
      background: #f0f2f3;
      width: 40px;
      text-align: center;
      font-size: 13px;
      color: #B0C1D4;
    }
  }
  .recommend-fc-prompt{
    padding: 16px 0;
    background: #FDF8E6;
    margin-bottom:8px;
    .fc-download{
      height:20px;
      width:100%;
      margin-top:10px;
      .loading-circle{
        height:15px;
        width:15px;
        margin: auto;
        display: inline-block;
        vertical-align: bottom;
      }
    }
    .desc{
      font-size: 13px;
      color: #33475B;
      line-height: 18px;
      .highlighted{
        font-size: 13px;
        color: #5488F9;
        padding:0 2px;
      }
    }
    .btn{
      margin-left:30px;
      font-size: 13px;
      color: #5488F9;
      line-height: 18px;
      cursor: pointer;
    }
  }
</style>
