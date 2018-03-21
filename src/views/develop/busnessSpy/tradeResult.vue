<template>
  <div>
    <div class="main-cards" v-for="(item, index) in searchResult">
      <!--搜索结果小卡片-->
      <div class="card" @click="toDetail(item.id)">
        <div class="card-title" v-if="item.name !== '' && item.name !== null" :title="item.name">{{item.name}}</div>
        <div class="card-info">
          <span class="info-title">国家: </span>
          <img :src="'../../../../static/img/ImageFlag/' + item.baseInfo.address.country + '.png' || '../../../../static/img/ImageFlag/common.png'" alt="" v-if="item.baseInfo !== null">
          <img src="../../../../static/img/ImageFlag/common.png" alt="" v-if="item.baseInfo === null">
          <span class="info-country" v-if="item.baseInfo !== null"> {{item.baseInfo.address.country}}</span>
        </div>
        <div class="card-info" v-if="item.dashboard.aboutTradeCount">
          <span class="info-title">相关采购记录: </span>
          <span class="info-country">{{item.dashboard.aboutTradeCount}}条</span>
        </div>
        <div class="card-info" v-if="item.dashboard.latestTradeCount">
          <span class="info-title">近期贸易记录: </span>
          <span class="info-country">{{item.dashboard.latestTradeCount}}条</span>
        </div>
        <div class="card-info">
          <span class="info-title">相关联系人: </span>
          <span class="info-country">{{item.dashboard.relativeContactsSize}}人</span>
        </div>
      </div>
      <div class="card-operation">
        <el-button class="add-com width1" @click.stop="add(item, index)" v-if="item.added === false"><em class="icon-font">&#xe6ad;</em> 公司联系人</el-button>
        <span v-if="item.added === true">
          <el-button :class="item.added ? 'add-team width2' : 'add-team width1'" v-if="isMain === 'false' && item.isAddedStatusBySubUser !== null && item.isAddedStatusBySubUser === 0">团队联系人</el-button>
          <el-button :class="item.added ? 'add-com width2' : 'add-com width1'" @click.stop='toContact(item.contactsId)' v-else="">查看</el-button>
        </span>
        <el-button v-if="!item.added" class="forbid" @click.stop="shield(item, index)">屏蔽</el-button>
      </div>
    </div>
    <!--loading-->
    <div class="loadingAll" v-show="isMore">
      <ul>
        <li class="loading-trade" v-for="item in 3">
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
      <!--circle loading-->
      <div class="up-download">
        <div class="loading loading-circle img-load"></div>
      </div>
    </div>
    <div v-show="ifShield" class="shieldDialog">
      <div class="Sdialog">
        <em class="el-icon-close del" @click="ifShield = false"></em>
        <div style="text-align: left;padding-left: 22px;">
          <span class="iconfont warning">&#xe629;</span>
          <span>是否屏蔽该公司？</span>
          <span class="look">系统将不会再推荐该公司</span>
        </div>
        <div style="float: left;padding-left: 52px">
          <span class="okall ok" @click="shieldThis()">确定</span>
          <span class="okall cancle" @click="ifShield = false">取消</span>
        </div>
      </div>
    </div>
    <AlreadyBox :config="config" @sure="readySure"></AlreadyBox>
  </div>
