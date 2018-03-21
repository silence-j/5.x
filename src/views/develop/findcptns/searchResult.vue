<template>
  <div class="search-info">
    <!--<router-link to="/develop">-->
      <p class="title" @click="backDevelop">
        <!--<em class="icon-font">&#xe600;</em> -->
      <span><img src="../../../../src/assets/img/left.png" alt="" class="left-back" /></span>
      返回发现新客户</p>
    <!--</router-link>-->
    <div class="searchOfKind">
      <div class="choose-or">or</div>
      <el-input class="companyName" placeholder="请输入企业名称" v-model="searchCompany" @keyup.enter.native="handClickIcon"></el-input>
      <el-input class="productName" placeholder="请输入产品名称" v-model="searchProduct" @keyup.enter.native="handClickIcon">
        <el-button slot="append" icon="search" @click="handClickIcon" class="el-button--primary result-search search_right_btn"></el-button>
      </el-input>
    </div>

    <!--<el-input-->
      <!--v-model="searchFor"-->
      <!--icon="search"-->
      <!--:on-icon-click="handClickIcon"-->
      <!--@keyup.enter.native="handClickIcon">-->
    <!--</el-input>-->
    <p class="diff-choose">
      <el-select v-model="valueCountry" @change="changeCountry">
        <el-option
          v-for="(item, keyIndex) in country"
          :key="keyIndex"
          :label="item.dictdataName"
          :value="item.dictdataCode">
        </el-option>
      </el-select>
      <el-select
        @change="changeDataType"
        :placeholder="'包含数据：('+checkedConditions.length +'/'+recordFilters.length+')'" class="customer-filters">
        <div class="customer-wrap">
          <el-checkbox class="condition-item"  v-model="checkAll" @change="handleCheckAllChange">选择全部</el-checkbox>
          <div style="margin: 14px 0 0 0;border-bottom:1px solid #EAF0F6;"></div>
          <el-checkbox-group v-model="checkedConditions" @change="handleCheckedCitiesChange">
            <el-checkbox class="condition-item" v-for="item in recordFilters"
                         :label="item" key="item">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-option style="display:none;" value="">
        </el-option>
      </el-select>
      <!--<el-select v-model="valueIndustry" placeholder="全部行业" class="industry-select" @change="changeIndustry">
        <el-option
          v-for="(item,keyIndex) in industry"
          :key="keyIndex"
          :label="item.dictdataName"
          :value="item.id">
        </el-option>
      </el-select>-->
    </p>
      <!--搜素加载页-->
      <ul v-show="searchLoad">
        <div class="loading loading-circle loading-top" style="position: relative; top: 100px;"></div>
        <!--<li class="search-loading" v-for="item in number">-->
          <!--<p class="gray-top"></p>-->
          <!--<p class="gray-middle"></p>-->
          <!--<p class="gray-middle"></p>-->
          <!--<p class="gray-middle"></p>-->
          <!--<p class="gray-top"></p>-->
        <!--</li>-->
      </ul>
    <div v-show="!searchLoad" class="cont-all">
      <!--暂无搜索结果-->
      <div class="no-data" v-show="isData">
        <div class="no-search">
          <img src="../../../assets/img/monitor/social-noData.png" alt="">
          <p>尚未为您匹配到合适数据</p>
        </div>
      </div>
      <div class="search-content" >
        <!--表格头部-->
        <div class="common-search search-table-title" v-if="searchInfo.length > 0">
          <ul>
            <li class="search-name">公司名称</li>
            <li class="search-country">国家</li>
            <li class="search-address">地址</li>
            <li class="search-staff">公司规模</li>
            <!--<li class="search-year">销售额</li>-->
            <li class="search-data">数据内容</li>
            <li class="search-operation">操作</li>
          </ul>
        </div>
        <!--表格内容-->
        <div class="common-search search-table-body" v-if="searchInfo.length > 0" v-for="item in searchInfo">
          <ul>
            <li class="search-name" :title="item.name" @click="jumpCompany(item.id)">{{item.name}}</li>
            <li class="search-country">
              <img :src="'../../../../static/img/ImageFlag/'+ item.address.countriesAndRegions + '.png'" alt="">
              <span class="country-val">{{item.address.countriesAndRegions}}</span>
            </li>
            <li class="search-address">
              <span class="address-val" v-if="item.address.location !== '' && item.address.location !== null">
                {{item.address.location}}
              </span>
              <span v-else>—</span>
            </li>
            <li class="search-staff">
              <span v-if="item.companySize !== null && item.companySize !== '' && item.companySize !== 0">{{item.companySize | companySize}}</span>
              <span v-else="">—</span>
            </li>
            <!--<li class="search-year">-->
              <!--<span v-if="item.sales !== '' && item.sales !== null">{{item.sales}}</span>-->
              <!--<span v-else>—</span>-->
            <!--</li>-->
            <li class="search-data-val">
              <span v-for="icon in item.includeList">
                <em class="icon-font phone" style="color: #5488F9;" v-if="icon.value == '电话数据' && icon.included == 1">&#xe676;</em>
                <em class="icon-font phone" style="color: #B0C1D4;" v-if="icon.value == '电话数据' && icon.included == 0">&#xe676;</em>
                <em class="icon-font mail" style="color: #00B8CC;" v-if="icon.value == '邮箱数据' && icon.included == 1">&#xe614;</em>
                <em class="icon-font mail" style="color: #B0C1D4;" v-if="icon.value == '邮箱数据' && icon.included == 0">&#xe614;</em>
                <em class="icon-font user" style="color: #00A8FF;" v-if="icon.value == '员工数据' && icon.included == 1">&#xe680;</em>
                <em class="icon-font user" style="color: #B0C1D4;" v-if="icon.value == '员工数据' && icon.included == 0">&#xe680;</em>
                <a :href="icon.url"><em class="icon-font fb" style="color: #4D7CE7;" v-if="icon.value == 'facebook数据' && icon.included == 1">&#xe6d9;</em></a>
                <a><em class="icon-font fb" style="color: #B0C1D4;" v-if="icon.value == 'facebook数据' && icon.included == 0">&#xe6d9;</em></a>
                <em class="icon-font lead" style="color: #00A8FF;" v-if="icon.value == '海关数据' && icon.included == 1">&#xe691;</em>
                <em class="icon-font lead" style="color: #B0C1D4;" v-if="icon.value == '海关数据' && icon.included == 0">&#xe691;</em>
                <a :href="icon.url"><em class="icon-font tw" style="color: #00A8FF;" v-if="icon.value == 'twitter数据' && icon.included == 1">&#xe621;</em></a>
                <a ><em class="icon-font tw" style="color: #B0C1D4;" v-if="icon.value == 'twitter数据' && icon.included == 0">&#xe621;</em></a>
                <a :href="icon.url"><em class="icon-font linkedin" style="color: #279BD6;" v-if="icon.value == 'linkedin数据' && icon.included == 1">&#xe616;</em></a>
                <a ><em class="icon-font linkedin" style="color: #B0C1D4;" v-if="icon.value == 'linkedin数据' && icon.included == 0">&#xe616;</em></a>
              </span>
              <!--<span v-html="isShowLine(item.includeList)"></span>-->
            </li>
            <li class="search-operation-val">
              <span @click="addCompany(item)" v-if="item.added == false"><em class="icon-font add"  >&#xe6ad;</em>加入联系人</span>
              <span @click="showCompany(item.contactsId)" v-if="item.added == true" class="see-contact"><em class="icon-eye add"></em>查看联系人</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="searchPage-page" v-if="showPage">
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
</template>

