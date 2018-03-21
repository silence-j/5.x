<template>
  <div class="busness_detail">
    <router-link to="/tradeDetect">
      <p class="title">
        <span><img src="../../../../src/assets/img/left.png" alt="" class="left-back" /></span>
        返回客户开发</p>
    </router-link>
    <div class="task_prompt">"{{taskName}}"侦探任务处理结果</div>
    <div class="busness_detail_list">
      <!--暂无数据-->
      <div class="no-data" v-show="companyIsNoData">
        <div class="no-info">
          <img src="../../../assets/img/monitor/no-post.png" alt="">
          <p style="margin-top: 10px;">暂无数据</p>
        </div>
      </div>
      <ul class="left_compny_list">
        <div class="loading loading-circle company_loading" v-if="companyIsLoading"></div>
        <li class="left_compny" v-else v-for="(company, index) in companyList" @click="changeIndeFuc(index, company.id)" :class="{curr: currIndex==index}">
          <p class="name">{{ company.name}}</p>
          <p class="info_desc">
            <span>海关数据 {{ company.dashboard.customsSize}}</span>
            <span>linkedin {{ company.dashboard.linkedInSize}}</span>
            <span>facebook {{ company.dashboard.facebookSize}}</span>
          </p>
        </li>
      </ul>
      <div class="right_data_filter">
        <div class="top_filter">
          <el-select v-model="filterType" placeholder="请选择" @change="changeCountry" class="bordernone" style="width:118px;">
              <el-option label="海关数据" value="3"></el-option>
              <el-option label="Facebook" value="2"></el-option>
              <el-option label="Linkedin" value="1"></el-option>
          </el-select>
        </div>
        <div class="loading loading-circle company_loading" v-if="employeesIsLoading"></div>
        <channelData :channelChildObj="channelDataObj" :companyIdChild="companyId" :filterTypeChild="filterType" v-if="!employeesIsLoading && filterType!='3'"></channelData>
        <customsData :customsChildObj="customsDataObj" :companyIdChild="companyId" v-if="!employeesIsLoading && filterType=='3' && customsDataObj.records.length>0"></customsData>
      </div>
    </div>
  </div>
</template>

