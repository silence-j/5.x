<template>
  <div class="find-container" style="position: relative">

    <div class="input-contianer">
      <div class="new-Search">
<!--         <el-select v-model="select" placeholder="请选择" @change="changeSearch(select)">
          <el-option key="1" label="社交搜索" value="1" v-show="showChoose"></el-option>
          <el-option key="2" label="企业搜索" value="2" v-show="!showChoose"></el-option>
        </el-select> -->
        <div class="option-wrapper">社交搜索</div>
        <div class="social-search social-s" v-if="socialShow">
          <!--<span class="social-line"></span>-->
          <el-input placeholder="请输入社交关键字" v-model="searchFor" @keyup.enter.native="handClickIcon('S')">
            <el-button slot="append" icon="search" @click="handClickIcon('S')" class="el-button&#45;&#45;primary search_right_btn"></el-button>
          </el-input>
        </div>
        <div class="company-search" v-if="!socialShow">
          <div class="or-choose">or</div>
          <el-input class="company-name" placeholder="请输入企业名称" v-model="searchCompany" @keyup.enter.native="handClickIcon('C')"></el-input>
          <el-input class="product-name" placeholder="请输入产品名称" v-model="searchProduct" @keyup.enter.native="handClickIcon('C')">
            <el-button slot="append" icon="search" @click="handClickIcon('C')" class="el-button--primary search-one search_right_btn"></el-button>
          </el-input>
        </div>
      </div>
    </div>
    <!-- 只有一个搜索框有点丑，下面放张图片... -->
    <img class="tip-img" src="../../assets/img/develop/soical_bg.png" alt="">
    <div class="loading loading-circle loading-top" v-if="isLoading"></div>
    <div v-if="!isLoading" class="result-container">
      <!--暂无数据-->
      <div class="no-data" v-show="display">
        <div class="no-info">
          <img src="../../assets/img/monitor/no-post.png" alt="">
          <p>暂无数据</p>
        </div>
      </div>
      <!--表格头部-->
      <div class="new-table-title common-table" v-if="leadData.length > 0">
        <ul>
          <li class="new-name">姓名</li>
          <li class="new-country">国家</li>
          <li class="new-company">公司</li>
          <li class="new-position">职位</li>
          <li class="new-social newSocial">社交</li>
          <li class="new-mail">邮箱</li>
          <li class="new-operation">操作</li>
        </ul>
      </div>
      <!--表格内容-->
      <div class="new-table-body common-table" v-for="(item, index) in leadData" v-if="leadData.length > 0">
        <ul>
          <li class="new-name common-val hand-click" @click="jumpStaff(item.thirdAccountId, item.keywords)" v-if="item.keywords !== '' && item.keywords !== null">
            <!--<img v-if="item.type === 0" src="/static/img/default_avatar.jpg" alt="">-->
            <span class="name-val" :title="item.recommendName">{{item.recommendName}}</span>
          </li>
          <li class="new-name common-val" v-else="">
            <!--<img v-if="item.type === 0" src="/static/img/default_avatar.jpg" alt="">-->
            <!--<img :src="item.avatar" v-if="item.type === 1 && item.avatar !== null && item.avatar !== ''" alt="">-->
            <span class="name-val" :title="item.recommendName">{{item.recommendName}}</span>
          </li>
          <li class="new-country common-val">
            <span v-if="item.address.countriesAndRegions !== '' && item.address.countriesAndRegions !== null" class="n-c-val">
              <img :src="'../../../static/img/ImageFlag/'+ item.address.countriesAndRegions + '.png'" alt="">
              <span class="country-val">{{item.address.countriesAndRegions}}</span>
            </span>
            <span v-else="" class="n-c-val">—</span>
          </li>
          <li class="new-company common-val">
            <span v-if="item.experienceList.length !== 0 && [0].thirdInfoCompanyName !== null && item.experienceList[0].thirdInfoCompanyName !== ''" class="company-span">{{item.experienceList[0].thirdInfoCompanyName}}</span>
            <span v-else="" class="company-span">—</span>
          </li>
          <li class="new-position common-val">
            <span v-if="item.experienceList.length !== 0 && item.experienceList[0].position !== null && item.experienceList[0].position !== ''" :title="item.experienceList[0].position" class="n-p-val">{{item.experienceList[0].position}}</span>
            <span v-else="" class="n-p-val">—</span>
          </li>
          <li class="new-social common-val n-l-social">
            <span class="n-s-val">
              <span v-for="icon in item.includeList">
              <a :href="icon.url" target="_blank" v-if="icon.included === 1 && icon.value === 'facebook数据'"><em class="icon-font icon-facebook" style="margin-right: 10px" ></em></a>
                <a  target="_blank" v-if="icon.included === 0 && icon.value === 'facebook数据'"><em class="icon-font" style="margin-right: 10px;color: #B0C1D4;" >&#xe6d9;</em></a>

              <a :href="icon.url" target="_blank" v-if="icon.included === 1 && icon.value === 'twitter数据'"><em class="icon-font" style="color:#48B3FE;margin-right: 10px" v-if="icon.included === 1">&#xe621;</em></a>
                <a  target="_blank" v-if="icon.included === 0 && icon.value === 'twitter数据'"><em class="icon-font" style="color:#B0C1D4;margin-right: 10px" v-if="icon.included === 0">&#xe621;</em></a>

              <a :href="icon.url" target="_blank" v-if="icon.included === 1 && icon.value === 'linkedin数据'"><em class="icon-font icon-linkedin" style="margin-right: 10px" v-if="icon.included === 1"></em></a>
                <a  target="_blank" v-if="icon.included === 0 && icon.value === 'linkedin数据'"><em class="icon-font" style="margin-right: 10px;color:#B0C1D4;" v-if="icon.included === 0">&#xe616;</em></a>
            </span>
            <!--<span v-html="showLine(item.includeList)"></span>-->
            </span>
          </li>
          <li class="new-mail-val common-val">
            <span v-if="item.mail !== null && item.mail !== ''" class="n-m-val">{{item.mail}}</span>
            <span v-else="" class="n-m-val email-search" @click="explorEmail(item)" >邮箱深度挖掘</span>
            <!--<span v-else="" class="n-m-val">—</span>-->
          </li>
          <li class="new-operation-val common-val">
            <!--<el-tooltip class="item" effect="dark" content="添加" placement="top">-->
              <!--<div>-->
                <em class="icon-font plus-data add-it" @click="addContact(item, index)">&#xe6ad;<i>联系人</i></em>
              <!--</div>-->
            <!--</el-tooltip>-->
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <em class="icon-font del-data" @click="removeContact(item.recommendForUserId, index, item.type)">&#xe63f;</em>
            </el-tooltip>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import exploreAPI from '@/api/exploreAPI'
  import Util from '@/common/Util.js'
  export default{
    name: 'findCustomer',
    data () {
      return {
        searchFor: '',
        searchCompany: '',
        searchProduct: '',
        allList: [],
        leadData: [],
        leadAllData: [],
        leadComData: [],
        leadPerData: [],
        nowIndex: 30,
        nowComIndex: 0,
        nowPerIndex: 0,
//        emailExp: '邮箱深度挖掘',
        display: false,
        isLoading: false,
        userId: window.localStorage.userId,
        describe: '',
        serverLevel: '1',
        maxlen: -1,
        select: '1',
        showChoose: false,
//        重复删除
        delFor: true,
        expEmail: true,
//        搜索内容变化
        socialShow: this.$route.query.type === 2 ? false : true || true
      }
    },
    components: { exploreAPI },
    mounted () {
      this.routeMount()
      this.serverLevel = window.localStorage.serverLevel
//      数据获取
//      this.infoList({userId: window.localStorage.userId})
      // this.infoList()
    },
    watch: {
      maxlen () {
        if (this.maxlen === 0) {
          this.display = true
        }
      },
      searchCompany () {
        if (this.searchCompany !== '' || this.searchCompany.match(/^[ ]+$/) === false) {
          this.searchProduct = ''
        }
      },
      searchProduct () {
        if (this.searchProduct !== '' || this.searchProduct.match(/^[ ]+$/) === false) {
          this.searchCompany = ''
        }
      }
    },
    methods: {
//      邮箱深度挖掘
      explorEmail (item) {
        if (this.expEmail === true) {
          if (item.experienceList[0].website !== null && item.experienceList[0].website !== '') {
            this.expEmail = false
            let params = {
              'fullName': item.recommendName,
              'domain': item.experienceList[0].website || '',
              'thirdAccountId': item.thirdAccountId
            }
            exploreAPI.getEmail(params).then(res => {
              if (res.data.code === 0) {
                this.expEmail = true
                if (res.data.data.mail === '') {
                  item.mail = '—'
                  this.$message.success('暂未挖掘到邮箱信息')
                } else {
                  item.mail = res.data.data.mail
                  this.$message.success('邮箱深度挖掘完成')
                }
              }
            })
          } else {
            this.expEmail = true
            item.mail = '—'
            this.$message.success('暂未挖掘到邮箱信息')
          }
        }
      },
      changeSearch (val) {
        if (val === '2') {
          console.log('PPPPP')
          this.socialShow = false
          this.showChoose = true
          console.log(this.socialShow)
        } else if (val === '1') {
          this.socialShow = true
          this.showChoose = false
        }
        console.log(val)
      },
//      判断包含数据是否没有一个匹配
      showLine (arr) {
        let show = '—'
        for (var i = 0; i < arr.length; i++) {
          if ((arr[i].included === 1 && arr[i].value === 'facebook数据') || (arr[i].included === 1 && arr[i].value === 'twitter数据') || (arr[i].included === 1 && arr[i].value === 'linkedin数据')) {
            show = ''
          }
        }
        console.log(show)
        return show
      },
      routeMount () {
        let curLet = this.$route.query.typeOf
        if (curLet === false) {
          this.socialShow = this.$route.query.typeOf
          this.select = '2'
        }
      },
      infoList () {
        this.isLoading = true
        exploreAPI.getLeads().then(res => {
          this.isLoading = false
          if (res.data.code === 0) {
            if (res.data.data.length > 0) {
              this.maxlen = res.data.data.length
              for (let j = 0; j < res.data.data.length; j++) {
                for (let x = 0; x < res.data.data[j].includeList.length; x++) {
                  if (res.data.data[j].includeList[x].url !== null && res.data.data[j].includeList[x].url !== '') {
                    res.data.data[j].includeList[x].url = Util.checkUrl(res.data.data[j].includeList[x].url)
                  }
                }
              }
              this.display = false
//              push公司/员工
              for (let i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].type === 0) {
                  this.leadAllData.push(res.data.data[i])
                }
              }
              if (this.leadAllData.length > 30) {
                this.leadData = this.leadAllData.slice(0, 30)
              } else {
                this.leadData = this.leadAllData
              }
            } else {
              this.display = true
            }
          }
        })
      },