</template>
<script>
  import AlreadyBox from './../../../components/alreadyBox.vue'
  import exploreAPI from '@/api/exploreAPI'
  export default{
    name: 'tradeResult',
    props: {
      searchResult: Array,
      isMore: Boolean
    },
    data () {
      return {
        showMore: false,
        userId: window.localStorage.userId,
        ifShield: false,
        shieldInfo: {},
        shieldIndex: -1,
        config: {
          visible: false,
          text: '公司联系人已被他人添加'
        },
        topPos: 0,
        isMain: window.localStorage.getItem('isMainAccount')
      }
    },
    computed: {

    },
    components: {
      AlreadyBox
    },
    mounted () {
      console.log(this.searchResult)
      console.log(this.searchResult.isMore)
      console.log(this.searchResult[0].name)
    },
    watch: {
    },
    methods: {
//      跳转到联系人详情页
      toContact (id) {
        window.open('#/contactDetail?contactId=' + id + '&contactType=1')
      },
//      跳转公司详情页
      toDetail (id) {
        this.$router.push({
          path: '/busnessSpyItem',
          query: {companyId: id}
        })
      },
//      屏蔽公司联系人
      shield (item, index) {
        if (item.added) {
          return
        } else {
          this.ifShield = true
          this.shieldInfo = item
          this.shieldIndex = index
        }
      },
//      确定屏蔽
      shieldThis () {
        this.ifShield = false
        let params = {
          companyName: this.shieldInfo.name,
          companyId: this.shieldInfo.id,
          taskId: this.shieldInfo.taskId,
          centraId: this.shieldInfo.centraId,
          keywords: this.$route.query.taskName,
          countryName: this.shieldInfo.baseInfo.address.country || ''
        }
        if (this.shieldInfo.baseInfo !== null) {
          params.countryName = this.shieldInfo.baseInfo.address.country
        }
        exploreAPI.shieldCompany(params).then(res => {
          if (!res.data.code) {
            this.searchResult.splice(this.shieldIndex, 1)
            this.$emit('changeTotal')
          } else {
//            this.config.text = '公司联系人已被他人屏蔽'
            this.topPos = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset
            let Trendi = 0
            this.$message({message: res.data.message, type: 'error'})
            Trendi = 1
            if (res.data.message === '联系人已被他人屏蔽') {
              let interi = setInterval(() => {
                if (Trendi === 1) {
                  clearInterval(interi)
                  location.reload()
                }
              }, 800)
            }
          }
        })
      },
      //      添加公司联系人
      add (item) {
        let params = {
          type: 1,
          userId: this.userId,
          socialAccountType: 6,
          name: item.name,
          address: '',
          thirdAccountId: item.centraId,
          detectiveCompanyId: item.id,
          taskId: item.taskId,
          createSource: 'recommend_search_create',
          thirdInfoList: JSON.stringify(item.socialInfoList),
          companySize: '',
          sales: '',
          website: item.website,
          mainProduct: item.mainProduct,
          detectiveFlag: true,
          keywords: this.$route.query.taskName
        }
        if (item.baseInfo !== null && item.baseInfo !== undefined) {
          params.address = JSON.stringify(item.baseInfo.address)
          params.companySize = item.baseInfo.companySize
          params.sales = item.baseInfo.sales
        }
        exploreAPI.addContact(params).then(res => {
          if (!res.data.code) {
            item.added = true
            item.contactsId = res.data.data.id
            this.$message.success('添加联系人成功')
          } else {
            this.topPos = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset
            let Trend = 0
            this.$message({message: res.data.message, type: 'error'})
            Trend = 1
            if (res.data.message === '联系人已被他人添加') {
              let inter = setInterval(() => {
                if (Trend === 1) {
                  clearInterval(inter)
                  location.reload()
                }
              }, 800)
            }
          }
        })
      },
      readySure () {
        location.reload()
        this.config.visible = false
        window.scrollTo(0, this.topPos)
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @keyframes loadingColor {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  @-webkit-keyframes loadingColor {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  @-moz-keyframes loadingColor {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  @-ms-keyframes loadingColor{
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  @-o-keyframes loadingColor{
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  .animation(@animation-name, @animation-duration, @animation-iteration-count){
    animation: @arguments;
    -webkit-animation: @arguments;
    -moz-animation: @arguments;
    -ms-animation: @arguments;
    -o-animation: @arguments;
  }
  .shieldDialog{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background: rgba(0, 0, 0, .4);
    z-index: 207;
    .Sdialog{
      position: relative;
      width:280px;
      height: 110px;
      padding: 35px;
      font-size: 14px;
      color: #33475B;
      background: #FFFFFF;
      box-shadow: 0 0 18px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      margin: 0 auto;
      vertical-align: middle;
      margin-top: 25%;
      .del{
        position: absolute;
        right: 15px;
        top: 16px;
        cursor: pointer;
        color: #c0ccda;
        font-size: small;
      }
      .warning{
        font-size: 22px;
        color: #FEA000;
        margin-right: 6px;
        vertical-align: middle;
      }
      .look{
        color: rgb(124, 152, 182);
        display: inline-block;
        margin: 20px 0 25px 0;
        padding-left: 30px;
      }
      .okall{
        display: inline-block;
        width:80px;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
      }
      .ok{
        background: #5488F9;
        border-radius: 4px;
        color: #fff;
      }
    }
  }
  .main-cards{
    width:380px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    float: left;
    margin-right: 30px;
    margin-bottom: 20px;
    .card{
      /*width:245px;*/
      padding: 30px 20px 40px;
      .card-title{
        height: 25px;
        line-height: 25px;
        font-size: 18px;
        color: #33475B;
        margin-bottom: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .card-webset{
        height: 18px;
        line-height: 18px;
        font-size: 13px;
        color: #5488F9;
        margin-top: 2px;
        margin-bottom: 10px;
        .web{
          font-size: 13px;
          color: #5488F9;
          &:hover{
            text-decoration: underline;
          }
        }
      }
      .card-line{
        width:80px;
        background: #DFE3EB;
        margin-bottom: 10px;
        border: 1px solid #DFE3EB;
      }
      .card-info{
        line-height: 18px;
        margin-bottom: 4px;
        .info-title{
          font-size: 13px;
          color: #7C98B6;
          margin-right: 3px;
        }
        img{
          display: inline-block;
          width:16px;
          height: 10px;
          border-radius: 2px;
          background: pink;
        }
        .info-country{
          font-size: 13px;
          color: #4F6D95;
        }
      }
      .card-desc{
        font-size: 13px;
        color: #4F6D95;
        height: 40px;
        line-height: 20px;
        margin-top: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        /* autoprefixer: off*/
        -webkit-box-orient: vertical;
        /* autoprefixer: on*/
        -ms-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
    .card:hover{
      box-shadow: 0 0 14px rgba(84, 136, 249, 0.25);
      background: rgba(245,248,250,0.80);
      cursor: pointer;
      .card-title{
        color: #5488F9;
        text-decoration: underline;
      }
    }
    .card-operation{
      font-size: 0;
      .add-com{
        width:300px;
        height: 40px;
        border: none;
        border-radius: inherit;
        color: #fff;
        background: #5488F9;
        &:hover{
          background: rgba(84,136,249,0.80);
        }
      }
      .add-team{
        width:300px;
        height: 40px;
        border: none;
        border-radius: inherit;
        background: #EAF0F6;
        color: #7C98B6;
      }
      .width1{
        width:300px;
      }
      .width2{
        width:100%;
      }
      .forbid{
        width:80px;
        height: 40px;
        border: none;
        margin-left: 0;
        border-radius: 0;
        background: #DFE3EB;
        vertical-align: bottom;
      }
      .operation{
        display: inline-block;
        font-size: 13px;
        width:120px;
        height: 40px;
        line-height: 40px;
        background: #F5F8FA;
        vertical-align: bottom;
        text-align: center;
        color: #7C98B6;
        cursor: pointer;
        &:hover{
          color: #5488F9;
        }
      }
      .shield{
        position: relative;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        width: 40px;
        /*background: rgba(51,71,91,0.10);*/
        vertical-align: bottom;
        em{
          cursor: pointer;
          position: absolute;
          left: 12px;
          font-size: 14px;
          top: 2px;
        }
      }
      .bg1{
        background: rgba(51,71,91,0.10);
      }
      .bg2{
        background: #ddd;
      }
    }
  }
  .loadingAll{
    clear: both;
  }
  .up-download{
    overflow: hidden;
    height:40px;
    background: #fff;
    width:100%;
    margin-top:10px;
    .animation(loadingColor,1s,infinite);
    .loading{
      margin: 0 auto;
    }
  }
  .main-cards:nth-child(3n){
    margin-right: 0;
  }
</style>
