<template>
  <div class="staff-detail">
    <!--<router-link to="/develop">-->
      <p class="reback" @click="reback">
        <!--<em class="icon-font">&#xe600;</em>-->
        <span><img src="../../../../src/assets/img/left.png" alt="" class="left-back" /></span>
        返回
      </p>
    <!--</router-link>-->
    <div class="detil-top">
      <div class="loading loading-circle" v-if="isLoading.staff"></div>
     <div v-if="!isLoading.staff">
       <div class="person-info">
         <div class="img">
           <img src="/static/img/default_avatar.jpg" alt="">
         </div>
         <button v-if="staffData.added == false" class="added" @click="addContact">
           <em class="icon-addPerson"></em>
           添加</button>
         <el-button v-if="staffData.added == true" class="added-after" @click="showStaff(staffData.contactsId)">
           <!--<em class="icon-addPerson"></em>-->
           查看</el-button>
         <div class="right-info">
           <p class="one-line">
             <span class="name">{{staffData.fullname}}</span>
             <span class="" v-for="icon in staffData.thirdInfoList">
             <a :href="icon.homepageUrl" :class="icon.platform == 0 ? 'icon-border' : ''" target="_blank"><em class="icon-fb" v-if="icon.platform == 0"></em></a>
             <a :href="icon.homepageUrl" :class="icon.platform == 1 ? 'icon-border' : ''" target="_blank"><em class="icon-twitter" v-if="icon.platform == 1"></em></a>
             <a :href="icon.homepageUrl" :class="icon.platform == 2 ? 'icon-border' : ''" target="_blank"><em class="icon-linkedin" v-if="icon.platform == 2"></em></a>
           </span>
           </p>
           <p class="two-line" v-for="(item,index) in staffData.experienceList">
           <span v-if="index == 0">
             <em class="company ">所属公司</em>
             <span class="same-val attr-val"  v-if="item.thirdInfoCompanyName == ''">
               '—'
             </span>
             <span class="same-val attr-val pointer-add" @click="toCompany" v-else="">
               {{item.thirdInfoCompanyName}}
             </span>
             <em class="department ">部门</em>
              <span class="same-width attr-val">
               {{item.department == '' ? '—' : item.department}}
              </span>
             <em class="department ">职位</em>
             <span class="same-width attr-val" style="width:300px;">
              {{item.position == '' ? '—' : item.position}}
             </span>
           </span>
           </p>
           <p class="two-line">
             <em class="company ">邮箱</em>
             <span class="same-val attr-val">{{staffData.mail==''||staffData.mail==null ? '—' : staffData.mail}}</span>
             <em class="department ">电话</em>
             <span class="same-width attr-val">{{staffData.telephone==''||staffData.telephone==null ? '—' : staffData.telephone}}</span>
           </p>
         </div>
       </div>
       <div class="detail-describe">
         <span v-if="staffData.intro !== null && staffData.intro !== ''">{{staffData.intro}}</span>
         <span v-else="" class="no-desc">暂未添加任何简介</span>
       </div>
     </div>
    </div>
    <!--员工表格-->
    <div class="staff-info">
      <p class="title">
        <span class="staff" >同事</span>
      </p>
      <div class="loading loading-circle" v-if="isLoading.colleague"></div>
      <div class="no-data" v-show="display">
        <div class="no-info">
          <img src="../../../assets/img/monitor/no-post.png" alt="">
          <br>
          <br>
          <p>暂无数据</p>
        </div>
      </div>
      <div class="staff-table" v-show="!display">
        <el-table style="width: 100%;" class="table-info" :data="colleagueData" v-show="!isLoading.colleague">
          <el-table-column label="姓名" width="218" inline-template prop="name">
            <div class="nameCol">
              <div class="company-head" @click="showDetail(row.id)"><img :src="row.avatar||'/static/img/default_avatar.jpg'" alt=""></div>
              <span class="staff-name" :title="row.fullname" @click="showDetail(row.id)">{{row.fullname}}</span>
            </div>
          </el-table-column>
          <el-table-column label="职位" width="318" prop="position" inline-template>
             <span class="just-same" v-if="row.experienceList" :title="row.experienceList[0].position">
               {{row.experienceList[0].position == null || row.experienceList[0].position == '' ? '—' : row.experienceList[0].position}}
             </span>
          </el-table-column>
         <!--  <el-table-column label="岗位" width="156" prop="post" inline-template>
             <span class="just-same" v-if="row.experienceList" :title="row.experienceList[0].department">
               {{row.experienceList[0].department == null || row.experienceList[0].department == '' ? '—' : row.experienceList[0].department}}
             </span>
          </el-table-column> -->
          <el-table-column label="邮箱" width="234" prop="email" inline-template>
            <span class="just-same">{{(row.mail == null || row.mail == '' ? '—' : row.mail)}}</span>
          </el-table-column>
          <el-table-column label="社交主页" width="180" prop="page" inline-template>
            <div v-for="item in row.thirdInfoList" class="socialPage">
              <span v-if="item.platform == 0">
                <a :href="item.homepageUrl" target="_blank"><span class="page icon-font icon-facebook fb" ></span></a>
                <a><span class="page icon-font gray">&#xe621;</span></a>
                <a><span class="page icon-font gray">&#xe616;</span></a>
              </span>
              <span v-if="item.platform == 1">
                <a><span class="page icon-font gray">&#xe6d9;</span></a>
                <a :href="item.homepageUrl" target="_blank"><span class="page icon-font icon-twitter" ></span></a>
                <a><span class="page icon-font gray">&#xe616;</span></a>
              </span>
              <span v-if="item.platform == 2">
                <a><span class="page icon-font gray">&#xe6d9;</span></a>
                <a><span class="page icon-font gray">&#xe621;</span></a>
                <a :href="item.homepageUrl" target="_blank"><span class="page icon-font icon-linkedin" ></span></a>
              </span>
            </div>
          </el-table-column>
          <el-table-column label="操作" inline-template>
            <div class="operate">
              <span class="icon-font icon-add10 addThing" v-if="row.added == false " @click="addStaff(row)"></span>
              <span class="icon-font eye icon-eye" v-if="row.added == true " @click="showStaff(row.contactsId)"></span>
            </div>
          </el-table-column>
        </el-table>
        <div class="next-page" v-if="staffTotalCount > 10">
          <el-pagination
            class="list-pagination"
            :current-page="currentPage"
            :page-size="size"
            :page-sizes="[10, 20, 30, 40]"
            :total="staffTotalCount"
            @size-change="staffSizeChange"
            @current-change="staffCurrentChange"
            layout="sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
  import exploreAPI from '@/api/exploreAPI'
  import Util from '@/common/Util.js'
  export default {
    data () {
      return {
        userId: window.localStorage.userId,
//        来源：推荐(search)/搜索(recommend)
        source: this.$route.query.source,
//        关键词
        keywords: this.$route.query.keywords,
        display: false,
//        contactId: '',
        isLoading: {
          colleague: true,
          staff: true
        },
        addAfter: false,
        colleagueData: [],
        staffTotalCount: -1,
        currentPage: 1,
        size: 10,
        page: 1,
        staffData: {
          // 第三方信息
          thirdInfoList: [],
          // 所属公司信息
          experienceList: []
        },
        companyId: ''
      }
    },
    mounted () {
      console.log(this.$store.state.develop.contactId)
//      员工详情
      let params = {thirdEmployeeId: this.$route.query.id}
      this.staffDetail(params)
    },
    methods: {
//      员工详情
      staffDetail (params) {
        this.isLoading.staff = true
        exploreAPI.getStaffDetail(params).then(res => {
          this.isLoading.staff = false
          if (res.data.code === 0) {
            if (res.data.data !== null && res.data.data !== {}) {
              for (let i = 0; i < res.data.data.thirdInfoList.length; i++) {
                if (res.data.data.thirdInfoList[i].homepageUrl !== null && res.data.data.thirdInfoList[i].homepageUrl !== '') {
                  res.data.data.thirdInfoList[i].homepageUrl = Util.checkUrl(res.data.data.thirdInfoList[i].homepageUrl)
                }
              }
              this.staffData = res.data.data
              if (res.data.data.experienceList.length > 0 && res.data.data.experienceList !== null) {
                this.companyId = res.data.data.experienceList[0].companyId
//              同事列表
                let obj = {
                  thirdCompanyId: this.companyId,
                  page: this.page,
                  pageSize: this.size,
                  excludeEmployeeId: this.$route.query.id
                }
                this.staffList(obj)
              }
            }
          }
        })
      },
//      同事列表
      staffList (params) {
        this.isLoading.colleague = true
        exploreAPI.getStaffList(params).then(res => {
          this.isLoading.colleague = false
          if (res.data.code === 0) {
            if (res.data.data.records.length > 0) {
              for (let i = 0; i < res.data.data.records.length; i++) {
                for (let j = 0; j < res.data.data.records[i].thirdInfoList.length; j++) {
                  if (res.data.data.records[i].thirdInfoList[j].homepageUrl !== null && res.data.data.records[i].thirdInfoList[j].homepageUrl !== '') {
                    res.data.data.records[i].thirdInfoList[j].homepageUrl = Util.checkUrl(res.data.data.records[i].thirdInfoList[j].homepageUrl)
                  }
                }
              }
              this.colleagueData = res.data.data.records
              for (let i = 0; i < this.colleagueData; i++) {
                this.colleagueData[i].push('add')
                this.colleagueData[i].add = true
              }
              this.staffTotalCount = res.data.data.totalCount
            } else {
              this.isLoading.colleague = false
              this.display = true
            }
          }
        })
      },
//      添加员工到联系人
      addContact () {
        for (let i = 0; i < this.staffData.thirdInfoList.length; i++) {
          if (this.staffData.thirdInfoList[i].homepageUrl !== null && this.staffData.thirdInfoList[i].homepageUrl !== '') {
            this.staffData.thirdInfoList[i].homepageUrl = Util.checkUrl(this.staffData.thirdInfoList[i].homepageUrl)
          }
        }
        let params = {
          type: 0,
          userId: this.userId,
          name: this.staffData.fullname,
          avatar: this.staffData.avatar,
          mail: this.staffData.mail,
          telephone: this.staffData.telephone,
          address: JSON.stringify(this.staffData.address),
          thirdAccountId: this.staffData.id,
          createSource: 'recommend_create',
          keywords: this.keywords,
          remark: this.staffData.intro,
          socialAccountType: 6,
          experienceList: JSON.stringify(this.staffData.experienceList),
          thirdInfoList: JSON.stringify(this.staffData.thirdInfoList)
        }
        if (this.staffData.added === false) {
          exploreAPI.addContact(params).then(res => {
            if (!res.data.code) {
//              this.contactId = res.data.data.data.id
              this.$store.commit('FIND_CONTACTID', {contactId: res.data.data.id})
              this.staffData.added = true
              this.$message.success('添加成功')
              let params = {thirdEmployeeId: this.$route.query.id}
              this.staffDetail(params)
//              this.addAfter = true
            } else {
              this.$message.warning(res.data.message)
            }
          })
        }
      },
//      跳转到联系人详情页
      showStaff (id) {
        console.log(this.$store.getters.contactId)
        this.$router.push({
          path: '/contactDetail',
          query: {
            contactId: this.$store.getters.contactId || id,
            contactType: 0
          }
        })
      },
//      跳转到公司详情
      toCompany () {
        this.$router.push({
          path: 'companyDetail',
          query: {
            id: this.companyId,
            source: this.$route.query.source,
            keywords: this.$route.query.keywords
          }
        })
      },
//      添加同事到联系人
      addStaff (row) {
        for (let i = 0; i < row.thirdInfoList.length; i++) {
          if (row.thirdInfoList[i].homepageUrl !== null && row.thirdInfoList[i].homepageUrl !== '') {
            row.thirdInfoList[i].homepageUrl = Util.checkUrl(row.thirdInfoList[i].homepageUrl)
          }
        }
        let params = {
          type: 0,
          userId: this.userId,
          name: row.fullname,
          avatar: row.avatar,
          mail: row.mail,
          telephone: row.telephone,
          address: JSON.stringify(row.address),
          thirdAccountId: row.id,
          createSource: 'recommend_create',
          keywords: this.keywords,
          remark: row.intro,
          socialAccountType: 6,
          experienceList: JSON.stringify(row.experienceList),
          thirdInfoList: JSON.stringify(row.thirdInfoList)
        }
        exploreAPI.addContact(params).then(res => {
          if (!res.data.code) {
            let contactId = res.data.data.id
            this.$store.commit('FIND_CONTACTID', {contactId: contactId})
            row.added = true
            this.$message.success('添加成功')
            let params = {thirdEmployeeId: this.$route.query.id}
            this.staffDetail(params)
          } else {
            this.$message.fail('添加失败')
          }
        })
      },
//      查看同事详情
      showDetail (id) {
        let params = {thirdEmployeeId: id}
        this.staffDetail(params)
      },
//      返回
      reback () {
        if (this.$route.query.type === 2) {
          console.log('LLL')
          this.$router.push({
            path: '/develop',
            query: {type: this.$route.query.type}
          })
        } else {
          window.history.back()
        }
      },
//      页数变化触发
      staffCurrentChange (page) {
        let obj = {thirdCompanyId: this.companyId, page: page, pageSize: this.size}
        this.staffList(obj)
      },
//      条数变化触发
      staffSizeChange (size) {
        this.size = size
        let obj = {thirdCompanyId: this.companyId, page: this.page, pageSize: size}
        this.staffList(obj)
      }

    }
  }