//      切换搜索内容
      changeSearchFor (val) {
//        let url = window.location.href
        if (val === 'social') {
          this.socialShow = true
        } else {
          this.socialShow = false
//          url = url + '?type=' + '0'
        }
//        window.location.href = url
      },
//      搜索标题
      handClickIcon (val) {
        console.log(this.select)
        this.page = 1
//        this.page = this.$store.getters.searchPage
        this.$store.commit('DEVELOP_SEARCH_PAGE', {page: this.page})
        if (val === 'S') {
          if (this.searchFor === '' || this.searchFor.match(/^[ ]+$/)) {
            this.$message.error('请输入搜索内容')
          }
          this.$router.push({
            path: '/socialResult',
            query: {searchText: this.searchFor}
          })
        } else if (val === 'C') {
          if ((this.searchCompany === '' || this.searchCompany.match(/^[ ]+$/)) && (this.searchProduct === '' || this.searchProduct.match(/^[ ]+$/))) {
            this.$message.error('请输入搜索内容')
          } else {
            if (this.searchCompany !== '' || this.searchCompany.match(/^[ ]+$/) === false) {
              this.$router.push({
                path: '/searchResult',
                query: {
                  searchText: this.searchCompany,
                  searchBy: 0
                }
              })
            } else {
              this.$router.push({
                path: '/searchResult',
                query: {
                  searchText: this.searchProduct,
                  searchBy: 1
                }
              })
            }
          }
        }
//        if (this.searchFor === '' || this.searchFor.match(/^[ ]+$/)) {
//          this.$message.error('请输入搜索内容')
//        } else {
//          if (this.select === '2') {    // 社交搜索
//            this.$router.push({
//              path: '/searchResult',
//              query: {searchText: this.searchFor}
//            })
//          } else {  // 社交搜索
//            this.$router.push({
//              path: '/socialResult',
//              query: {searchText: this.searchFor}
//            })
//          }
//        }
      },