<script>
  import DevelopAPI from '@/api/developAPI'
  import channelData from './channelData.vue'
  import customsData from './customsData.vue'
  export default{
    name: 'BusnessSpyDetail',
    data () {
      return {
        filterType: '3',
        currIndex: 0,
        taskId: this.$route.query.taskId,
        taskName: this.$route.query.taskName,
        companyList: [],
        customsDataObj: {
          records: []
        },
        channelDataObj: {
          records: []
        },
        companyIsLoading: true,   // 公司数据是否在加载
        companyIsNoData: false,
        companyId: '',
        channelPage: 1,
        employeesIsLoading: true,
        pageSize: 10
      }
    },
    computed: {
    },
    components: {
      channelData,
      customsData
    },
    mounted () {
      this.getCompanyListFunc()
    },
    methods: {
      // 更换筛选
      changeCountry () {
        if (this.filterType === '1') {    // linkedin
          this.getLinkedinListFunc()
        } else if (this.filterType === '2') {  // facebook
          this.getFacebookListFunc()
        } else {   // 海关数据
          this.getCustomsListFunc()
        }
      },
      // 变更索引
      changeIndeFuc (index, companyId) {
        this.currIndex = index
        this.companyId = companyId
        this.filterType = '3'
        this.getCustomsListFunc()
      },
      // 获取公司列表
      getCompanyListFunc () {
        this.companyIsNoData = false
        this.companyIsLoading = true
        let params = {
          page: 1,
          pageSize: 10,
          taskId: this.taskId
        }
        DevelopAPI.getCompanyList(params).then(res => {
          if (res.data.code === 0) {
            this.companyIsLoading = false
            this.companyList = res.data.data.records
            if (this.companyList.length === 0) {
              this.companyIsNoData = true
            } else {
              this.companyId = this.companyList[0].id
              this.channelPage = 1
              this.getCustomsListFunc()
            }
          }
        })
      },
      // 获取linkedin员工列表
      getLinkedinListFunc () {
        if (this.companyId !== '') {
          this.employeesIsLoading = true
          let params = {
            taskId: this.taskId,
            companyId: this.companyId,
            page: this.channelPage,
            pageSize: this.pageSize
          }
          DevelopAPI.getLinkedinList(params).then(res => {
            if (res.data.code === 0) {
              this.employeesIsLoading = false
              this.channelDataObj = res.data.data
            }
          })
        }
      },
      // 获取facebook员工列表
      getFacebookListFunc () {
        if (this.companyId !== '') {
          this.employeesIsLoading = true
          let params = {
            taskId: this.taskId,
            companyId: this.companyId,
            page: this.channelPage,
            pageSize: this.pageSize
          }
          DevelopAPI.getFacebookList(params).then(res => {
            if (res.data.code === 0) {
              this.employeesIsLoading = false
              this.channelDataObj = res.data.data
            }
          })
        }
      },
      // 获取公司海关列表
      getCustomsListFunc () {
        if (this.companyId !== '') {
          this.employeesIsLoading = true
          let params = {
            taskId: this.taskId,
            companyId: this.companyId,
            page: this.channelPage,
            pageSize: this.pageSize
          }
          DevelopAPI.getCustomsList(params).then(res => {
            if (res.data.code === 0) {
              this.employeesIsLoading = false
              this.customsDataObj = res.data.data
            }
          })
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .right_data_filter{
    .bordernone{
      .el-input{
        .el-input__inner{
          border:none;
          font-size:16px;
          background: transparent;
        }
      }
    }
  }
  .company_loading{
    margin-top:130px;
  }
  .task_prompt{
    font-size: 13px;
    color: #4F6D95;
    line-height: 18px;
    padding-bottom:8px;
    border-bottom: 2px solid #5488F9;;
  }
  .busness_detail {
    padding-top: 30px;
    margin: 0 auto;
    width: 1200px;
    .title {
      font-size: 13px;
      color: #7C98B6;
      margin-bottom: 24px;
      em {
        color: #7C98B6;
        font-weight: bold;
        font-size: 18px;
        margin-right: 8px;
      }
    }
    .busness_detail_list{
      margin-top:2px;
      width:100%;
      overflow:hidden;
      .left_compny_list{
        float: left;
        width:315px;
        height:829px;
        overflow-y:auto;
        .left_compny.curr{
          background: #DCE7FD;
          border-left:2px solid #5488F9;
          .name{
            color:#5488F9;
          }
        }
        .left_compny{
          padding:16px 22px 16px 8px;
          cursor: pointer;
          .name{
            font-size: 14px;
            color: #33475B;
            line-height: 18px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .info_desc{
            margin-top:8px;
            font-size: 13px;
            color: #4F6D95;
            line-height: 18px;
            span{
              margin-right:10px;
            }
          }
        }
      }
      .right_data_filter{
        float: left;
        width:868px;
        margin-left:16px;
        height:829px;
        .top_filter{
          /*border-bottom:1px solid #DFE3EB;*/
          padding:6px 5px;
        }
        .channel_data_List{
          height: 781px;
          overflow-y: auto;
          .channel_data:hover{
            box-shadow: 0 0 14px rgba(84, 136, 249,.25);
          }
          .channel_data{
            cursor: pointer;
            float:left;
            width:48%;
            background: #fff;
            margin-top:16px;
            padding:16px 0px;
            font-size:14px;
            line-height:18px;
            box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.08);
            border-radius: 4px;
            height:126px;
            p{
              padding:0 16px;
              em{
                color:#F44336;
              }
            }
            .nick{
              color:#5488F9;
              font-size:14px;
              line-height: 18px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .second_desc{
              margin-top:8px;
              color:#7c98b6;
              word-break: break-all;
              max-height: 36px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              /* autoprefixer: off*/
              -webkit-box-orient: vertical;
              /* autoprefixer: on*/
              -ms-box-orient: vertical;
              -webkit-line-clamp: 2;
              -moz-line-clamp: 2;
              -ms-line-clamp: 2;
            }
            .desc{
              margin-top:8px;
              color:#33475B;
              word-break: break-all;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              /* autoprefixer: off*/
              -webkit-box-orient: vertical;
              /* autoprefixer: on*/
              -ms-box-orient: vertical;
              -webkit-line-clamp: 3;
              -moz-line-clamp: 3;
              -ms-line-clamp: 3;
            }
          }
          .channel_data:nth-child(2n){
            margin-left:1.85%;
          }
          .channel_data:nth-child(1){
            margin-top:0px;
          }
          .channel_data:nth-child(2){
            margin-top:0px;
          }
        }
        .customs_data_List{
          height: 781px;
          overflow-y: scroll;
          box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.08);
          border-radius: 4px;
          .customs_data:hover{
            background: #F5F8FA;
          }
          .customs_data{
            font-size: 14px;
            line-height: 18px;
            padding:16px 0;
            background: #fff;
            .info_line{
              margin-top:16px;
            }
            .info_line:first-child{
              margin-top:0px;
            }
            .label{
              width:34.73%;
              text-align: right;
              display: inline-block;
              color: #7C98B6;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .read.desc{
              color:#F44336;
            }
            .desc{
              width: calc(~'65.27% - 24px');
              text-align: left;
              display: inline-block;
              margin-left:24px;
              color: #33475B;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
</style>