<script>
  import exploreAPI from '@/api/exploreAPI'
  import Util from '@/common/Util.js'
  export default{
    name: '',
    data () {
      return {
        isData: false,
        searchFor: '',
        searchCompany: this.$route.query.searchBy === '0' ? this.$route.query.searchText : '',
        searchProduct: this.$route.query.searchBy === '1' ? this.$route.query.searchText : '',
        searchLoad: true,
        showPage: false,
        searchInfo: [],
        country: [],
        industry: [],
        valueCountry: '全部国家/地区',
        valueIndustry: '全部行业',
        checkedConditions: [],
        checkAll: true,
        searchPage: {
          page: this.$store.getters.searchPage || 1,
          pageSize: 9,
          totalCount: 0
        },
        recordFilters: [{
          label: '联系人',
          value: '0'
        }, {
          label: '海关数据',
          value: '1'
        }, {
          label: 'Facebook',
          value: '2'
        }, {
          label: '领英',
          value: '3'
        }, {
          label: '联系方式',
          value: '4'
        }, {
          label: '域名',
          value: '5'
        }],
        adLayout: 'prev, pager, next, sizes, jumper, ->',
        dataType: 6,
        countryVal: '',
        industryVal: '',
        page: 1,
        pre: true,
        next: false,
        number: 9,
        totalPage: -1,
        userId: window.localStorage.userId,
        platformstr: '',
        includestr: ''
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
    components: { },
    mounted () {
      this.checkedConditions = this.recordFilters
      if (this.$route.query.searchBy === 0) {
        this.searchCompany = this.$route.query.searchText
      } else if (this.$route.query.searchBy === 1) {
        this.searchProduct = this.$route.query.searchText
      }
      this.searchFor = this.$route.query.searchText
      let params = {keywords: this.searchFor, page: this.$store.getters.searchPage || this.searchPage.page, pageSize: this.searchPage.pageSize, region: this.countryVal, industry: this.industryVal, searchBy: this.$route.query.searchBy}
      if (this.platformstr !== '') {
        params.platform = this.platformstr
      }
      if (this.includestr !== '') {
        params.include = this.includestr
      }
      this.infoResult(params)
    },
    watch: {
//      监听页数的变化
      page () {
        if (this.page === 1) {
          this.pre = true
        } else {
          this.pre = false
        }
        if (this.page === this.totalPage) {
          this.next = true
        } else {
          this.next = false
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
      backDevelop () {
        let curShow = false
        this.$router.push({
          path: '/develop',
          query: {
            typeOf: curShow
          }
        })
      },
      /**
       * 全选按钮
       * @param  {[type]} event [description]
       * @return {[type]}       [description]
       */
      handleCheckAllChange (event) {
        this.checkedConditions = event.target.checked ? this.recordFilters : []
        this.dataScreening()
      },
      /**
       * 下拉点击 单个筛选框框
       * @return {[type]} [description]
       */
      handleCheckedCitiesChange () {
        /**
         * 判断 全选状态
         * @type {[type]}
         */
        this.checkAll = this.checkedConditions.length === this.recordFilters.length
        this.dataScreening()
      },
      /**
       * 包含数据筛选
       */
      dataScreening () {
        let curBy = 0
        if (this.searchCompany === '' || this.searchCompany.match(/^[ ]+$/)) {
          curBy = 1
        }
        let checkedList = this.checkedConditions
        let params = {keywords: this.searchFor, page: this.searchPage.page, pageSize: this.searchPage.pageSize, region: this.countryVal, searchBy: curBy}
//        let params = {keywords: this.searchFor, page: this.searchPage.page, pageSize: this.searchPage.pageSize, region: this.countryVal}
        if (checkedList.length === 0) {
          params.platform = ''
          params.include = ''
        } else {
          let platformString = ''
          let includeString = ''
          checkedList.forEach((checkedValue) => {
            if (checkedValue.value === '2' || checkedValue.value === '3' || checkedValue.value === '1') {   // 2:facebook 3:linkedin 1:海关
              let keyvalue = ''
              if (checkedValue.value === '2') {   // facebook
                keyvalue = '0'
              }
              if (checkedValue.value === '3') {  // linkedin
                keyvalue = '2'
              }
              if (checkedValue.value === '1') {   // 海关
                keyvalue = '4'
              }
              if (platformString === '') {
                platformString = keyvalue
              } else {
                platformString = platformString + ',' + keyvalue
              }
            } else {
              let keyvalue = ''
              if (checkedValue.value === '0') {   // 联系人
                keyvalue = '0'
              }
              if (checkedValue.value === '4') {  // 联系方式
                keyvalue = '1'
              }
              if (checkedValue.value === '5') {   // 域名
                keyvalue = '2'
              }
              if (includeString === '') {
                includeString = keyvalue
              } else {
                includeString = includeString + ',' + keyvalue
              }
            }
          })
          this.includestr = includeString
          this.platformstr = platformString
          if (platformString !== '') {
            params.platform = platformString
          }
          if (includeString !== '') {
            params.include = includeString
          }
        }
        this.infoResult(params)
      },
//      搜索接口
      handClickIcon () {
        let curSearchBy = 0
        if (this.searchCompany === '' || this.searchCompany.match(/^[ ]+$/)) {
          this.searchFor = this.searchProduct
          window.location.hash = 'searchResult?searchText=' + this.searchFor + '&searchBy=1'
          curSearchBy = 1
        } else {
          this.searchFor = this.searchCompany
          window.location.hash = 'searchResult?searchText=' + this.searchFor + '&searchBy=0'
        }
        this.searchPage.page = 1
        this.$store.commit('DEVELOP_SEARCH_PAGE', {page: this.searchPage.page})
//        window.location.hash = 'searchResult?searchText=' + this.searchFor + '&searchBy=' + this.$route.query.searchBy
        let params = {keywords: this.searchFor, page: this.searchPage.page, pageSize: this.searchPage.pageSize, region: this.countryVal, industry: this.industryVal, searchBy: curSearchBy}
        if (this.platformstr !== '') {
          params.platform = this.platformstr
        }
        if (this.includestr !== '') {
          params.include = this.includestr
        }
        this.infoResult(params)
      },
      infoResult (val) {
        this.searchLoad = true
        exploreAPI.getSearchResult(val).then(res => {
          this.searchLoad = false
          if (res.data.code === 0) {
            this.pre = true
            this.next = false
            for (let j = 0; j < res.data.data.records.length; j++) {
              for (let x = 0; x < res.data.data.records[j].includeList.length; x++) {
                if (res.data.data.records[j].includeList[x].url !== null && res.data.data.records[j].includeList[x].url !== '') {
                  res.data.data.records[j].includeList[x].url = Util.checkUrl(res.data.data.records[j].includeList[x].url)
                }
              }
            }
            this.searchInfo = res.data.data.records
            this.searchPage.totalCount = res.data.data.totalCount
            if (res.data.data.records.length > 0) {
              this.isData = false
            } else {
              this.isData = true
            }
            if (res.data.data.totalPages > 1) {
              this.showPage = true
            } else {
              this.showPage = false
            }
          } else {
            this.$message.warning(res.data.message)
          }
        })
      },
//      国家的值发生改变
      changeCountry (val) {
        let curBy = 0
        if (this.searchCompany === '' || this.searchCompany.match(/^[ ]+$/)) {
          curBy = 1
        }
        this.countryVal = val
        if (val === undefined) this.countryVal = ''
        this.searchPage.page = 1
        let obj = {keywords: this.searchFor, page: this.searchPage.page, pageSize: this.searchPage.pageSize, region: this.countryVal, searchBy: curBy}
        if (this.platformstr !== '') {
          obj.platform = this.platformstr
        }
        console.log('includestr:' + this.includestr)
        if (this.includestr !== '') {
          obj.include = this.includestr
        }
        this.infoResult(obj)
      },
      //      数据类型改变
      changeDataType (val) {
      },
      changeIndustry (val) {
        let curBy = 0
        if (this.searchCompany === '' || this.searchCompany.match(/^[ ]+$/)) {
          curBy = 1
        }
        this.searchPage.page = 1
        this.industryVal = val
        if (val === undefined) this.industryVal = ''
        let obj = {keywords: this.searchFor, page: this.searchPage.page, pageSize: this.searchPage.pageSize, region: this.countryVal, industry: this.industryVal, searchBy: curBy}
        this.infoResult(obj)
      },
//      添加探索公司
      addCompany (item) {
        for (let i = 0; i < item.thirdInfoList.length; i++) {
          if (item.thirdInfoList[i].homepageUrl !== null && item.thirdInfoList[i].homepageUrl !== '') {
            item.thirdInfoList[i].homepageUrl = Util.checkUrl(item.thirdInfoList[i].homepageUrl)
          }
        }
        if (item.website !== null && item.website !== '') {
          item.website = Util.checkUrl(item.website)
        }
        let params = {
          type: 1,
          userId: this.userId,
          name: item.name,
          avatar: item.avatar,
          mail: item.mail,
          sales: item.sales,
          telephone: item.telephone,
          address: JSON.stringify(item.address),
          thirdAccountId: item.id,
          createSource: 'recommend_search_create',
          keywords: this.searchFor,
          remark: item.intro,
          socialAccountType: 6,
          industry: item.industry,
          website: item.website,
          thirdInfoList: JSON.stringify(item.thirdInfoList),
          companySize: item.companySize,
          mainProduct: item.products
        }
        exploreAPI.addContact(params).then(res => {
          if (!res.data.code) {
//            this.$store.commit('FIND_COMPANYID', {companyId: res.data.data.id})
            item.contactsId = res.data.data.id
            item.added = true
            this.$message.success('添加成功')
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
//      跳转公司详情
      jumpCompany (id) {
        console.log('跳转前')
        console.log(this.searchPage.page)
        this.$store.commit('DEVELOP_SEARCH_PAGE', {page: this.searchPage.page})
        this.$router.push(
          {
            path: '/companyDetail',
            query: {id: id, source: 'search', keywords: this.searchFor}
          }
        )
      },
//      跳转到联系人公司详情
      showCompany (id) {
        this.$router.push({
          path: '/contactDetail',
          query: {
            contactId: id,
            contactType: 1
          }
        })
      },
      SearchhandlePageChange (page) {
        let curBy = 0
        if (this.searchCompany === '' || this.searchCompany.match(/^[ ]+$/)) {
          curBy = 1
        }
        this.searchPage.page = page
        let params = {keywords: this.searchFor, page: this.searchPage.page, pageSize: this.searchPage.pageSize, region: this.countryVal, industry: this.industryVal, searchBy: curBy}
        if (this.platformstr !== '') {
          params.platform = this.platformstr
        }
        if (this.includestr !== '') {
          params.include = this.includestr
        }
        this.infoResult(params)
      },
      SearchhandleSizeChange (size) {
        let curBy = 0
        if (this.searchCompany === '' || this.searchCompany.match(/^[ ]+$/)) {
          curBy = 1
        }
        this.searchPage.pageSize = size
        let params = {keywords: this.searchFor, page: this.searchPage.page, pageSize: this.searchPage.pageSize, region: this.countryVal, industry: this.industryVal, searchBy: curBy}
        if (this.platformstr !== '') {
          params.platform = this.platformstr
        }
        if (this.includestr !== '') {
          params.include = this.includestr
        }
        this.infoResult(params)
      },
//      包含数据是否返回横线
      isShowLine (arr) {
        let show = '—'
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].included === 1) {
            show = ''
          }
        }
        return show
      }
    },
    created () {
      // 国家、地区列表
      exploreAPI.getCountry({dictCode: 'COUNTRY_REGION'}).then(res => {
        this.country = res.data.data
        this.country.unshift({dictdataName: '全部国家/地区'})
      })
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../assets/style/base";
  @import "../../../assets/style/variable";
  @import '../../../assets/style/page';
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
  .search-info{
    padding-top: 30px;
    margin: 0 auto;
    width:1200px;
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
        .no-search{
          margin-top: 100px;
          text-align: center;
          p{
            margin-top: 15px;
          }
        }
      }

    /*加载页样式*/
  /*  .search-loading{
      .animation(loadingColor,1s,infinite);
      width:26%;
      height: 202px;
      margin-bottom: 30px;
      background: #fff;
      float: left;
      position: relative;
      padding: 40px 30px;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
      border-radius: 4px;
      margin-right: 1.75%;
      margin-left: 1.75%;
      .gray-top{
        height: 60px;
        background: #F5F8FA;
        border-radius: 2px;
        margin-bottom: 12px;
      }
      .gray-middle{
        width:186px;
        height: 16px;
        background: #F5F8FA;
        border-radius: 2px;
        margin-bottom: 10px;
      }
    }
    li:nth-child(3n+1){
      margin-left: 0;
    }
    li:nth-child(3n){
      margin-right: 0;
    }*/
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
          width:229px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          &:hover{
            color: #5488F9;
          }
        }
        .search-country{
          width:177px;
          position: relative;
          img{
            position: absolute;
            top:30px;
            background-image: url('../../../../static/img/ImageFlag/common.png');
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
        .search-address{
          width:282px;
          .address-val{
            display: inline-block;
            width:250px;
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
        .search-staff{
          width:114px;
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
          width:122px;
          span{
            display: inline-block;
            width:100px;
            height: 28px;
            line-height: 28px;
            background: #5488F9;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            .add{
              margin: 0 8px;
            }
          }
          .see-contact{
            background: #fff;
            font-size: 13px;
            color: #33475B;
            border: 1px solid #CBD6E3;
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
      }
      .search-table-body{
        width:1200px;
        height: 71px;
        line-height: 71px;
        background: #fff;
        border-top:1px solid #DFE3EB;
        li{
          height: 71px;
          line-height: 71px;
        }
      }
    }
    .searchPage-page{
      margin-top:20px;
      margin-bottom: 50px;
      .el-pagination{
        text-align: center;
      }
    }

    /*.searchPage{
      margin-bottom: 50px;
      margin-top: 20px;
      text-align: center;
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
    }*/
  }

</style>
