<template>
  <div class="logistic-container act-container" @keyup.enter="doSearch" >
    <div class="right-search2">
      <el-select v-model="form.queryUserId" placeholder="全部账号" @change="searchForm()" v-if="getUser">
          <el-option  v-for="group in groupList" :label="group.name" :key="group.id" :value="group.id">{{group.name}}
          </el-option>
      </el-select>
      <el-input
        placeholder="请输入活动名称"
        v-model="form.activityTitle"
        class="input-sel-search">
        <el-button slot="append" icon="search" @click="searchFormEnter()"></el-button>
      </el-input>
      <el-select v-model="form.timeFlag" v-on:change="searchForm()"  placeholder="选择日期">
        <el-option label="全部时间" value=""></el-option>
        <el-option label="最近7天" value="0"></el-option>
        <el-option label="最近15天" value="1"></el-option>
        <el-option label="最近30天" value="2"></el-option>
      </el-select>
      <router-link to="addActivity" ><el-button type="primary" class="addproduct">新增活动营销</el-button></router-link>
    </div>
    <div class="list-box prod-box">
      <template>
        <el-table  :data="activitylist"  border  tooltip-effect="none"  style="width: 100%" class="product-tab" >
          <el-table-column  prop="activityTitle"  label="活动名称" class='text-ellipsis'  min-width="210">
            <template scope="scope" >
              <div >
                <span :title="scope.row.activityTitle" class="overhide" @click="titleToSee(scope.row)"  style="color:#5488F9;cursor:pointer">{{scope.row.activityTitle}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="PV"  prop="pv"   min-width="70">
          </el-table-column>
          <el-table-column  prop="uv"  min-width="70"  label="UV">
          </el-table-column>
          <el-table-column  prop="hits"  min-width="75"  label="点击数">
          </el-table-column>
          <el-table-column  prop="enquiry"  min-width="95" :render-header="renderHeader"  label="询盘数">
          </el-table-column>
          <el-table-column  prop="avgVisitTime"   min-width="120"  label="平均访问时长">
             <template scope="scope" >
              <div>{{scope.row.avgVisitTime | time-formater-second-hour}}</div>
            </template>
          </el-table-column>
          <el-table-column  prop=""   min-width="135"  label="最后修改时间">
            <template scope="scope" >
              <div>{{scope.row.updateTime | time-formater-no-second}}</div>
            </template>
          </el-table-column>
          <el-table-column  prop="userName"  min-width="120"  label="创建人">
            <template scope="scope" >
              <div >
                <span class="overhideName" :title="scope.row.userName">{{scope.row.userName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="activityStatus" label="活动状态" min-width="90" >
            <template scope="scope" >
              <div v-if='scope.row.activityStatus'>已生效 </div>
              <div v-else style="color:#F86563">未生效</div>
            </template>
          </el-table-column>
          <el-table-column  prop="activityStatus" label="操作"  class="record-opt"  min-width="210">
            <template scope="scope">
              <span class="item" >
                <el-tooltip effect="dark" content="点击以切换活动生效状态" placement="top">
                <el-switch  v-model="scope.row.activityStatus" on-text="" off-text=""  @change="changeType(scope.row)">
                </el-switch>
              </el-tooltip>
              </span>
               <span class="item" >
                <el-tooltip effect="dark" content="推广" placement="top">
                  <span type="info" v-if="scope.row.activityStatus" style="cursor:pointer"  @click="shareBox(false,scope.row)"><i  class="icon-ziyouhuodong"></i></span>
                  <span type="info" v-else  disabled><i style="color:#c3bfbf;cursor:auto" class="icon-ziyouhuodong"></i></span>
                </el-tooltip>
               </span>
              <span class="item" >
                <el-tooltip effect="dark" content="编辑" placement="top">
                <i class="icon-pen"  @click="toEdit(scope.row, scope.row.activityStage)"></i>
                </el-tooltip>
              </span>
              <span class="item">
                <el-tooltip effect="dark" content="复制" placement="top">
                <span type="info" @click="addRow(scope.row)"><i class="icon-copy"></i></span>
                </el-tooltip>
              </span>
              <span class="item">
                <el-tooltip effect="dark" content="删除" placement="top">
                <span type="info" @click="delProd(false, scope.row.id, scope.row.activityStatus)"><i class="icon-trash"></i></span>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="load-container" v-if="actloading" style="margin:200px 0px 500px 0px">
        <div class="loading loading-circle"></div>
      </div>
      <!-- <div v-if="actloading" class="loading loading-circle"></div> -->
      <div class="no-data" v-if="noData">
        <img src="../../assets/img/monitor/noData.png" alt="">
          <p style="margin-top:32px;font-size:14px;">暂无数据，请先创建营销活动</p>
      </div>
      <el-pagination v-if="paginationShow"
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[10, 20, 30, 40]"
      @size-change="listSizeChange"
      :page-size="pageSize"
      :total="totalCount"
      :current-Page="pageIndex"
       @current-change="pager"></el-pagination>
    </div>
    
    <DialogBox :config="oconfig" @sure="confirmOk"></DialogBox>
    <DialogBox :config="oconfigshare" @sure="shareOk"></DialogBox>
    <DialogBox :config="oconfigtype" @sure="changeTypeOk" @close='canceltab'></DialogBox>
    <DialogBox :config="oconfigtypeTwo"  @sure="changeTypeOkTwo" @close='canceltabTwo'></DialogBox> 
    <DialogBox :config="oconfigNodel" @sure="nodel" class="Ikonw"></DialogBox>  
    <addACtivitymodel :activityOneId='activiId' ></addACtivitymodel>

  </div>
</template>
<script>

import { mapGetters } from 'vuex'
import activityApi from '../../api/activityApi'
import DialogBox from '../../components/box/dialogBox'
import addACtivitymodel from './addActivity/addACtivitymodel'
// import {getTmplContent} from '@/common/TmplContent'

export default {
  name: 'Product',
  props: {
  },
  data () {
    return {
      noData: false,
      paginationShow: false,
      activitylist: [],
      getUser: true,
      activiId: '',
      actmodelshow: false,
      tabModel: '1',
      showOrHide: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      groupList: [],
      form: {
        activityTitle: '',
        timeFlag: '',
        queryUserId: ''
      },
      oconfigNodel: {
        visible: false,
        notice: '',
        sureText: '知道了',
        cancelText: '',
        callback: null,
        flag: 0,
        showclosebtn: true,
        popovercls: 'confirm-pop'
      },
      oconfigtypeTwo: {
        visible: false,
        notice: '',
        sureText: '确定',
        cancelText: '取消',
        callback: null,
        flag: 0,
        showclosebtn: true,
        popovercls: 'confirm-pop'
      },
      oconfigtype: {
        visible: false,
        notice: '',
        sureText: '确定',
        cancelText: '取消',
        callback: null,
        flag: 0,
        showclosebtn: true,
        popovercls: 'confirm-pop'
      },
      oconfigshare: {
        visible: false,
        notice: '',
        sureText: '确定',
        cancelText: '取消',
        callback: null,
        flag: 0,
        showclosebtn: true,
        popovercls: 'confirm-pop'
      },
      oconfig: {
        visible: false,
        notice: '',
        sureText: '确定',
        cancelText: '取消',
        callback: null,
        flag: 0,
        showclosebtn: true,
        popovercls: 'confirm-pop'
      },
      isBatch: false,
      singleRecord: {
        id: ''
      },
      shopId: 0,
      changeStatus: 0,
      homepage: process.env.HOMEPAGE,
      nowRow: null,
      totalCount: 0
    }
  },
  components: {
    DialogBox,
    addACtivitymodel
  },
  methods: {
    // 点击进入详情 查看
    titleToSee (row) {
      localStorage.setItem('tmplType', 'activityTmpl')
      this.$store.commit('DEVELOP_ACTIVITYSENDINFO', { first: '', second: row.activityContent, third: '', four: {} })
      this.$router.push({path: '/preview?type=2'})
    },
    // 已生效的弹窗取消按钮 让开关回复原始
    canceltab () {
      let list = this.activitylist
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === this.singleRecord.id) {
          list[i].activityStatus = true
          // this.changeStatus = 1
        }
      }
      // this.changeStatus = 1
      // activityApi.updateStatus({id: this.singleRecord.id, activityStatus: this.changeStatus}).then(res => {
      //   if (!res.data.code) {
      //     this.$store.dispatch('getActivityList', {page: this.pageIndex, shopId: this.shopId})
      //   }
      // })
    },
    // 未生效的弹窗取消按钮 让开关回复原始
    canceltabTwo () {
      let list = this.activitylist
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === this.singleRecord.id) {
          list[i].activityStatus = false
          // this.changeStatus = 1
        }
      }
      // this.changeStatus = 0
      // activityApi.updateStatus({id: this.singleRecord.id, activityStatus: this.changeStatus}).then(res => {
      //   if (!res.data.code) {
      //     this.$store.dispatch('getActivityList', {page: this.pageIndex, shopId: this.shopId})
      //   }
      // })
    },
    changeTypeOkTwo () {
      let list = this.activitylist
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === this.singleRecord.id) {
          // list[i].activityStatus = true
          this.changeStatus = 1
        }
      }
      activityApi.updateStatus({id: this.singleRecord.id, activityStatus: this.changeStatus}).then(res => {
        if (!res.data.code) {
          this.$message({
            type: 'success',
            message: '活动状态修改成功'
          })
          this.activitylist = []
          this.getactList()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    changeTypeOk () {
      console.log(this.activitylist)
      let list = this.activitylist
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === this.singleRecord.id) {
          // list[i].activityStatus = true
          this.changeStatus = 0
        }
      }
      activityApi.updateStatus({id: this.singleRecord.id, activityStatus: this.changeStatus}).then(res => {
        if (!res.data.code) {
          this.$message({
            type: 'success',
            message: '活动状态修改成功'
          })
          this.activitylist = []
          this.getactList()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 切换活动状态
    changeType (row) {
      // console.log(row, index)
      localStorage.setItem('rowid', row.id)
      this.singleRecord.id = row.id
      if (!row.activityStatus) {
        let notice = '活动正在生效中'
        Object.assign(this.oconfigtype, {visible: true, notice: notice, message: '取消生效后将无法访问此活动页确定要取消吗', flag: 0})
        // row.activityStatus = true
        // this.changeStatus = 0
      } else {
        let notice = '确定要生效活动吗？'
        Object.assign(this.oconfigtypeTwo, {visible: true, notice: notice, message: '', flag: 0})
        // row.activityStatus = false
        // this.changeStatus = 1
      }
    },
    // 弹窗的tab选择
    choseTab () {
      if (this.tabModel === 1) {
        this.changeTab = true
      } else {
        this.changeTab = false
      }
    },
    // 分页
    pager (pageIndex) {
      this.pageIndex = pageIndex
      this.activitylist = []
      Object.assign(this.form, {page: this.pageIndex})
      this.actloading = true
      this.shopId = localStorage.getItem('shopId')
      activityApi.getactList({page: this.pageIndex, shopId: this.shopId, size: this.pageSize, activityTitle: this.form.activityTitle, queryUserId: this.form.queryUserId, timeFlag: this.form.timeFlag}).then(res => {
        let rec = res.data.data
        this.totalCount = res.data.data.totalCount
        if (rec) {
          for (var i = 0; i < rec.records.length; i++) {
            if (rec.records[i].activityStatus === 1) {
              rec.records[i].activityStatus = true
            } else {
              rec.records[i].activityStatus = false
            }
          }
          this.activitylist = rec.records
          console.log(rec.records)
          // if (this.activitylist.length > 10) {
          //   this.paginationShow = true
          // } if (this.activitylist.length < 10 || !this.activitylist) {
          //   this.paginationShow = false
          // }
          this.actloading = false
        } else {
          this.paginationShow = false
        }
      })
    },
    listSizeChange (size) {
      this.pageSize = size
      this.pageIndex = 1
      Object.assign(this.form, {size: this.pageSize})
      this.activitylist = []
      this.actloading = true
      this.shopId = localStorage.getItem('shopId')
      activityApi.getactList({page: this.pageIndex, shopId: this.shopId, size: this.pageSize, activityTitle: this.form.activityTitle, queryUserId: this.form.queryUserId, timeFlag: this.form.timeFlag}).then(res => {
        let rec = res.data.data
        this.totalCount = res.data.data.totalCount
        if (rec) {
          for (var i = 0; i < rec.records.length; i++) {
            if (rec.records[i].activityStatus === 1) {
              rec.records[i].activityStatus = true
            } else {
              rec.records[i].activityStatus = false
            }
          }
          this.activitylist = rec.records
          console.log(rec.records)
          if (this.activitylist.length > 0) {
            this.paginationShow = true
          }
          this.actloading = false
        } else {
          this.paginationShow = false
        }
      })
    },
    toEdit (row, activityStage) {
      console.log(row)
      localStorage.setItem('updateId', row.id)
      let pramas = {}
      pramas.activityDesc = row.activityDesc
      pramas.activityTitle = row.activityTitle
      pramas.url = row.unicode
      this.$store.commit('DEVELOP_ACTIVITYSENDINFO', { first: {tmplId: row.templateId}, second: row.activityContent, third: pramas, four: {} })
      this.$store.commit('DEVELOP_ACTIVITYCONTENTLIST', row.templateContent)
      this.$router.push({path: '/addActivity?activityStage=0' + '&activityStatus=' + row.activityStatus})
    },
    addRow (row) {
      activityApi.copyActivity({unicode: row.unicode}).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '复制成功'
          })
          this.getactList()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    renderHeader (h, { column, $index }) {
      switch ($index) {
        case 4:
          return (
            <div >询盘数&nbsp;<el-tooltip class="item" effect="dark" content="从活动页面跳转到官网添加询盘的次数" placement="top">
            <span class="icon-font title-icon">&#xe6e0;</span>
          </el-tooltip></div>
          )
      }
    },
    // enter搜索
    doSearch (event) {
      var e = event || window.event
      if (e && e.keyCode === 13) {
        this.searchFormEnter()
      }
    },
    searchFormEnter () {
      console.log(this.form)
      this.form.activityTitle = this.form.activityTitle.replace(/(^\s*)|(\s*$)/g, '')
      console.log(this.form.activityTitle)
      this.activitylist = []
      this.actloading = true
      this.noData = false
      this.shopId = localStorage.getItem('shopId')
      activityApi.getactList({page: this.pageIndex, shopId: this.shopId, activityTitle: this.form.activityTitle, queryUserId: this.form.queryUserId}).then(res => {
        let rec = res.data.data
        this.totalCount = res.data.data.totalCount
        console.log(rec.totalCount === 0)
        if (rec.totalCount === 0) {
          this.noData = true
          this.paginationShow = false
        }
        if (rec) {
          for (var i = 0; i < rec.records.length; i++) {
            if (rec.records[i].activityStatus === 1) {
              rec.records[i].activityStatus = true
            } else {
              rec.records[i].activityStatus = false
            }
          }
          this.activitylist = rec.records
          console.log(rec.records)
          if (this.activitylist.length > 0) {
            this.paginationShow = true
          }
          if (rec.totalCount < 10) {
            this.paginationShow = false
          }
          this.actloading = false
        } else {
          this.paginationShow = false
        }
      })
    },
    searchForm () {
      this.form.page = 1
      this.activitylist = []
      this.actloading = true
      this.noData = false
      this.shopId = localStorage.getItem('shopId')
      activityApi.getactList({page: this.pageIndex, shopId: this.shopId, activityTitle: this.form.activityTitle, queryUserId: this.form.queryUserId, timeFlag: this.form.timeFlag}).then(res => {
        let rec = res.data.data
        this.totalCount = res.data.data.totalCount
        if (rec.totalCount === 0) {
          this.noData = true
          this.paginationShow = false
        }
        if (rec.totalCount < 10) {
          this.paginationShow = false
        }
        if (rec) {
          for (var i = 0; i < rec.records.length; i++) {
            if (rec.records[i].activityStatus === 1) {
              rec.records[i].activityStatus = true
            } else {
              rec.records[i].activityStatus = false
            }
          }
          this.activitylist = rec.records
          console.log(rec.records)
          if (this.activitylist.length > 0) {
            this.paginationShow = true
          }
          if (rec.totalCount < 10) {
            this.paginationShow = false
          }
          this.actloading = false
        } else {
          this.paginationShow = false
        }
      })
      // this.$store.dispatch('getActivityList', this.form)
    },
    // 推广 确定按钮
    shareOk () {
      // console.log('shareokkkkk')
      this.$router.push({path: '/addActivity'})
    },
    // 操作里的 分享按钮
    shareBox (isBatch, row) {
      // console.log(row)
      localStorage.setItem('unicodeUrl', row.unicode)
      this.activiId = row.id + ''
      if (!row.activityStatus) {
        let notice = '活动还未生效，是否现在编辑生效？'
        Object.assign(this.oconfigshare, {visible: true, notice: notice, message: '', flag: 0})
      } else if (row.activityStatus) {
        this.$store.commit('DEVELOP_ADDEXTENSION', { isAddExtension: true })
        localStorage.setItem('imageUrl', row.activityContent)
        this.$store.commit('DEVELOP_ADDSUCCESS', { isAddSuccess: false, sendType: this.activeMenu })
      }
    },
    // 删除弹框
    delProd (isBatch, id, status) {
      this.isBatch = isBatch
      this.singleRecord = {id: id}
      if (status) {
        let notice = '无法删除生效中的活动'
        Object.assign(this.oconfigNodel, {visible: true, notice: notice, message: '请将活动取消生效后再试', flag: 0})
      } else {
        let notice = '是否确认删除该活动'
        Object.assign(this.oconfig, {visible: true, notice: notice, flag: 0})
      }
    },
    nodel () {
    },
    // 删除 确定
    confirmOk () {
      activityApi.deleteActivity({id: this.singleRecord.id}).then(res => {
        if (!res.data.code) {
          this.activitylist = []
          this.getactList()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getactList (prams) {
      this.actloading = true
      this.paginationShow = false
      this.shopId = localStorage.getItem('shopId')
      activityApi.getactList({page: this.pageIndex, shopId: this.shopId, queryUserId: this.form.queryUserId}).then(res => {
        let rec = res.data.data
        if (res.data.data.totalCount) {
          this.totalCount = res.data.data.totalCount
        }
        if (rec.totalCount === 0) {
          this.noData = true
        }
        if (rec) {
          for (var i = 0; i < rec.records.length; i++) {
            if (rec.records[i].activityStatus === 1) {
              rec.records[i].activityStatus = true
            } else {
              rec.records[i].activityStatus = false
            }
          }
          this.activitylist = rec.records
          // console.log(rec.records)
          if (this.activitylist.length > 0) {
            this.paginationShow = true
          }
          if (rec.totalCount < 10) {
            this.paginationShow = false
          }
          this.actloading = false
        } else {
          this.noData = true
          this.paginationShow = false
        }
      })
    }
  },
  beforeMount () {
    console.log(this.$route.query)
    let userInfo = JSON.parse(localStorage.user)
    if (userInfo.subUserList) {
      if (userInfo.subUserList.length > 0) {
        this.groupList.unshift({name: userInfo.name ? userInfo.name : userInfo.loginAccount, id: userInfo.userId})
        this.groupList.unshift({name: '全部账号', id: ''})
      } else {
        // this.getUser = false
      }
    } else {
      // this.getUser = false
    }
    let urlid = this.$route.query.id
    if (urlid) {
      console.log('cunzai')
      this.form.queryUserId = urlid
    }
    let teamShwoOrHide = localStorage.getItem('isMainAccount')
    if (teamShwoOrHide === 'true') {
      this.getUser = true
    } else {
      this.getUser = false
    }
    this.getactList()
  },
  watch: {
  },
  computed: mapGetters({
  }),
  created () {
    // this.$store.dispatch('getActivityList', {page: this.pageIndex, shopId: this.shopId})
    this.groupList = JSON.parse(localStorage.getItem('user')).subUserList
  },
  mounted () {
  }
}
</script>
<style lang='less' rel="stylesheet/less">
@import '../../assets/style/variable';
@import '../../assets/style/page';
@import '../../assets/style/loading.css';
@c-border1:#cbd6e3;
@c-toptitle: #33475B;
.text-ellipsis(){
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.right-search2{
  margin: 12px 20px;
  vertical-align: middle;
  text-align: right;
  .el-button{
    // vertical-align: top;
    font-size: 13px;
    vertical-align:initial;
    a{
      color: @white;
    }
  }
  .el-button.addproduct{
    vertical-align: top;
    margin-left: 8px
  }
  *{
    vertical-align: middle;
  }
}
.no-data a{
  color: @white;
}
.act-container{
  min-height: calc(~'100vh - 215px');
  .el-tooltip{
    cursor: pointer;
  }
  
  .el-table tr{
    height: 60px;
  }
  .my-dialog .el-dialog .confirm-main{
    margin-top: 15px;
    margin-left: 29px
  }
  .my-dialog .el-dialog .confirm-btn{
    margin-top: 36px
  }
  .my-dialog .el-dialog .name-wrapper{
    overflow:visible;
    white-space:normal;
    color: #8f9faf
  }
  .el-dialog__header{
    padding-bottom: 20px;
    border-bottom: 1px solid #DFE3EB
  }
  .Ikonw{
    .message{
      margin: 15px 0 21px 68px !important;
    }
    .confirm-btn{
      margin-top: 21px !important;
    }
  }
  .input-sel-search{
    width: 240px;
    margin:0 8px;
    border: 1px solid #cbd6e3;
    border-radius: 4px;
    .el-input__inner{
      height: 34px;
      &:focus{
        border: 1px solid #02AAAA;
      }
    }
    *{
      border-color: #CBD6E3;
    }
    .el-button{
      width:33px;
      border:none;
      padding:0 0;
    }
    .el-input{
      color: #333;
    }
    .el-input__inner{
      // margin-right: -3px;
      width: 209px;
      border:none;
    }
    .el-input-group__append{
      border:none;
      border-left: 1px solid #cbd6e3;
    }
    .el-icon-search{
      margin-top: 5px;
    }
  }
  .el-table th{
    height:48px;
    line-height: 48px;
  }
  .el-table th, .el-table__header-wrapper thead div{
    background-color: #F5F8FA;
  }
  .el-tooltip__popper.is-dark{
    background-color: #415b77;
  }
  .el-table--enable-row-hover .el-table__body tr{
    td:last-child a{
      display: none;
    }
    &:hover td{
      background-color: #F5F8FA;
    }
    &:hover td:last-child a{
      display: inline-block;
    }
  }
  .el-table--border th, .el-table--border td{
    border-right: 0;
  }
  .el-table td{
    padding-top: 20px;
    height: 72px;
    vertical-align: top;
  }
  // .scope-maxlength{
  //   max-width: 191px;
  //   display: inline-block;
  // }
  .el-table__body .cell{
    padding-right: 0;
    div{
      .overhide{
        display: block;
        width: 160px;
        .text-ellipsis()
      }
      .overhideName{
        display: block;
        width: 93px;
        .text-ellipsis()
      }
    }
  }
  // .el-table__body .name-wrapper{
  //   width: 80%;
  //   .text-ellipsis()
  // }
  .el-table th:nth-child(3){
    text-align: center;
  }
}
.product-tab{
  [class^="icon"]{
    margin-left: 10px;
    font-size: 16.2px;
    color: rgb(104, 101, 101) ;
    cursor: pointer;
  }
  img{
    width: 63px;
    height: 63px;
  }
}
.prod-box.list-box{
  position: relative;
  .opt-box{
    position: absolute;
    top: 0;
    left: 42px;
    border-bottom: 0;
    border-left: 0;
    z-index: 99;
  }
  .chked-opt{
    label, a{
      padding: 0 15px 0 15px;
      margin: 0;
      color: @mainFontColor;
      font-weight: normal;
    }
    i{
      margin-right: 5px;
    }
  }
}
.group-model{
  .confirm-btn{
    text-align: center;
  }
}
.el-select-group{
  li{
    padding-left: 40px;
    color: @textColor;
  }
  li:nth-child(1){
    padding-left: 10px;
  }
}
.el-select-dropdown{
  .el-select-group__title{
    height: 0;
  }
}
.el-select-dropdown__item.selected{
  background-color: #e6f6f6;
  color: @textColor;
  &.hover{
    background-color: #f4f8fb;
  }
}
/*.name-wrapper{
  width: 60px;
}*/
.name-wrapper{
  display: inline-block;
  max-width: 440px;
  span{
    display: inline-block;
  }
}
.name-wrapper:hover{
  a{
    color:#5488F9;
  }
}
.cate-pop{
  display: inline-block;
  max-width: 600px;
  padding: 10px;
  p{
    line-height: 20px;
    text-align: center;
  }
}
.el-table__empty-block{
  display: none;
}
.el-table {
  .sort-caret.ascending{
     border-bottom: 5px solid #B0C1D4
  }
  .sort-caret.descending{
     border-top: 5px solid #B0C1D4
  }
  .descending .sort-caret.descending{
    border-top-color: #02AAAA;
  }
  .ascending .sort-caret.ascending{
    border-bottom-color: #02AAAA;
  }
}
.el-tooltip__popper.is-none{
  display: none;
}
</style>
