<template>
  <div class="template-wrap">
    <div class="masonry">
      <div class="masonry-header">
        <el-input
          class="social-input"
          placeholder="请输入关键词"
          v-model="searchFor"
          icon="search"
          :on-icon-click="handClickIcon"
          @keyup.enter.native="handClickIcon">
        </el-input>
        <div class="searcher-menu">
          <li :class="{'curr' : typeIndex == '0'}" @click="changeType('0')">图片</li>
          <li class="line"><span></span></li>
          <li :class="{'curr' : typeIndex == '1'}" @click="changeType('1')">动图</li>
        </div>
      </div>
      <div class="searching-list" v-show="socialSearchLoad">
        <div class="s-l-list">
          <span style="height:385px;"></span>
          <span style="height:218px;"></span>
          <span style="height:150px;"></span>
        </div>
        <div class="s-l-list">
          <span style="height:160px;"></span>
          <span style="height:205px;"></span>
          <span style="height:336px;"></span>
        </div>
        <div class="s-l-list">
          <span style="height:312px;"></span>
          <span style="height:312px;"></span>
          <span style="height:150px;"></span>
        </div>
        <div class="s-l-list">
          <span style="height:349px;"></span>
          <span style="height:254px;"></span>
          <span style="height:150px;"></span>
        </div>
        <div class="s-l-list">
          <span style="height:283px;"></span>
          <span style="height:339px;"></span>
          <span style="height:150px;"></span>
        </div>
      </div>
      <!--staticSearchInfo-->
      <div class="result-list" v-show="!socialSearchLoad">
        <!--暂无搜索结果-->
        <div class="nodata" v-if="staticData">
          <div class="no-search">
            <img src="../../assets/img/monitor/social-noData.png" alt="">
            <p>暂无搜索结果</p>
          </div>
        </div>
        <searchCard v-else :recordLess="typeIndex" :searchLoad="socialSearchLoad" ref="searchResult"></searchCard>
        <div class="loading loading-circle bottom-loading" v-if="loadingGif"></div>
        <div class="no-data-noMore" v-if="searchNoMore">已无更多搜索结果</div>
      </div>
    </div>
    <!-- 保存到素材库弹窗 -->
    <saveImgExtension></saveImgExtension>
    <!--发帖弹窗-->
    <AddImgExtension></AddImgExtension>
  </div>
</template>