</script>
<style lang="less" rel="stylesheet/less" >
  @import "../../../assets/style/base";
  @import "../../../assets/style/variable";
  .staff-detail{
    width:1200px;
    margin: 0 auto;
    .reback{
      /*height: 34px;*/
      padding-top: 30px;
      font-size: 13px;
      color: #7C98B6;
      cursor: pointer;
      em{
        color: #7C98B6;
        font-weight: bold;
        font-size: 18px;
        margin-right: 8px;
      }
    }
    .detil-top{
      height: 269px;
      width: 1132px;
      padding: 30px 34px 40px 34px;
      background: #FFFFFF;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
      border-radius: 4px;
      margin-top: 16px;
      .person-info{
        height: 114px;
        position: relative;
        padding-bottom: 24px;
        border-bottom: 1px solid #EAF0F6;
        .added{
          position: absolute;
          top:0;
          right: 0;
          width:110px;
          height: 34px;
          line-height: 34px;
          text-align: center;
          color: @white;
          border: none;
          background: #5488F9;
          border-radius: 4px;
          cursor: pointer;
          outline: none;
          &:hover{
            background: rgba(84,136,249,0.50);
            border-radius: 4px;
          }
        }
        .added-after{
          position: absolute;
          top:0;
          right: 0;
          padding: 0;
          width:110px;
          height: 34px;
          line-height: 32px;
          text-align: center;
          border-radius: 4px;
          background: #5488F9;
          /*border: 1px solid #DFE3EB;*/
          font-size: 13px;
          color: #fff;
          span{
            font-size: 13px;
          }
        }
        .img{
          width:114px;
          height: 114px;
          position: absolute;
          top:0;
          left:0;
          border-radius: 50%;
          overflow: hidden;
          img{
            width: 100%;
          }
        }
        .right-info{
          padding-left: 134px;
          height: 100%;
          .one-line{
            height: 34px;
            line-height: 34px;
            .name{
              font-size: 24px;
              color: #33475B;
            }
            .icon-border{
              display: inline-block;
              width:26px;
              height: 26px;
              position: relative;
              margin-left: 10px;
              box-shadow: 0 0 4px 0 rgba(84,135,249,0.20);
              border-radius: 50%;
              vertical-align: text-bottom;
              background: #FFFFFF;
              em{
                position:absolute;
                top:-4px;
                left:6px;
                z-index: 9;
              }
            }
          }
          .two-line{
            margin-top: 24px;
            em{
              display: inline-block;
              font-size: 13px;
              color: #7C98B6;
            }
            span{
              font-size: 13px;
              color: #33475B;
            }
            .company{
              width:54px;
              padding-right: 8px;
            }
            .department{
              padding-right: 8px;
            }
            .same-val{
              display: inline-block;
              width:195px;
            }
            .same-width{
              display: inline-block;
              width:118px;
            }
            .attr-val{
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .pointer-add{
             cursor: pointer;
            }
          }
        }
      }
      .detail-describe{
        position: relative;
        padding-top: 24px;
        height: 44%;
        word-break: normal;
        overflow: hidden;
        line-height: 18px;
        text-overflow: ellipsis;
        width: 100%;
        display: -webkit-box;
        /* autoprefixer: off*/
        -webkit-box-orient: vertical;
        /* autoprefixer: on*/
        -moz-box-orient: vertical;
        -ms-box-orient: vertical;
        -webkit-line-clamp: 6;
        -moz-line-clamp: 6;
        -ms-line-clamp: 6;
        .no-desc{
          color: #7C98B6;
        }
      }
      /*.detail-describe::after{*/
        /*content: '...';*/
        /*position: absolute;*/
        /*right: 0;*/
        /*bottom: 0;*/
        /*background: url('../../../assets/img/develop/ellipsis_bg.png');*/
      /*}*/
    }
    .staff-info{
      width:inherit;
      /*height: 727px;*/
      background: #fff;
      margin-top: 18px;
      margin-bottom: 20px;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
      border-radius: 4px;
      padding-bottom: 30px;
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
      .no-data{
        padding-bottom: 355px;
      }
      .staff-table{
        /*height: 592px;*/
        .el-table__header-wrapper{
          height: 44px;
        }
        .el-table__header-wrapper thead div, .el-table th{
          background: #F5F8FA;
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
          border: 1px solid #EAF0F6;
        }
        .el-table th.is-leaf, .el-table td {
          border-bottom: 1px solid #EAF0F6;
        }
        .el-table th, .el-table td{
          height: 50px;
        }
        .el-table .cell {
          color:#33475B;
        }
        .table-info{
          .company-head{
            width:28px;
            height: 28px;
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
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
            white-space: nowrap;
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

</style>
