<template>
  <div class="companyDetail">
    <div class="detail-container">
      <!--<router-link to="/develop">-->
        <p class="reback" @click="jumpBack">
          <!--<em class="icon-font">&#xe600;</em>-->
          <span><img src="../../../../src/assets/img/left.png" alt="" class="left-back" /></span>
          返回</p>
      <!--</router-link>-->
      <!--公司详情卡片-->
      <!--<div class="loading loading-circle" v-show="isLoading.company"></div>-->
      <!--<div class="company-info">-->
        <!--<div class="loading-circle loading" v-show="isLoading.company"></div>-->
      <!--</div>-->
      <div class="company-info">
        <div class="loading-top" v-show="isLoading.company">
          <div class="loading-circle loading company-load"></div>
        </div>
        <div v-show="!isLoading.company" style="overflow: hidden">
          <div class="info-right">
            <div class="img"  >
              <div v-if="companyData.avatar == null || companyData.avatar == ''" class="companyDefault2">
                <em  class="icon-company"></em>
              </div>
              <img v-else="" :src="companyData.avatar" alt="">
            </div>
            <p class="name" :title="companyData.name">{{companyData.name}}</p>
            <p class="url" :title="companyData.website"><a target="_blank" :href="fullWebUrl">{{companyData.website}}</a></p>
            <p class="phone">{{companyData.telephone}}</p>
            <p class="source-icon" >
            <span v-for="icons in companyData.thirdInfoList">
              <a :href="icons.homepageUrl" target="_blank" v-if="icons.platform == 0" class="span"><span ><em class="icon-font icon-fb" ></em></span></a>
              <a :href="icons.homepageUrl" target="_blank" v-if="icons.platform == 1" class="span"><span ><em class="icon-font icon-twitter" ></em></span></a>
              <a :href="icons.homepageUrl" target="_blank" v-if="icons.platform == 2" class="span"><span ><em class="icon-font icon-linkedin" ></em></span></a>
            </span>
            </p>
            <el-button class="btn-add" @click="addCompany" v-if="companyData.added == false">+
              <em class="icon-font">&#xe641; </em>
              添加</el-button>
            <el-button class="add-after" v-if="companyData.added == true" @click="showCompany(companyData.contactsId)">
              <!--+<em class="icon-font">&#xe6b5; </em>-->
              查看</el-button>
          </div>
          <div class="info-left">
            <div class="left-top">
              <div style="overflow: hidden">
                <div class="industry">
                  <p class="attr-try">行业</p>
                  <p class="attr-val">{{companyData.industry == '' || companyData.industry == null ? '—' : companyData.industry}}</p>
                </div>
                <div class="industry">
                  <p class="attr-try">公司规模</p>
                  <p class="attr-val">{{companyData.companySize | companySize}}</p>
                </div>
                <div class="industry attr-type">
                  <p class="attr-try">公司域名</p>
                  <p class="attr-val"><a target="_blank" :href="fullWebUrl">{{companyData.website}}</a></p>
                </div>
              </div>
              <div style="overflow: hidden">
                <div class="industry attr-top">
                  <p class="attr-try">公司地址</p>
                  <p class="attr-val">
                    {{companyData.address.location == '' || companyData.address.location == null ? '—' : companyData.address.location}}
                  </p>
                </div>
                <div class="industry attr-top">
                  <p class="attr-try">产品名称</p>
                  <p class="attr-val product_val" :title="companyData.products">{{companyData.products == '' || companyData.products == null ? '—' : companyData.products}}</p>
                </div>
                <div class="industry attr-type attr-top">
                  <p class="attr-try">电话</p>
                  <p class="attr-val" >{{companyData.telephone == '' || companyData.telephone == null ? '—' : companyData.telephone}}</p>
                </div>
              </div>
            </div>
            <div class="left-bottom">
              <p class="short-introduction">简介</p>
              <p class="describe" v-if="companyData.intro !== null && companyData.intro !== ''" :title="companyData.intro">{{companyData.intro}}</p>
              <p class="describe no-desc" v-else="">暂未添加任何简介</p>
            </div>
          </div>
        </div>
      </div>
      <!--员工表格-->
      <div class="staff-info">
        <p class="title">
          <span :class="staffShow == true ? 'staff' : 'staff-after'" @click="changeLead('staff')">员工</span><span class="line"></span><span :class="leadShow == false ? 'lead' : 'lead-after'" @click="changeLead('lead')">海关数据</span>
        </p>
       <div class="staff-table" v-show="staffShow">
         <div class="loading loading-circle" v-if="isLoading.empy"></div>
         <div class="no-data" v-show="display1">
           <div class="no-info">
             <img src="../../../assets/img/monitor/no-post.png" alt="">
             <p>暂无数据</p>
           </div>
         </div>
         <el-table style="width: 100%;" class="table-info" :data="tableData" v-show="!isLoading.empy && tableData.length > 0">
           <el-table-column label="姓名" width="218">
             <template  scope="scope">
               <div class="nameCol">
                 <div class="company-head" @click="showDetail(scope.row)"><img :src="scope.row.avatar||'/static/img/default_avatar.jpg'" alt=""></div>
                 <span class="staff-name" :title="scope.row.fullname" @click="showDetail(scope.row)">{{scope.row.fullname}}</span>
               </div>
             </template>
           </el-table-column>
           <el-table-column label="职位" width="318" >
             <template  scope="scope" v-if="row.experienceList" :title="scope.row.experienceList[0].position">
               <div class="just-same" :title="scope.row.experienceList[0].position == null || scope.row.experienceList[0].position == '' ? '—' : scope.row.experienceList[0].position">
                 {{scope.row.experienceList[0].position == null || scope.row.experienceList[0].position == '' ? '—' : scope.row.experienceList[0].position}}
               </div>
             </template>
           </el-table-column>
           <!-- <el-table-column label="岗位" width="156" >
             <template  scope="scope" v-if="scope.row.experienceList" :title="scope.row.experienceList[0].department">
               <div class="just-same">
                 {{scope.row.experienceList[0].department == null || scope.row.experienceList[0].department == '' ? '—' : scope.row.experienceList[0].department}}
               </div>
             </template>
           </el-table-column> -->
           <el-table-column label="邮箱" width="234" >
             <template  scope="scope">
               <div class="just-same">
                 {{(scope.row.mail == null || scope.row.mail == '' ? '—' : scope.row.mail)}}
               </div>
             </template>
           </el-table-column>
           <el-table-column label="社交主页" width="180" >
             <template scope="scope">
               <div class="socialPage" v-for="item in scope.row.thirdInfoList">
                 <span v-if="item.platform == 0">
                   <a :href="item.homepageUrl" target="_blank"><span class="page icon-font fb">&#xe6d9;</span></a>
                   <a><span class="page icon-font gray">&#xe621;</span></a>
                   <a><span class="page icon-font gray">&#xe616;</span></a>
                 </span>
                 <span v-if="item.platform == 1">
                   <a><span class="page icon-font gray">&#xe6d9;</span></a>
                   <a :href="item.homepageUrl" target="_blank"><span class="page icon-font tw">&#xe621;</span></a>
                   <a><span class="page icon-font gray">&#xe616;</span></a>
                 </span>
                 <span v-if="item.platform == 2">
                   <a><span class="page icon-font gray">&#xe6d9;</span></a>
                   <a><span class="page icon-font gray">&#xe621;</span></a>
                   <a :href="item.homepageUrl" target="_blank"><span class="page icon-font link">&#xe616;</span></a>
                 </span>
               </div>
             </template>
           </el-table-column>
           <el-table-column label="操作" >
             <template  scope="scope">
               <div class="operate">
                 <span class="icon-font addThing icon-add10" v-if="scope.row.added == false" @click="addContact(scope.row)"></span>
                 <span class="icon-font eye icon-eye" v-if="scope.row.added == true" @click="showContact(scope.row)"></span>
               </div>
             </template>
           </el-table-column>
         </el-table>
         <div class="next-page" v-if="staffTotalCount > 10">
           <el-pagination
             class="list-pagination"
             :current-page="page1"
             :page-size="size1"
             :page-sizes="[10, 20, 30, 40]"
             :total="staffTotalCount"
             @size-change="staffSizeChange"
             @current-change="staffCurrentChange"
             layout="sizes, prev, pager, next, jumper">
           </el-pagination>
         </div>
       </div>
        <!--海关数据-->
        <div class="staff-table lead-table" v-show="leadShow">
          <div class="loading loading-circle" v-if="isLoading.led"></div>
          <div class="no-data" v-show="display2">
            <div class="no-info">
              <img src="../../../assets/img/monitor/no-post.png" alt="">
              <p>暂无数据</p>
            </div>
          </div>
          <el-table style="width: 100%;" class="table-info" :data="leadTable" v-show="!isLoading.led && leadTable.length > 0">
            <el-table-column label="产品描述" width="216">
              <template  scope="scope">
                <div class="product-describe">
                  <span @click="showDiaLog(scope.row)" :title="scope.row.describes">
                  {{scope.row.describes == '' || scope.row.describes == null ? '—' : scope.row.describes}}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="交易时间" width="206">
              <template  scope="scope">
                <div class="just-same">
                  {{scope.row.tradeDate == '' || scope.row.tradeDate == null ? '—' : scope.row.tradeDate | time-formater-no-hour}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="重量" width="204">
              <template  scope="scope">
                <div class="just-same">
                  {{scope.row.weight == '' || scope.row.weight == null ? '—' : scope.row.weight}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="金额" width="204">
              <template  scope="scope">
                <div class="just-same">
                  {{scope.row.amount == '' || scope.row.amount == null ? '—' : row.amount}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="供应商">
              <template scope="scope">
                <span>
                  {{scope.row.supplier == '' || scope.row.supplier == null ? '—' : scope.row.supplier}}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div class="next-page" v-if="leadTotalCount > 10">
            <el-pagination
              class="list-pagination"
              :current-page="page2"
              :page-size="size2"
              :total="leadTotalCount"
              @size-change="leadSizeChange"
              @current-change="leadCurrentChange"
              layout="sizes, prev, pager, next, jumper"
              :page-sizes="[10, 20, 30, 40]">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="leadData" title="海关数据详情" class="leadData">
      <div class="main-info">
        <p class="time">
          <span>交易时间:</span> <span> {{diaLogData.tradeDate | time-formater-no-hour}}</span>
          <span class="source-country">来源国:</span>
          <span v-if="diaLogData.source == 1">乌克兰</span>
          <span v-if="diaLogData.source == 2">美国</span>
          <span v-if="diaLogData.source == 3">英国</span>
          <span v-if="diaLogData.source == 4">加拿大</span>
          <span v-if="diaLogData.source == 5">俄罗斯</span>
          <span v-if="diaLogData.source == 6">墨西哥</span>
        </p>
        <div class="product-des">
          <p class="des-title">产品描述</p>
          <p class="des-content">{{diaLogData.describes}}</p>
        </div>
        <div class="business">
          <p class="des-title">供应商</p>
          <p class="des-content">{{diaLogData.supplier}}</p>
        </div>
        <div class="pro">
          <span class="weight">
            <p class="one">重量</p>
            <p class="two">{{diaLogData.weight}}</p>
          </span>
          <div class="line-border"></div>
          <span class="money">
            <p class="one">金额</p>
            <p class="two">{{diaLogData.amount}}</p>
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import exploreAPI from '@/api/exploreAPI'
  import Util from '@/common/Util.js'
  export default{
    data () {
      return {
        userId: window.localStorage.userId,
//        来自推荐(recommed)或者搜索(search)
        source: this.$route.query.source,
        keywords: this.$route.query.keywords,
        createSource: '',
//        跳转公司详情页所需ID
//        contactId: '',
        display1: false,
        display2: false,
        addAfter: false,
//        operation: false,
        isLoading: {
          empy: true,
          led: true,
          company: true
        },
        tableData: [],
        leadTable: [],
        diaLogData: {},
        staffShow: true,
        leadShow: false,
        size1: 10,
        size2: 10,
        page: 1,
        page1: 1,
        page2: 1,
        leadTotalCount: -1,
        staffTotalCount: -1,
        leadData: false,
        currentPage1: 1,
        currentPage2: 1,
        purchaser: '',
        companyData: {
          thirdInfoList: [],
          address: {}
        },
        addOn: '',
//        flag: false,
        contactsId: '',
        website: '',
        companyNameNew: ''
      }
    },
    computed: {
      fullWebUrl: function () {
        if (this.companyData.website !== null && this.companyData.website !== '') {
          return Util.checkUrl(this.companyData.website)
        }
      }
    },
    mounted () {
      this.source = this.$route.query.source
      console.log(this.source)
//      公司详情接口
      let param = {thirdCompanyId: this.$route.query.id}
      this.companyDetail(param)
//      员工列表
      let params = {thirdCompanyId: this.$route.query.id, page: this.page, pageSize: this.size1}
      this.staffList(params)
    },
    methods: {
//      返回搜索
      jumpBack () {
        if (window.history.length === 1) {
          this.$router.push({path: '/index'})
        } else {
          window.history.back()
        }
      },
//      切换数据
      changeLead (type) {
        if (type === 'staff') {
          this.staffShow = true
          this.leadShow = false
        } else if (type === 'lead') {
          this.staffShow = false
          this.leadShow = true
        }
      },
//      公司详情
      companyDetail (params) {
//        this.isLoading.company = true
        exploreAPI.getCompany(params).then(res => {
          this.isLoading.company = false
          if (res.data.code === 0) {
            for (let i = 0; i < res.data.data.thirdInfoList.length; i++) {
              if (res.data.data.thirdInfoList[i].homepageUrl !== null && res.data.data.thirdInfoList[i].homepageUrl !== '') {
                res.data.data.thirdInfoList[i].homepageUrl = Util.checkUrl(res.data.data.thirdInfoList[i].homepageUrl)
              }
            }
            this.companyData = res.data.data
            this.addOn = this.companyData.added
            this.contactsId = this.companyData.contactsId
            this.purchaser = res.data.data.purchaser
            this.companyNameNew = this.companyData.name
            //      海关数据
            if (this.purchaser !== '' && this.purchaser !== null && this.purchaser !== 'null') {
              this.purchaser = encodeURIComponent(encodeURIComponent(this.purchaser))
              let obj = {purchaser: this.purchaser, page: this.page, pageSize: this.size2, orderType: 'desc', orderBy: 'tradeDate'}
              this.leadList(obj)
            } else {
              this.display2 = true
              this.isLoading.led = false
            }
          }
        })
      },
//      员工列表
      staffList (params) {
        this.isLoading.empy = true
        exploreAPI.getStaffList(params).then(res => {
          this.isLoading.empy = false
          if (res.data.code === 0) {
            if (res.data.data.records.length > 0) {
              this.display1 = false
              for (let i = 0; i < res.data.data.records.length; i++) {
                for (let j = 0; j < res.data.data.records[i].thirdInfoList.length; j++) {
                  if (res.data.data.records[i].thirdInfoList[j].homepageUrl !== null && res.data.data.records[i].thirdInfoList[j].homepageUrl !== '') {
                    res.data.data.records[i].thirdInfoList[j].homepageUrl = Util.checkUrl(res.data.data.records[i].thirdInfoList[j].homepageUrl)
                  }
                }
              }
              this.tableData = []
              this.tableData = res.data.data.records
              this.staffTotalCount = res.data.data.totalCount
            } else {
              this.display1 = true
            }
          }
        })
      },
//      海关数据
      leadList (params) {
        this.isLoading.led = true
        exploreAPI.getLeadList(params).then(res => {
          this.isLoading.led = false
          if (res.data.code === 0) {
            if (res.data.data.records.length > 0) {
              this.display2 = false
              this.leadTable = res.data.data.records
              this.leadTotalCount = res.data.data.totalCount
            } else {
              this.display2 = true
            }
          }
        })
      },
//      添加公司
      addCompany () {
        if (this.source === 'search') {
          this.createSource = 'recommend_search_create'
        }
        if (this.source === 'recommend') {
          this.createSource = 'recommend_create'
        }
        if (this.companyData.website !== null && this.companyData.website !== '') {
          this.website = Util.checkUrl(this.companyData.website)
        }
        let params = {
          type: 1,
          userId: this.userId,
          name: this.companyData.name,
          avatar: this.companyData.avatar,
          mail: this.companyData.mail,
          telephone: this.companyData.telephone,
          address: JSON.stringify(this.companyData.address),
          thirdAccountId: this.companyData.id,
          createSource: this.createSource,
          keywords: this.keywords,
          remark: this.companyData.intro,
          socialAccountType: 6,
          industry: this.companyData.industry,
          website: this.website,
          thirdInfoList: JSON.stringify(this.companyData.thirdInfoList),
          companySize: this.companyData.companySize,
          sales: this.companyData.sales,
          mainProduct: this.companyData.products
        }
        exploreAPI.addContact(params).then(res => {
          if (!res.data.code) {
            this.$message.success('添加公司成功')
            console.log('LLL')
            this.addOn = true
            this.companyData.added = true
            this.$store.commit('FIND_COMPANYID', {companyId: res.data.data.id})
//            if (flag === false) {
//              this.addContactAfter(row)
//              this.flag = true
//            }
          } else {
//            this.$message.fail('添加失败')
          }
        })
      },
//      跳转公司详情页
      showCompany (id) {
        console.log(this.contactId)
        this.$router.push({
          path: '/contactDetail',
          query: {
            contactId: this.$store.getters.companyId || id,
            contactType: 1
          }
        })
      },
      //      跳转员工详情页
      showContact (row) {
        console.log(this.contactId)
        this.$router.push({
          path: '/contactDetail',
          query: {
            contactId: this.$store.getters.contactId || row.contactsId,
            contactType: 0
          }
        })
      },
//      判断是否要先添加公司。
//      addContact (row) {
//        if (this.addOn === false) {
//          this.addCompany(row, this.flag)
//          this.addOn = false
//        } else {
//          this.addContactAfter(row)
//        }
//      },
//      添加同事到联系人
      addContact (row) {
        if (this.source === 'search') {
          this.createSource = 'recommend_search_create'
        }
        if (this.source === 'recommend') {
          this.createSource = 'recommend_create'
        }
        for (let i = 0; i < row.thirdInfoList.length; i++) {
          if (row.thirdInfoList[i].homepageUrl !== null && row.thirdInfoList[i].homepageUrl !== '') {
            row.thirdInfoList[i].homepageUrl = Util.checkUrl(row.thirdInfoList[i].homepageUrl)
          }
        }
        let params = {
          type: 0,
          userId: this.userId,
          name: row.fullname,
          companyName: this.companyNameNew,
          avatar: row.avatar,
          mail: row.mail,
          telephone: row.telephone,
          address: JSON.stringify(row.address),
          thirdAccountId: row.id,
          createSource: this.createSource,
          keywords: this.keywords,
          remark: row.intro,
          socialAccountType: 6,
//          companyId: this.$store.getters.companyId || this.contactsId,
          experienceList: JSON.stringify(row.experienceList),
          thirdInfoList: JSON.stringify(row.thirdInfoList)
        }
        exploreAPI.addContact(params).then(res => {
          if (!res.data.code) {
            row.added = true
            this.$store.commit('FIND_CONTACTID', {contactId: res.data.data.id})
            this.$message.success('添加员工成功')
          } else {
            this.$message.warning(res.data.message)
          }
        })
      },
//      查看同事详情
      showDetail (row) {
        this.$router.push({
          path: '/staffDetail',
          query: {id: row.id}
        })
      },
//    条数改变（海关）
      leadSizeChange (size) {
        this.size2 = size
        let params = {purchaser: this.purchaser, page: this.page2, pageSize: size, orderType: 'desc', orderBy: 'tradeDate'}
        this.leadList(params)
      },
      //    条数改变（员工）
      staffSizeChange (size) {
        this.size1 = size
        let params = {thirdCompanyId: this.$route.query.id, page: this.page1, pageSize: size}
        this.staffList(params)
      },
//      页数改变（海关）
      leadCurrentChange (page) {
        this.page2 = page
        let params = {purchaser: this.purchaser, page: page, pageSize: this.size2, orderType: 'desc', orderBy: 'tradeDate'}
        this.leadList(params)
      },
      //      页数改变（员工）
      staffCurrentChange (page) {
        this.page1 = page
        let params = {thirdCompanyId: this.$route.query.id, page: page, pageSize: this.size1}
        this.staffList(params)
      },
//      海关数据弹框
      showDiaLog (data) {
        this.leadData = true
        this.diaLogData = data
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" >
  @import "../../../assets/style/base";
  @import "../../../assets/style/variable";
  @import "../../../assets/style/loading.css";
  .companyDetail{
    .detail-container{
      width:1200px;
      margin: 0 auto;
      .reback{
        /*height: 34px;*/
        padding-top: 30px;
        font-size: 13px;
        color: #7C98B6;
        cursor: pointer;
        span{
          color: #7C98B6;
          font-weight: bold;
          font-size: 18px;
          /*margin-right: 8px;*/
        }
      }
      .company-info{
        width:inherit;
        background: #fff;
        overflow: hidden;
        box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
        border-radius: 4px;
        margin-top: 16px;
        .loading-top{
          height: 100px;
          padding-top: 50px;
          .company-load{
            margin-top: 0;
          }
        }
        .info-right{
          width:168px;
          float: left;
          padding: 30px 50px;
          .img{
            width:50px;
            height: 50px;
            margin: 0 auto;
            .companyDefault2{
              width: 50px;
              height: 50px;
              position: relative;
              border-radius: 50%;
              background: #DEE2ED;
              overflow: hidden;
              em{
                font-size: 50px;
                position: absolute;
                top: 5px;
                left: -1px;
                color: #F2F5F8;
              }
            }
          }
          p{
            text-align: center;
          }
          .name{
            font-size: 18px;
            color: #33475B;
            margin-top: 10px;
            height: 36px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            /* autoprefixer: off*/
            -webkit-box-orient: vertical;
            /* autoprefixer: on*/
            -ms-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .url{
            font-size: 13px;
            color: #4F6D95;
            margin-top: 4px;
            height: 16px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            a{
              color: #4F6D95;
            }
          }
          .phone{
            font-size: 12px;
            color: #4F6D95;
            margin-top: 4px;
            height: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .source-icon{
            margin-top: 16px;
            .span{
              display: inline-block;
              width:26px;
              height: 26px;
              line-height: 26px;
              margin-right: 10px;
              background: #fff;
              text-align: center;
              border-radius: 50%;
              box-shadow: 0 0 4px 0 rgba(84,135,249,0.20);
            }
            .icon-fb{
              color: #577ECE;
            }
            .icon-tw{
              color: #48B3FE;
            }
            .icon-in{
              color: #2991CB;
            }
          }
          .btn-add{
            padding: 0;
            width:110px;
            height: 28px;
            margin: 32px 30px 0 30px;
            background: #5488F9;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            border: none;
            span{
              font-size: 13px;
            }
            &:hover{
              background: rgba(84,136,249,0.50);
            }
          }
          .add-after{
            padding: 0;
            width:110px;
            height: 28px;
            margin: 30px 30px 0;
            background: #5488F9;
            border-radius: 4px;
            color: #fff;
            /*border: 1px solid #DFE3EB;*/
            span{
              font-size: 13px;
            }
          }
        }
        .info-left{
          width: 929px;
          height: inherit;
          float: right;
          border-left: 1px solid #EAF0F6;
          .left-top{
            width:870px;
            padding:28px 30px 24px 30px;
            border-bottom: 1px solid #EAF0F6;
            overflow:hidden;
            .industry{
              width:232px;
              float: left;
              overflow: hidden;
              margin-bottom: 24px;
              margin-right: 55px;
              .attr-try{
                font-size: 13px;
                color: #7C98B6;
                height: 18px;
                line-height: 18px;
                margin-bottom: 6px;
              }
              .attr-val{
                line-height: 18px;
                font-size: 13px;
                overflow: hidden;
                color: #33475B;
                text-overflow: ellipsis;
                display: -webkit-box;
                /* autoprefixer: off*/
                -webkit-box-orient: vertical;
                /* autoprefixer: on*/
                -ms-box-orient: vertical;
                -webkit-line-clamp: 3;
                a{
                  color: #33475B;
                }
              }
            }
            .attr-type{
              margin-right: 0;
            }
            .attr-top{
              margin-bottom: 0;
            }
          }
          .left-bottom{
            width:870px;
            min-height: 60px;
            padding: 24px 30px 50px 30px;
            .short-introduction{
              font-size: 13px;
              color: #7C98B6;
              margin-bottom: 6px;
            }
            .no-desc{
              color: #7C98B6;
            }
            .describe{
              /*position: relative;*/
              line-height: 18px;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: normal;
              width: 100%;
              max-height: 110px;
              overflow: hidden;
              display: -webkit-box;
              /* autoprefixer: off*/
              -webkit-box-orient: vertical;
              /* autoprefixer: on*/
              -moz-box-orient: vertical;
              -ms-box-orient: vertical;
              -webkit-line-clamp: 6;
              -moz-line-clamp: 6;
              -ms-line-clamp: 6;
            }
            /*.describe::after{*/
              /*content: '...';*/
              /*position: absolute;*/
              /*right: 0;*/
              /*left: 0;*/
              /*background: url('../../../assets/img/develop/ellipsis_bg.png') repeat-y;*/
            /*}*/
          }
        }
      }
      .staff-info{
        width:inherit;
        /*height: 727px;*/
        background: #fff;
        margin-top: 18px;
        box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
        border-radius: 4px;
        padding-bottom: 40px;
        margin-bottom: 20px;
        .title{
          height: 60px;
          line-height: 60px;
          .staff{
            padding-left: 20px;
            font-size: 16px;
            color: #33475B;
            cursor: pointer;
          }
          .staff-after{
            padding-left: 20px;
            font-size: 14px;
            color: #7C98B6;
            cursor: pointer;
          }
          .line{
            display: inline-block;
            width:1px;
            height: 15px;
            vertical-align: middle;
            margin-left: 16px;
            margin-right: 16px;
            background: #CBD6E3;
          }
          .lead{
            font-size: 14px;
            color: #7C98B6;
            cursor: pointer;
          }
          .lead-after{
            font-size: 16px;
            color: #33475B;
            cursor: pointer;
          }
        }
        .staff-table{
          /*height: 592px;*/
          .el-table__header-wrapper{
            height: 44px;
          }
          .el-table__header-wrapper thead div, .el-table th{
            background: #F5F8FA;
            height: 30px;
          }
          .el-table--enable-row-hover .el-table__body tr:hover > td {
            background-color: #F5F8FA;
          }
          .el-table--enable-row-hover .el-table__body tr:hover > td {
            background-color: #F5F8FA;
            .operate{
              visibility: visible;
            }
          }
          .el-table{
            /*border: 1px solid #EAF0F6;*/
          }
          .el-table th.is-leaf, .el-table td {
            border-bottom: 1px solid #EAF0F6;
          }
          .el-table th, .el-table td{
            height: 50px;
          }
          .el-table .cell {
            color:#33475B;
            text-align: left;
          }
          .no-data{
            padding-bottom: 355px;
          }
          .table-info{
            .company-head{
              width:28px;
              height: 28px;
              display: inline-block;
              vertical-align: middle;
              cursor: pointer;
              border-radius: 50%;
              overflow: hidden;
              img{
                width:28px;
                height: 28px;
              }
            }
            .nameCol{
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .product-describe{
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 13px;
              color: #5488F9;
              cursor: pointer;
            }
            .socialPage{
              span{
                a{
                  margin-right: 5px;
                }
                .fb{
                  color: #577ECE;
                }
                .tw{
                  color: #48B3FE;
                }
                .link{
                  color: #2991CB;
                }
                .gray{
                  color: #B0C1D4
                }
              }
            }
            .operate{
              visibility: hidden;
              .addThing{
                color: #B0C1D4;
                font-size: 16px;
                cursor: pointer;
                &:hover{
                  color: #5488F9;
                }
              }
              .eye{
                color: #B0C1D4;
                font-size: 16px;
                cursor: pointer;
                &:hover{
                  color: #5488F9;
                }
              }
            }
            .staff-name{
              font-size: 13px;
              color: #33475B;
              cursor: pointer;
            }
            .just-same{
              font-size: 13px;
              color: #33475B;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .page{

            }
          }
        }
        .next-page{
          .list-pagination{
            text-align: right;
            margin: 20px;
            .btn-prev,.btn-next{
              border: 1px solid rgb(209, 213, 229);
              margin-right: 10px;
            }
            li,li.active + li{
              border: 1px solid rgb(209, 213, 229);
              margin-right: 10px;
            }
          }

        }
      }
    }
    .leadData{
      .el-dialog{
        width:700px;
        height: 353px;
        background: #FFFFFF;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.20);
        border-radius: 4px;
        .el-dialog__header{
          margin-bottom: 20px;
          .el-dialog__title{
            font-size: 14px;
            color: #33475B;
          }
        }
        .el-dialog__body{
          padding: 0;
          .main-info{
            .time{
              display: inline-block;
              height: 46px;
              line-height: 46px;
              padding-left: 22px;
              width:676px;
              background: #F5F8FA;
              border-bottom: 1px solid #DFE3EB;
              border-top: 1px solid #DFE3EB;
              border-radius: 0 0 4px 4px;
              font-size: 13px;
              color: #33475B;
              .source-country{
                margin-left: 30px;
              }
            }
            .product-des{
              display: inline-block;
              padding: 16px 22px 16px 22px;
              height: 62px;
              width: 656px;
              border-bottom: 1px solid #DFE3EB;
              .des-title{
                font-size: 13px;
                color: #7C98B6;
              }
              .des-content{
                margin-top: 8px;
                font-size: 13px;
                color: #4F6D95;
                line-height: 18px;
                display: -webkit-box;
                /* autoprefixer: off*/
                -webkit-box-orient: vertical;
                /* autoprefixer: on*/
                -moz-box-orient: vertical;
                overflow: hidden;
                -ms-box-orient: vertical;
                -webkit-line-clamp: 3;
                -moz-line-clamp: 3;
                -ms-line-clamp: 3;

              }
            }
            .business{
              display: inline-block;
              padding: 16px 22px 16px 22px;
              height: 45px;
              width: 656px;
              border-bottom: 1px solid #DFE3EB;
              overflow: hidden;
              .des-title{
                font-size: 13px;
                color: #7C98B6;
              }
              .des-content{
                margin-top: 8px;
                font-size: 13px;
                color: #4F6D95;
                line-height: 18px;
              }
            }
            .pro{
              display: inline-block;
              padding: 16px 22px 16px 22px;
              height: 45px;
              width: 656px;
              /*border-bottom: 1px solid #DFE3EB;*/
              position: relative;
              border-radius: 0 0 4px 4px;
              p{
                width:50%;
              }
              .one{
                font-size: 13px;
                color: #7C98B6;
                line-height: 18px;
                margin-bottom: 8px;
              }
              .two{
                font-size: 13px;
                color: #4F6D95;
                line-height: 18px;
              }
              .weight{
                width:50%;
                float: left;
              }
              .line-border{
                width:1px;
                height: 77px;
                background: #DFE3EB;
                position: absolute;
                top:0;
                left: 47%;
              }
              .money{
                float: right;
                width:50%;
              }
            }

          }
        }
      }
    }
  }
</style>