<script>
  import Vue from 'vue'
  import materialAPI from '@/api/materialAPI.js'
  import searchCard from './searchcptns/searchCard'
  export default {
    data () {
      return {
        saveData: [],
        defaultKeywords: 'clothes',
        loadingGif: true,
        searchFor: '',
        typeIndex: '0',
        staticSearchInfo: {
          socialType: '0',
          List: [],
          isMore: true,
          isLoading: false
        },
        staticNextPage: 1,
        staticData: false,
        gifSearchInfo: {
          socialType: '1',
          List: [],
          isMore: true,
          isLoading: false
        },
        gifNextPage: 1,
        gifData: false,
        page: 1,
        perpage: 30,
        isNext: true,
        listIsLoad: false,
        socialSearchLoad: true,
        // 防止创建同名文件夹，给每个文件名创建map
        dialogVisible: false,
        isLoading: false,
        searchNoMore: false,
        imgPhp: process.env.PHOTO_DOMAIN + 'image.php?url='
      }
    },
    components: {
      searchCard,
      // AddImgExtension,
      // saveImgExtension,
      'AddImgExtension': resolve => {
        require(['./searchcptns/AddImgExtension'], resolve)
      },
      'saveImgExtension': resolve => {
        require(['./searchcptns/saveImgExtension'], resolve)
      }
    },
    created () {
    },
    mounted: function () {
      if (this.typeIndex === '0' && this.staticNextPage === 1) {
        let paramsStatic = {keywords: this.defaultKeywords, page: 1, perpage: this.perpage, flag: 0}
        this.searchForKeywords(paramsStatic, 'static')
      } else if (this.typeIndex === '1' && this.gifNextPage === 1) {
        let paramsGif = {keywords: this.defaultKeywords, page: 1, perpage: this.perpage, flag: 1}
        this.searchForKeywords(paramsGif, 'gif')
      }
      window.onscroll = function () {
        if (this.getScrollTop() + this.getClientHeight() >= this.getScrollHeight() - 100) {
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            this.loadData(this.typeIndex)
          }, 300)
        }
      }.bind(this)
      // 初始化剩余空间
      // this.getStorage()
    },
    watch: {
      typeIndex () {
        if (this.typeIndex === '0' && this.staticNextPage === 1) {
          this.socialSearchLoad = true
          let paramsStatic = {keywords: this.searchFor ? this.searchFor : this.defaultKeywords, page: 1, perpage: this.perpage, flag: 0}
          this.searchForKeywords(paramsStatic, 'static')
          this.socialSearchLoad = false
        } else if (this.typeIndex === '1' && this.gifNextPage === 1) {
          this.socialSearchLoad = true
          let paramsGif = {keywords: this.searchFor ? this.searchFor : this.defaultKeywords, page: 1, perpage: this.perpage, flag: 1}
          this.searchForKeywords(paramsGif, 'gif')
          this.socialSearchLoad = false
        }
      }
    },
    methods: {
      // 搜索结果类型切换
      changeType (index) {
        if (this.typeIndex === index) {
        } else {
          this.typeIndex = index
        }
      },
      // changeLoad (msg) {
      //   this.socialSearchLoad = msg
      // },
      // 点击查询方法
      handClickIcon () {
        if (this.searchFor !== '' && this.searchFor !== null && !this.searchFor.match(/^[ ]+$/)) {
          this.searchFor = this.searchFor.trim()
          this.staticSearchInfo.List = []
          this.staticSearchInfo.isLoading = true
          this.staticNextPage = 1
          this.staticData = false
          this.gifSearchInfo.List = []
          this.gifSearchInfo.isLoading = true
          this.gifNextPage = 1
          this.gifData = false
          this.listIsLoad = false
          this.socialSearchLoad = true
          this.loadingGif = true
          this.searchNoMore = false
          if (this.typeIndex === '0') {
            let paramsStatic = {keywords: this.searchFor, page: 1, perpage: this.perpage, flag: 0}
            this.searchForKeywords(paramsStatic, 'static')
          } else if (this.typeIndex === '1') {
            let paramsGif = {keywords: this.searchFor, page: 1, perpage: this.perpage, flag: 1}
            this.searchForKeywords(paramsGif, 'gif')
          }
        } else {
          this.$message.error('搜索关键字不能为空')
        }
      },
      // 查询图片方法
      searchForKeywords (val, stye) {
        materialAPI.searchImg(val).then(res => {
          this.listIsLoad = false
          if (res.data.code === 0) {
            if (res.data.message === '查询结果越界') {
              this.loadingGif = false
              this.searchNoMore = true
              return
            }
            if (res.data.message === '查询结果为空') {
              this.staticData = true
              this.loadingGif = false
              this.socialSearchLoad = false
              return
            }
            if (stye === 'static') {
              let List = this.staticSearchInfo.List
              let resList = res.data.data
              for (let index of resList) {
                index.previewURL = this.imgPhp + index.previewURL.replace('https://server.onloon.com.cn/image?url=', '')
              }
              this.staticSearchInfo.List = List.concat(resList)
              if (res.data.data.length < 0) {
              } else {
                this.staticSearchInfo.isLoading = true
                this.staticNextPage = this.staticNextPage + 1
              }
              this.staticSearchInfo.isLoading = false
              this.$refs.searchResult.staticRemove()
              Vue.nextTick(() => {
                this.$refs.searchResult.searchSet(this.staticSearchInfo.List, 'static')
                // this.socialSearchLoad = false
              })
            } else {
              let List = this.gifSearchInfo.List
              let resList = res.data.data
              for (let index of resList) {
                index.previewURL = this.imgPhp + this.b64EncodeUnicode('https://i.giphy.com/' + index.id + '.gif')
              }
              this.gifSearchInfo.List = List.concat(resList)
              if (res.data.data.length < 0) {
              } else {
                this.gifSearchInfo.isLoading = true
                this.gifNextPage = this.gifNextPage + 1
              }
              if (resList.length === 0 && this.gifNextPage === 1) {
                this.gifData = true
              }
              this.gifSearchInfo.isLoading = false
              this.$refs.searchResult.gifRemove()
              Vue.nextTick(() => {
                this.$refs.searchResult.searchSet(this.gifSearchInfo.List, 'gif')
                // this.socialSearchLoad = false
              })
            }
            if (res.data.data.length < 12) {
              this.loadingGif = false
            }
            setTimeout(() => {
              this.socialSearchLoad = false
            }, 1000)
          }
        })
      },
      loadData (type) {
        if (!this.listIsLoad) {
          if ((type === '0') && !this.staticSearchInfo.isLoading) {
            this.staticSearchInfo.isLoading = true
            this.listIsLoad = true
            if (this.staticNextPage > 1) {
              let params = {
                keywords: this.searchFor ? this.searchFor : this.defaultKeywords,
                page: this.staticNextPage,
                perpage: this.perpage,
                flag: 0
              }
              this.searchForKeywords(params, 'static')
            } else {
              this.listIsLoad = false
            }
          } else if ((type === '1') && !this.gifSearchInfo.isLoading) {
            this.staticSearchInfo.isLoading = true
            this.listIsLoad = true
            if (this.gifNextPage > 1) {
              let params = {
                keywords: this.searchFor ? this.searchFor : this.defaultKeywords,
                page: this.gifNextPage,
                perpage: this.perpage,
                flag: 1
              }
              this.searchForKeywords(params, 'gif')
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
      b64EncodeUnicode (str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
          return String.fromCharCode('0x' + p1)
        }))
      },
      b64DecodeUnicode (str) {
        str = str.split('=')[1]
        return decodeURIComponent(atob(str).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
      },
      // 获取当前滚动高度
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
  .template-wrap{
    width: 1200px;
    background: #FFFFFF;
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
    border-radius: 4px 4px 0 0;
    margin: 0 auto;
  }
  .masonry {
    width: 100%;
    position: relative;
    min-height: calc(~'100vh - 187px');
    .masonry-header{
      width: 100%;
      height: 60px;
      padding: 12px 20px;
      border-bottom: 1px solid #DFE3EB;
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      .social-input{
        width: 400px;
        float: right;
        height: 36px;
        .el-input__inner{
          height: 36px;
        }
      }
      .searcher-menu{
        float: left;
        font-family: PingFangSC-Semibold;
        line-height: 26px;
        letter-spacing: 0;
        font-size: 0px;
        padding: 5px 0;
        li{
          display:inline-block;
          cursor: pointer;
          font-size: 14px;
          vertical-align: middle;
          color: #7C98B6;
          padding: 0;
          margin: 0;
          letter-spacing: 0px;
          font-size: 14px;
          &.line{
            padding: 0 11px;
            span{
              display: block;
              width: 1px;
              height: 15px;
              background: #CBD6E3;
            }
          }
        }
        .curr{
          font-family: PingFangSC-Semibold;
          color: #33475B;
          font-size: 16px;
        }
      }
    }
    .result-list{
      padding: 30px 20px 20px 20px;
      font-size: 0;
      .searchList {
        width: 216px;
        display: inline-block;
        margin-right: 20px;
        vertical-align: top;
        &:nth-child(5){
          margin: 0;
        }
      }
    }
    .bottom-loading{
      margin: 40px auto;
    }
  }
  .searching-list{
    width: 100%;
    padding: 30px 20px 0 20px;
    font-size: 0;
    .s-l-list{
        width: 216px;
        display: inline-block;
        margin-right: 20px;
        vertical-align: top;
        &:nth-child(5){
          margin: 0;
        }
        span{
          display: block;
          padding: 0;
          margin-bottom: 20px;
          width: 216px;
          background-color: #F5F8FA;
          animation: loadingColor 1s infinite;
          -webkit-animation: loadingColor 1s infinite;
        }
    }
  }
  .nodata{
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 120px;
    width: 88px;
    .no-search{
      text-align: center;
      p{
        margin-top: 15px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #4F6D95;
        letter-spacing: 0;
      }
    }
  }
  .no-data-noMore{
    width: 100%;
    height: 118px;
    line-height: 118px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #4F6D95;
    letter-spacing: 0;
    text-align: center;
  }
</style>