//      添加联系人
      addContact (item, index) {
        for (let i = 0; i < item.thirdInfoList.length; i++) {
          if (item.thirdInfoList[i].homepageUrl !== null && item.thirdInfoList[i].homepageUrl !== '') {
            item.thirdInfoList[i].homepageUrl = Util.checkUrl(item.thirdInfoList[i].homepageUrl)
          }
        }
        if (item.experienceList[0].website !== null && item.experienceList[0].website !== '') {
          item.experienceList[0].website = Util.checkUrl(item.experienceList[0].website)
        }
        if (item.mail === '—') {
          item.mail = ''
        }
        if (item.type === 0) {
          const params = {
            type: item.type,
            userId: this.userId,
            name: item.recommendName,
            companyName: '',
            avatar: item.avatar,
            mail: item.mail,
            telephone: item.telephone,
            address: JSON.stringify(item.address),
            thirdAccountId: item.thirdAccountId,
            createSource: 'recommend_create',
            keywords: item.keywords,
            remark: item.desc,
            socialAccountType: 6,
            experienceList: JSON.stringify(item.experienceList),
            thirdInfoList: JSON.stringify(item.thirdInfoList)
          }
          if (item.experienceList !== null && item.experienceList.length !== 0) {
            params.companyName = item.experienceList[0].thirdInfoCompanyName
          }
          if (item.thirdAccountType !== null && item.thirdAccountType !== undefined && item.thirdAccountType !== '') {
            params.socialAccountType = item.thirdAccountType
          }
          exploreAPI.addContact(params).then(res => {
            if (res.data.code === 0) {
              this.maxlen--
              if (this.nowIndex < this.leadAllData.length - 1) {
                this.leadData.splice(index, 1, this.leadAllData[this.nowIndex])
                this.nowIndex++
              } else {
                this.leadData.splice(index, 1)
              }
//              if (this.nowPerIndex < this.leadPerData.length) {
//                this.leadData.splice(index, 1, this.leadPerData[this.nowPerIndex])
//                this.nowPerIndex ++
//              } else if (this.nowComIndex < this.leadComData.length) {
//                this.leadData.splice(index, 1, this.leadComData[this.nowComIndex])
//                this.nowComIndex ++
//              } else {
//                this.leadData.splice(index, 1)
//              }
              this.$message.success('添加联系人成功')
            } else {
              this.$message({message: '添加失败', type: 'error'})
            }
          })
        }
//        else if (item.type === 1) {
//          const params = {
//            type: item.type,
//            userId: this.userId,
//            name: item.recommendName,
//            avatar: item.avatar,
//            mail: item.mail,
//            telephone: item.telephone,
//            address: JSON.stringify(item.address),
//            thirdAccountId: item.thirdAccountId,
//            createSource: 'recommend_create',
//            keywords: item.keywords,
//            remark: item.desc,
//            socialAccountType: 6,
//            industry: item.industry,
//            website: item.website,
//            thirdInfoList: JSON.stringify(item.thirdInfoList),
//            companySize: item.companySize
//          }
//          exploreAPI.addContact(params).then(res => {
//            if (res.data.code === 0) {
//              this.maxlen--
//              if (this.nowComIndex < this.leadComData.length) {
//                this.leadData.splice(index, 1, this.leadComData[this.nowComIndex])
//                this.nowComIndex++
//              } else if (this.nowPerIndex < this.leadPerData.length) {
//                this.leadData.splice(index, 1, this.leadPerData[this.nowPerIndex])
//                this.nowPerIndex++
//              } else {
//                this.leadData.splice(index, 1)
//              }
//              this.$message.success('添加公司成功')
//            } else {
//              this.$message.fail('添加失败')
//            }
//          })
//        }
      },
