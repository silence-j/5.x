<template>
  <div class="searchInfo">
    <!--<router-link to="/develop">-->
    <p class="title" @click="backDevelop">
      <!--<em class="icon-font">&#xe600;</em> -->
      <span><img src="../../assets/img/left.png" alt="" class="left-back" /></span>
      返回</p>
    <!--tab change-->
    <div class="tabShield">
      <span :class="showOther ? 'added active' : 'added'" @click="changeBar('add')">已添加公司 {{addCount}}</span>
      <span :class="showOther ? 'added' : 'added active'"  @click="changeBar('ign')">已屏蔽公司 {{shieldCount}}</span>
    </div>
    <!--container-->
    <ul v-show="searchLoad">
      <div class="loading loading-circle loading-top" style="position: relative; top: 100px;"></div>
    </ul>
    <div class="shieldContainer" v-show="!searchLoad">
      <div class="choose">
        <el-input placeholder="请输入公司名称" v-model.trim="inputValue" @keyup.enter.native="searchType"></el-input>
        <div class="select-time" id="timeSelect">
          <el-date-picker
            v-model="timerPicker"
            type="daterange"
            align="center"
            @change="timeChage"
            placeholder="选择时间"
            @keyup.enter.native="searchType">
          </el-date-picker>
        </div>
        <el-button @click="searchType()">搜索</el-button>
      </div>
      <!--搜素加载页-->
      <div  class="cont-all">
        <!--暂无搜索结果-->
        <div class="no-data" v-show="isData">
          <div class="no-search">
            <img src="../../assets/img/monitor/social-noData.png" alt="">
            <p>暂无数据</p>
          </div>
        </div>
        <div class="search-content" >
          <!--表格头部-->
          <div class="common-search search-table-title" v-if="searchInfo.length > 0">
            <ul>
              <li :class="showOther === true ? 'search-name' : 'search-nameL'">公司名称</li>
              <li :class="showOther ? 'search-country Aname' : 'search-country Sname'">国家</li>
              <li :class="showOther === true ? 'search-address a-aname' : 'search-address a-sname'">侦探关键词</li>
              <li class="search-staff" v-if="showOther">添加时间</li>
              <li class="search-time" v-if="!showOther">屏蔽时间</li>
              <li class="search-people">{{showOther ? '添加人' : '屏蔽人'}}</li>
              <li class="search-operation">操作</li>
            </ul>
          </div>
          <!--表格内容-->
          <div class="common-search search-table-body" v-if="searchInfo.length > 0" v-for="item in searchInfo">
            <ul>
              <li v-if="showOther && item.deleteTag !== 1" :class="showOther === true ? 'search-name curPoint' : 'search-nameL curPoint'" :title="item.name" @click="jumpCompany(item)">{{item.companyName}}</li>
              <li v-else="" :class="showOther === true ? 'search-name' : 'search-nameL'" :title="item.name">{{item.companyName}}</li>
              <li :class="showOther ? 'search-country Aname' : 'search-country Sname'">
                <img :src="'../../../static/img/ImageFlag/'+ item.countryName + '.png'" alt="">
                <span class="country-val">{{item.countryName}}</span>
              </li>
              <li :class="showOther === true ? 'search-address a-aname' : 'search-address a-sname'" >
              <span class="address-val" v-if="item.keywords !== '' && item.keywords !== null">
                {{item.keywords}}
              </span>
                <span v-else>—</span>
              </li>
              <li class="search-staff" v-if="showOther">
                <span v-if="item.createTime !== null && item.createTime !== ''">{{item.createTime | time-formater-has-hour}}</span>
                <span v-else="">—</span>
              </li>
              <li class="search-time" v-if="!showOther">
                <span v-if="item.createTime !== null && item.createTime !== ''">{{item.createTime | time-formater-has-hour}}</span>
                <span v-else="">—</span>
              </li>
              <li class="search-people">
                <span v-if="item.userName !== null">{{item.userName}}</span>
              </li>
              <li class="search-operation-val">
                <span @click="addCompany(item)" class="see-buy">查看采购历史</span>
                <div style="display: inline-block" v-if="showOther && item.deleteTag !== 1" >
                  <span class="team-contact" v-if="isMain === 'false' && item.isAddedStatusBySubUser !== null && item.isAddedStatusBySubUser === 0">团队联系人</span>
                  <span @click="showCompany(item.contactId)" class="see-contact" v-else="">查看公司</span>
                </div>
                <!--<span @click="showCompany(item.contactId)" v-if="showOther && item.deleteTag !== 1" class="see-contact">查看公司</span>-->
                <!--<span class="team-contact" v-if="item.isAddedStatusBySubUser !== null && item.isAddedStatusBySubUser === 1">团队联系人</span>-->
                <span @click="cancelShield(item.id)" v-if="!showOther && item.deleteTag !== 1" class="see-contact">取消屏蔽</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="searchPagePage" v-if="showPage">
          <el-pagination
            @size-change="SearchhandleSizeChange"
            @current-change="SearchhandlePageChange"
            :current-page="searchPage.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="searchPage.pageSize"
            :total="searchPage.totalCount"
            :layout="adLayout">
          </el-pagination>
        </div>
      </div>
    </div>
    <div v-show="ifShield" class="shieldDialog">
      <div class="Sdialog">
        <em class="el-icon-close del" @click="ifShield = false"></em>
        <div style="text-align: left;padding-left: 22px;">
          <span class="iconfont warning">&#xe629;</span>
          <span>是否取消屏蔽该公司？</span>
          <span class="look">系统将继续推荐该公司</span>
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
  import AlreadyBox from './../../components/alreadyBox.vue'
  import exploreAPI from '@/api/exploreAPI'