//      移除联系人
      removeContact (id, index, type) {
        if (this.delFor === true) {
          this.delFor = false
          let params = {recommendForUserId: id, userId: window.localStorage.userId}
          if (type === 0) {
            exploreAPI.removeContact(params).then(res => {
              if (res.data.code === 0) {
                this.delFor = true
                if (this.nowIndex < this.leadAllData.length - 1) {
                  this.leadData.splice(index, 1, this.leadAllData[this.nowIndex])
                  this.nowIndex++
                } else {
                  this.leadData.splice(index, 1)
                }
              }
            })
          }
        }

//        if (type === 1) {
//          exploreAPI.removeContact(params).then(res => {
//            if (res.data.code === 0) {
//              this.maxlen--
//              if (this.nowComIndex < this.leadComData.length - 1) {
//                this.leadData.splice(index, 1, this.leadComData[this.nowComIndex])
//                this.nowComIndex ++
//              } else if (this.nowPerIndex < this.leadPerData.length - 1) {
//                this.leadData.splice(index, 1, this.leadPerData[this.nowPerIndex])
//                this.nowPerIndex++
//              } else {
//                this.leadData.splice(index, 1)
//              }
//            }
//          })
//        }
      },
//      跳转到公司详情
      jumpCompany (id, keywords) {
        console.log(id)
        this.$router.push(
          {
            path: '/companyDetail',
            query: {id: id, source: 'recommend', keywords: keywords}
          }
        )
      },
//      跳转到员工详情
      jumpStaff (id, keywords) {
//        if (this.socialShow === false) {
//          window.location.href = window.location.href + '?type=' + this.socialShow
//        } else {
//
//        }
        if (this.socialShow === false) {
          this.$router.push({
            path: '/staffDetail',
            query: {id: id, source: 'recommend', keywords: keywords, type: 2}
          })
        } else {
          this.$router.push({
            path: '/staffDetail',
            query: {id: id, source: 'recommend', keywords: keywords}
          })
        }
      },
      hello () {
        this.$store.dispatch('getList')
        console.log(555)
        console.log(this.$store.getters.leadsList)
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/variable.less';
  .find-container{
    margin-top: 140px;
    margin-left: 120px;
    .result-container{
      margin-bottom: 60px;
    }
    .input-contianer{
      width:1200px;
      margin-bottom: 20px;
      .new-Search{
        font-size: 0;
        .el-select{
          width:100px;
          display: inline-block;
          .el-input__icon{
            z-index: 1;
          }
          .el-input__icon:hover + .el-input__inner{
            border: 1px solid #02AAAA;
            /*border-right: none;*/
          }
          .el-input__inner{
            font-size: 14px;
            color: #4F6D95;
            padding-left: 13px;
            padding-right: 8px;
            border-radius: 4px 0 0 4px;
            border-right: none;
            position: relative;
            top:-1px;
            &:hover{
              border: 1px solid #02AAAA;
            }
          }
        }
        .option-wrapper{
          position: relative;
          top: -1px;
          width:100px;
          height: 60px;
          line-height: 60px;
          text-align: center;
          display: none;
          vertical-align: top;
          font-size: 14px;
          color: #4F6D95;
          padding-left: 13px;
          padding-right: 8px;
          box-sizing: border-box;
          border-radius: 4px 0 0 4px;
          border-right: none;
          border: 1px solid #cbd6e3;
          background-color: #fff;
          border-right: 1px solid transparent;
          &:hover{
            border: 1px solid #02AAAA;
          }

        }
      }
      .search-info{
        margin-top: 200px;
        font-size: 0;
        .search-tab{
          display: inline-block;
          width:102px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background: #fff;
          border-radius: 4px 4px 0 0;
          font-size: 13px;
          color: #4F6D95;
          border: 1px solid #DFE3EB;
          cursor: pointer;
        }
        .active{
          background: #5488F9;
          font-size: 13px;
          color: #FFFFFF;
        }
      }
      .el-input{
        .el-input-group__prepend{
          background: #fff;
          .el-select{
            width:120px;
          }
        }
        .el-icon-search{
          left:0;
        }
        .el-input__inner{
          padding-left: 22px;
          height: 60px;
          border-radius: 0;
          &.focus{
            border: 1px solid #fff;
            box-shadow: 1px 0 1px 0 #fff;
          }
        }
        .el-input-group__append{
          background: #5488F9;
          .el-button{
            text-align: center;
            width: 64px;
            .el-icon-search{
              color: #fff;
            }
          }
        }
        .el-input-group__append .search_right_btn{
          padding:22px 0;
        }
      }
      .social-search{
        display: inline-block;
        width:960px;
        vertical-align: top;
        .social-line{
          z-index: 999;
          display: inline-block;
          height: 45px;
          position: absolute;
          width: 1px;
          background: #DFE3EB;
          top: 6px;
        }
        .el-input{
          position: relative;
          top:-1px;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          .el-input__inner{
            border-radius: 0;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            box-shadow: 1px 0 1px 0 rgba(0, 0, 0, 0.3);
          }
        }
        /*.el-input:hover + .social-line{*/
          /*background: #02AAAA;*/
        /*}*/
      }
      .social-s{
        .el-input{
          .el-input__inner{
            /*border-left: none;*/
          }
        }
      }
      .company-search{
        width:1100px;
        font-size: 0;
        display: inline-block;
        vertical-align: bottom;
        position: relative;
        .or-choose{
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
          .company-name{
            vertical-align: text-bottom;
          }
        }
        .el-input{
          width:550px;
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
            .search-one{
              line-height: 34px;
            }
            .el-button{

            }
          }
          .el-input__inner{
            width:550px;
            border-radius: 0;
          }
        }
      }
    }
    .tip-img{
      margin-top: 150px;
      width: 700px;
      margin-left: 130px;
    }
    .loading-top{
      margin-top: 150px;
    }
    .no-data{
      .no-info{
        text-align: center;
        margin-top: 100px;
        p{
          margin-top: 10px;
        }
      }
    }
    .common-table{
      ul{
        li{
          float: left;
        }
        .common-val{
          height: 71px;
          line-height: 71px;
        }
        .hand-click{
          cursor: pointer;
        }
        .new-name{
          padding-left: 24px;
          width:156px;
          position: relative;
          img{
            position: absolute;
            top:15px;
            display: inline-block;
            width:40px;
            height: 40px;
            border-radius: 50%;
            /*background: pink;*/
          }
          .img-default{
            position: absolute;
            top:15px;
            width:40px;
            height: 40px;
            border-radius: 50%;
            background: #DEE2ED;
            overflow: hidden;
            em{
              font-size: 35px;
              color: #F2F5F8;
              position: absolute;
              top: -13px;
              left: 0px;
            }
          }
          .name-val{
            /*padding-left: 50px;*/
            display: inline-block;
            width:142px;
            height: inherit;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:hover{
              color: #5488F9;
            }
          }
        }
        .new-country{
          width:160px;
          position: relative;
          img{
            position: absolute;
            top:30px;
            background-image: url('../../../static/img/ImageFlag/common.png');
            display: inline-block;
            width:18px;
            height: 12px;
            border-radius: 2px;
          }
          .country-val{
            padding-left: 28px;
          }
          .n-c-val{
            display: inline-block;
            width:140px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .new-company{
          width:238px;
          .company-span{
            display: inline-block;
            width: 218px;
            height: inherit;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .new-position{
          width:132px;
          .n-p-val{
            display: inline-block;
            width:112px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .new-social{
          width:147px;
        }
        /*.newSocial{*/
          /*width:147px;*/
        /*}*/
        .n-l-social{
          width:147px;
          .n-s-val{
            display: inline-block;
            width:127px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .new-mail{
          width:200px;
          /*text-align: center;*/
        }
        .new-mail-val{
          width:195px;
          .n-m-val{
            display: inline-block;
            width:175px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .email-search{
            height: 32px;
            line-height: 32px;
            vertical-align: middle;
            border: 1px solid darkgrey;
            text-align: center;
            cursor: pointer;
          }
        }
        .new-operation{
          width:116px;
          /*text-align: right;*/
        }
        .new-operation-val{
          width:127px;
          .add-it{
            display: inline-block;
            width:86px;
            background: #5488F9;
            height: 32px;
            line-height: 32px;
            border-radius: 4px;
            text-align: center;
            color: #fff;
            font-size: 13px;
            cursor: pointer;
            i{
              margin-left: 5px;
            }
          }
          .del-data{
            font-size: 15px;
            color: #B0C1D4;
            margin-left: 10px;
            cursor: pointer;
          }
          /*.plus-data:hover{*/
            /*color: #5488F9;*/
          /*}*/
          .del-data:hover{
            color: #5488F9;
          }
        }
      }
    }
    .new-table-title{
      height: 42px;
      line-height: 44px;
      width:1198px;
      background: #F5F8FA;
      font-size: 13px;
      color: #33475B;
      /*border: 1px solid #DFE3EB;*/
    }
    .new-table-body{
      background: #fff;
      width:1200px;
      height: 71px;
      line-height: 71px;
      border-top:1px solid #DFE3EB;
      &:hover{
        background:  #F5F8FA;
      }
    }
  }
  .el-tooltip__popper{
    .popper__arrow{
      left:0;
    }
  }
  body{
    .el-select-dropdown {
      .el-scrollbar{
        .el-select-dropdown__wrap{
          .el-scrollbar__view{
            .el-select-dropdown__item{
              color: #4F6D95;
              height: 60px;
              padding: 20px;
              font-size: 14px;
              background: #fff;
              &:hover{
                background: #fff;
              }
            }
          }
        }
      }
    }
  }
</style>