//  import Util from '@/common/Util.js'
  export default{
    name: '',
    data () {
      return {
        isData: false,
        searchFor: '',
        searchLoad: true,
        showPage: false,
        searchInfo: [],
        searchPage: {
          page: this.$store.getters.searchPage || 1,
          pageSize: 10,
          totalCount: 0
        },
        adLayout: 'prev, pager, next, sizes, jumper, ->',
        userId: window.localStorage.userId,
        showOther: true,
        addCount: '',
        shieldCount: '',
        companyName: '',
        timerPicker: '',
        createTimeEnd: '',
        createTimeStart: '',
        ifShield: false,
        cancelId: -1,
        inputValue: '',
        config: {
          visible: false,
          text: '公司联系人已被他人取消屏蔽'
        },
        isMain: window.localStorage.getItem('isMainAccount')
      }
    },
    computed: {
      searchPage () {
        console.log('加载页面取store')
        console.log(this.$store.getters.searchPage)
        this.searchPage.page = this.$store.getters.searchPage
        return this.$store.getters.searchPage
      }
    },
    components: {
      AlreadyBox
    },
    mounted () {
      let type = this.$route.query.type
      if (type === '1') {
        this.showAdded()
      } else {
        this.showShield()
      }
    },
    watch: {
    },
    methods: {
//      获取添加公司列表
      addCompanyList (params) {
        this.searchLoad = true
        exploreAPI.addCompanyList(params).then(res => {
          this.searchLoad = false
          if (!res.data.code) {
            this.searchInfo = res.data.data.records
            this.searchPage.totalCount = res.data.data.totalCount
            this.addCount = `(${res.data.data.totalCount})`
            if (res.data.data.records.length > 0) {
              this.isData = false
              if (res.data.data.totalCount > 9) {
                this.showPage = true
              } else {
                this.showPage = false
              }
            } else {
              this.isData = true
            }
          }
        })
      },
//      获取忽略公司列表
      shieldCompanyList (params) {
        this.searchLoad = true
        exploreAPI.shieldCompanyList(params).then(res => {
          this.searchLoad = false
          if (!res.data.code) {
            this.searchInfo = res.data.data.records
            this.searchPage.totalCount = res.data.data.totalCount
            this.shieldCount = `(${res.data.data.totalCount})`
            if (res.data.data.records.length > 0) {
              this.isData = false
              if (res.data.data.totalCount > 9) {
                this.showPage = true
              } else {
                this.showPage = false
              }
            } else {
              this.isData = true
            }
          }
        })
      },
//      切换
      changeBar (value) {
        this.inputValue = ''
        this.companyName = ''
        if (value === 'add') {
          this.showAdded('1')
        } else {
          this.showShield('1')
        }
      },
      timeChage (e) {
        console.log(e)
      },
      searchType () {
        this.searchPage.page = 1
        this.searchPage.pageSize = 10
        this.companyName = this.inputValue
        if (this.timerPicker && this.timerPicker[0]) {
          this.createTimeStart = this.changeDate(this.timerPicker[0])
          this.createTimeEnd = this.changeDate(this.timerPicker[1])
        } else {
          this.createTimeStart = ''
          this.createTimeEnd = ''
        }
        if (this.showOther === true) {
          this.showAdded()
        } else {
          this.showShield()
        }
      },
      changeDate (value) {
        let time = new Date(value)
        let year = time.getFullYear()
        let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
        let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
        return year + '-' + month + '-' + day
      },
      showAdded (value) {
        this.showOther = true
        if (value === '1') {
          this.createTimeStart = ''
          this.createTimeEnd = ''
          this.timerPicker = ''
        }
        let params = {
          page: this.searchPage.page,
          size: this.searchPage.pageSize,
          keyword: this.companyName
        }
        if (this.createTimeStart !== '') {
          params.startTime = this.createTimeStart
        }
        if (this.createTimeEnd !== '') {
          params.endTime = this.createTimeEnd
        }
        this.addCompanyList(params)
      },
      showShield (value) {
        this.showOther = false
        this.companyName = this.inputValue
        if (value === '1') {
          this.createTimeStart = ''
          this.createTimeEnd = ''
          this.timerPicker = ''
        }
        let params = {
          page: this.searchPage.page,
          size: this.searchPage.pageSize,
          keyword: this.companyName
        }
        if (this.createTimeStart !== '') {
          params.startTime = this.createTimeStart
        }
        if (this.createTimeEnd !== '') {
          params.endTime = this.createTimeEnd
        }
        this.shieldCompanyList(params)
      },
      readySure () {
        location.reload()
        this.config.visible = false
        window.scrollTo(0, this.topPos)
      },
      backDevelop () {
        this.$router.push({
          path: '/tradeDetect'
        })
      },
//      添加探索公司
      addCompany (item) {
        window.localStorage.setItem('taskName', item.keywords)
        this.$router.push({
          path: '/busnessSpyItem',
          query: {
            companyId: item.companyId,
            hidAdd: false
          }
        })
      },
//      跳转公司详情
      jumpCompany (item) {
        if (this.isMain === 'false' && item.isAddedStatusBySubUser !== null && item.isAddedStatusBySubUser === 0) {
          return
        } else {
          window.open('#/contactDetail?contactId=' + item.contactId + '&contactType=1')
          this.$store.commit('DEVELOP_SEARCH_PAGE', {page: this.searchPage.page})
        }
      },
//      跳转到联系人公司详情
      showCompany (id) {
        window.open('#/contactDetail?contactId=' + id + '&contactType=1')
      },
      //      取消屏蔽
      cancelShield (id) {
        this.ifShield = true
        this.cancelId = id
      },
      shieldThis () {
        exploreAPI.cancelShield({id: this.cancelId}).then(res => {
          if (!res.data.code) {
            this.ifShield = false
            this.showShield()
          } else {
            this.topPos = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset
            this.ifShield = false
            let Trendi = 0
            this.$message({message: res.data.message, type: 'error'})
            Trendi = 1
            if (res.data.message === '联系人已被他人取消屏蔽') {
              let inter = setInterval(() => {
                if (Trendi === 1) {
                  clearInterval(inter)
                  location.reload()
                }
              }, 800)
            }
//            this.config.visible = true
          }
        })
      },
      SearchhandlePageChange (page) {
        this.searchPage.page = page
        if (this.showOther) {
          this.showAdded()
        } else {
          this.showShield()
        }
      },
      SearchhandleSizeChange (size) {
        this.searchPage.page = 1
        this.searchPage.pageSize = size
        if (this.showOther) {
          this.showAdded()
        } else {
          this.showShield()
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../assets/style/base";
  @import "../../assets/style/variable";
  @import '../../assets/style/page';
  .customer-wrap{
    padding:16px 0px 30px 0px;
    width:400px;
    box-shadow: 0 0 3px 0 rgba(0,0,0,0.20);
    border-radius: 4px;
    .el-checkbox{
      margin-left: 11px;
    }
    .el-checkbox-group{
      .condition-item{
        margin-top: 15px;
        min-width: 110px;
        max-width: 110px;
        overflow: hidden;
        margin-left: 11px;
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
  .searchInfo{
    padding-top: 30px;
    margin: 0 auto;
    width:1200px;
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
        box-shadow: 0 0px 18px 0 rgba(0,0,0,0.20);
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
          color:  #FEA000;
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
    .tabShield{
      font-size: 13px;
      color: #7C98B6;
      margin-bottom: 15px;
      border-bottom: 1px solid #DFE3EB;
      .added{
        display: inline-block;
        margin-right: 30px;
        height: 18px;
        padding: 10px 0;
        cursor: pointer;
      }
      .active{
        color: #5488F9;
        border-bottom: 4px solid #5488F9;
      }
    }
    .shieldContainer{
      background: #fff;
      .choose{
        height: 60px;
        width:inherit;
        line-height: 60px;
        float: right;
        margin-right: 20px;
        .el-input{
          display: inline-block;
          width:240px;
          .el-input__inner{
            width:240px;
            height: 36px;
          }
        }
        .select-time{
          display: inline-block;
          /*width:180px;*/
          .el-date-editor{
            width:220px;
            .el-input__inner{
              width:220px;
            }
            .el-picker-panel{
              width:513px!important;
            }
          }
          .el-date-editor{
            ::-webkit-input-placeholder { /* WebKit browsers */
              color: #cbd6e2!important;
            }
            :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
              color: #cbd6e2!important;
            }
            ::-moz-placeholder { /* Mozilla Firefox 19+ */
              color: #cbd6e2!important;
            }
            :-ms-input-placeholder { /* Internet Explorer 10+ */
              color: #cbd6e2!important;
            }
          }
        }
        .el-button{
          width:80px;
          background: #5488F9;
          border-radius: 4px;
          font-size: 13px;
          color: #FFFFFF;
        }
      }
    }
    .searchOfKind{
      width:1200px;
      font-size: 0;
      position: relative;
      .choose-or{
        width:36px;
        height: 36px;
        line-height: 36px;
        background: #B0C1D4;
        vertical-align: middle;
        position: absolute;
        top:10px;
        left:48.4%;
        color: #fff;
        z-index: 9;
        border-radius: 50%;
        font-size: 13px;
        text-align: center;
        .companyName{
          vertical-align: text-bottom;
        }
      }
      .el-input{
        width:600px;
        vertical-align: text-bottom;
        display: inline-block;
        position: relative;
        top:-1px;
        .el-input-group__append{
          background: #5488F9;
          position: absolute;
          top: 0px;
          right: 0px;
          width: 44px;
          height: 58px;
          line-height: 58px;
          .result-search{
            line-height: 58px;
            height: 58px;
            .el-icon-search{
              width:34px;
              color: #fff;
            }
          }
          .el-button{
          }
          .el-button--primary:hover{
            background: #5488F9;
            border-color: #5488F9;
            color: #5488F9;
          }
        }
        .el-input__inner{
          width:600px;
          padding-left: 22px;
        }
      }
    }
    .title{
      font-size: 14px;
      color: #7C98B6;
      margin-bottom: 16px;
      width:150px;
      cursor: pointer;
      em{
        color: #7C98B6;
        font-weight: bold;
        font-size: 18px;
        margin-right: 8px;
      }
    }
    .el-input{
      margin-bottom: 0px;
      .el-input__inner{
        height: 60px;
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
      .el-select.customer-filters{
        .el-input__inner{
          width:167px;
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
      height: 550px;
      .no-search{
        margin-top: 100px;
        text-align: center;
        p{
          margin-top: 15px;
        }
      }
    }
    .search-content{
      width:100%;
      overflow:hidden;
      .common-search{
        &:hover{
          background: #F5F8FA;
        }
        li{
          float: left;
        }
        .search-name{
          padding-left: 20px;
          width:249px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          /*cursor: pointer;*/
          /*margin-right: 50px;*/
          &:hover{
            color: #5488F9;
          }
        }
        .curPoint{
          cursor: pointer;
        }
        .search-nameL{
          padding-left: 20px;
          width:250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          /*cursor: pointer;*/
          /*margin-right: 50px;*/
          &:hover{
            color: #5488F9;
          }
        }
        .Sname{
          width:319px;
        }
        .Aname{
          width:249px;
        }
        .search-country{
          /*width:250px;*/
          position: relative;
          img{
            position: absolute;
            top:25px;
            background-image: url('../../../static/img/ImageFlag/common.png');
            display: inline-block;
            width:18px;
            height: 12px;
            border-radius: 3px;
          }
          .country-val{
            padding-left: 28px;
            display: inline-block;
            width:126px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .Sname{
          width:220px
        }
        .Aname{
          width:200px
        }
        .search-address{
          width:220px;
          .address-val{
            display: inline-block;
            width:100px;
            line-height: 16px;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            /* autoprefixer: off*/
            -webkit-box-orient: vertical;
            /* autoprefixer: on*/
            -ms-box-orient: vertical;
            -webkit-line-clamp: 3;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .a-aname{
          width:170px;
        }
        .a-sname{
          width:180px;
        }
        .search-time{
          width:160px;
        }
        .search-staff{
          width:200px;
          span{
            width:145px;
            display: inline-block;
          }
        }
        .search-people{
          width:150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .search-year{
          width:118px;
        }
        .search-data{
          width:278px;
        }
        .search-data-val{
          width:238px;
          span{
            .icon-font{
              margin-right: 10px;
            }
          }
        }
        .search-operation{
          width:82px;
        }
        .search-operation-val{
          width:210px;
          span{
            display: inline-block;
            width:100px;
            height: 28px;
            line-height: 28px;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
          }
          .see-buy{
            color: #5488F9;
            border: 1px solid #5488F9;
            margin-right: 5px;
          }
          .see-contact{
            width:80px;
            border: 1px solid #CBD6E3;
          }
          .team-contact{
            width:80px;
            font-size: 13px;
            color: #B0C1D4;
            background: #FFFFFF;
            border: 1px solid #DFE3EB;
            border-radius: 4px;
          }
        }
      }
      .search-table-title{
        width:1200px;
        height: 44px;
        line-height: 44px;
        background: #F5F8FA;
        font-size: 13px;
        color: #33475B;
        border-top: 1px solid #DFE3EB;
      }
      .search-table-body{
        width:1200px;
        height: 60px;
        line-height: 60px;
        background: #fff;
        border-bottom:1px solid #DFE3EB;
        li{
          height: 60px;
          line-height: 60px;
        }
      }
    }
    .searchPagePage{
      margin-top:20px;
      margin-bottom: 50px;
      .el-pagination{
        padding-bottom: 30px;
      }
    }
  }

</style>
